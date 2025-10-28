// Offline functionality utilities

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

// Offline queue item interface
export interface OfflineQueueItem {
  id: string;
  type: 'create' | 'update' | 'delete' | 'batch';
  collection: string;
  documentId?: string;
  data?: any;
  timestamp: number;
  retryCount: number;
  lastError?: string;
  userId: string;
  priority: 'low' | 'medium' | 'high';
}

// Offline sync status
export type OfflineSyncStatus = 'idle' | 'syncing' | 'success' | 'error' | 'paused';

// Offline configuration
export interface OfflineConfig {
  maxQueueSize: number;
  maxRetries: number;
  retryDelay: number;
  syncInterval: number;
  enableBackgroundSync: boolean;
  persistQueue: boolean;
  queueKey: string;
}

/**
 * Default offline configuration
 */
export const DEFAULT_OFFLINE_CONFIG: OfflineConfig = {
  maxQueueSize: 1000,
  maxRetries: 3,
  retryDelay: 5000,
  syncInterval: 30000, // 30 seconds
  enableBackgroundSync: true,
  persistQueue: true,
  queueKey: '@corpease/offline_queue',
};

/**
 * Add item to offline queue
 */
export async function addToOfflineQueue(
  item: Omit<OfflineQueueItem, 'id' | 'timestamp' | 'retryCount'>,
  config: OfflineConfig = DEFAULT_OFFLINE_CONFIG
): Promise<void> {
  try {
    const queue = await getOfflineQueue(config);
    const queueItem: OfflineQueueItem = {
      ...item,
      id: generateOfflineId(),
      timestamp: Date.now(),
      retryCount: 0,
    };

    // Check queue size limit
    if (queue.length >= config.maxQueueSize) {
      // Remove oldest items to make space
      const itemsToRemove = queue.length - config.maxQueueSize + 1;
      queue.splice(0, itemsToRemove);
    }

    queue.push(queueItem);
    await saveOfflineQueue(queue, config);

    console.log('Added to offline queue:', queueItem.type, queueItem.collection);

    // Try to sync immediately if online
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected) {
      syncOfflineQueue(config).catch(error => {
        console.warn('Immediate sync failed:', error);
      });
    }
  } catch (error) {
    console.error('Failed to add to offline queue:', error);
    throw error;
  }
}

/**
 * Get offline queue
 */
export async function getOfflineQueue(config: OfflineConfig = DEFAULT_OFFLINE_CONFIG): Promise<OfflineQueueItem[]> {
  try {
    if (!config.persistQueue) {
      return [];
    }

    const queueData = await AsyncStorage.getItem(config.queueKey);
    return queueData ? JSON.parse(queueData) : [];
  } catch (error) {
    console.error('Failed to get offline queue:', error);
    return [];
  }
}

/**
 * Save offline queue
 */
async function saveOfflineQueue(
  queue: OfflineQueueItem[],
  config: OfflineConfig = DEFAULT_OFFLINE_CONFIG
): Promise<void> {
  try {
    if (!config.persistQueue) {
      return;
    }

    await AsyncStorage.setItem(config.queueKey, JSON.stringify(queue));
  } catch (error) {
    console.error('Failed to save offline queue:', error);
    throw error;
  }
}

/**
 * Remove item from offline queue
 */
export async function removeFromOfflineQueue(
  itemId: string,
  config: OfflineConfig = DEFAULT_OFFLINE_CONFIG
): Promise<void> {
  try {
    const queue = await getOfflineQueue(config);
    const filteredQueue = queue.filter(item => item.id !== itemId);

    await saveOfflineQueue(filteredQueue, config);
    console.log('Removed from offline queue:', itemId);
  } catch (error) {
    console.error('Failed to remove from offline queue:', error);
    throw error;
  }
}

/**
 * Clear offline queue
 */
export async function clearOfflineQueue(config: OfflineConfig = DEFAULT_OFFLINE_CONFIG): Promise<void> {
  try {
    if (!config.persistQueue) {
      return;
    }

    await AsyncStorage.removeItem(config.queueKey);
    console.log('Offline queue cleared');
  } catch (error) {
    console.error('Failed to clear offline queue:', error);
    throw error;
  }
}

/**
 * Sync offline queue with server
 */
export async function syncOfflineQueue(config: OfflineConfig = DEFAULT_OFFLINE_CONFIG): Promise<{
  success: boolean;
  synced: number;
  failed: number;
  errors: string[];
}> {
  try {
    const queue = await getOfflineQueue(config);

    if (queue.length === 0) {
      return { success: true, synced: 0, failed: 0, errors: [] };
    }

    // Check network connectivity
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      throw new Error('No internet connection');
    }

    console.log(`Syncing ${queue.length} offline operations...`);

    const results = {
      synced: 0,
      failed: 0,
      errors: [] as string[],
    };

    // Sort by priority (high first)
    const sortedQueue = queue.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    // Process items in batches
    const batchSize = 10;
    for (let i = 0; i < sortedQueue.length; i += batchSize) {
      const batch = sortedQueue.slice(i, i + batchSize);

      for (const item of batch) {
        try {
          await processOfflineItem(item, config);
          await removeFromOfflineQueue(item.id, config);
          results.synced++;
        } catch (error) {
          results.failed++;
          results.errors.push(`${item.type} ${item.collection}: ${error}`);

          // Update retry count
          item.retryCount++;
          item.lastError = error instanceof Error ? error.message : 'Unknown error';

          // Remove if max retries exceeded
          if (item.retryCount >= config.maxRetries) {
            await removeFromOfflineQueue(item.id, config);
            results.errors.push(`Max retries exceeded for ${item.type} ${item.collection}`);
          } else {
            // Update item in queue
            const updatedQueue = await getOfflineQueue(config);
            const itemIndex = updatedQueue.findIndex(q => q.id === item.id);
            if (itemIndex !== -1) {
              updatedQueue[itemIndex] = item;
              await saveOfflineQueue(updatedQueue, config);
            }
          }
        }
      }
    }

    console.log(`Offline sync completed: ${results.synced} synced, ${results.failed} failed`);

    return {
      success: results.failed === 0,
      synced: results.synced,
      failed: results.failed,
      errors: results.errors,
    };
  } catch (error) {
    console.error('Offline sync failed:', error);
    throw error;
  }
}

/**
 * Process a single offline item
 */
async function processOfflineItem(
  item: OfflineQueueItem,
  config: OfflineConfig
): Promise<void> {
  // This would be implemented based on your Firebase service functions
  // For now, just simulate processing

  console.log(`Processing offline item: ${item.type} ${item.collection}`);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));

  // In a real implementation, you would call your Firebase service functions:
  // switch (item.type) {
  //   case 'create':
  //     await firestoreService.createDocument(item.collection, item.data);
  //     break;
  //   case 'update':
  //     await firestoreService.updateDocument(item.collection, item.documentId!, item.data);
  //     break;
  //   case 'delete':
  //     await firestoreService.deleteDocument(item.collection, item.documentId!);
  //     break;
  //   case 'batch':
  //     await firestoreService.batchWrite(item.data);
  //     break;
  // }

  // For now, just throw an error to simulate processing
  throw new Error(`Processing not implemented for ${item.type}`);
}

/**
 * Get offline queue status
 */
export async function getOfflineQueueStatus(config: OfflineConfig = DEFAULT_OFFLINE_CONFIG): Promise<{
  queueSize: number;
  isOnline: boolean;
  lastSyncTime?: number;
  needsSync: boolean;
}> {
  try {
    const queue = await getOfflineQueue(config);
    const netInfo = await NetInfo.fetch();

    // Get last sync time from storage
    const lastSyncKey = `${config.queueKey}_last_sync`;
    const lastSyncData = await AsyncStorage.getItem(lastSyncKey);
    const lastSyncTime = lastSyncData ? parseInt(lastSyncData, 10) : undefined;

    return {
      queueSize: queue.length,
      isOnline: netInfo.isConnected || false,
      lastSyncTime,
      needsSync: queue.length > 0 && (netInfo.isConnected || false),
    };
  } catch (error) {
    console.error('Failed to get offline queue status:', error);
    return {
      queueSize: 0,
      isOnline: false,
      needsSync: false,
    };
  }
}

/**
 * Generate unique ID for offline queue item
 */
function generateOfflineId(): string {
  return `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if device is offline
 */
export async function isOffline(): Promise<boolean> {
  try {
    const netInfo = await NetInfo.fetch();
    return !netInfo.isConnected;
  } catch {
    return true; // Assume offline if we can't check
  }
}

/**
 * Wait for network connectivity
 */
export async function waitForNetwork(timeout: number = 30000): Promise<boolean> {
  return new Promise((resolve) => {
    const startTime = Date.now();

    const checkConnection = async () => {
      const netInfo = await NetInfo.fetch();
      if (netInfo.isConnected) {
        resolve(true);
        return;
      }

      if (Date.now() - startTime > timeout) {
        resolve(false);
        return;
      }

      setTimeout(checkConnection, 1000);
    };

    checkConnection();
  });
}

/**
 * Setup offline sync interval
 */
export function setupOfflineSync(
  syncCallback: () => Promise<void>,
  interval: number = DEFAULT_OFFLINE_CONFIG.syncInterval,
  config: OfflineConfig = DEFAULT_OFFLINE_CONFIG
): () => void {
  const syncInterval = setInterval(async () => {
    try {
      const netInfo = await NetInfo.fetch();
      if (netInfo.isConnected) {
        await syncCallback();
      }
    } catch (error) {
      console.error('Offline sync interval error:', error);
    }
  }, interval);

  // Also sync when app comes back online
  const unsubscribe = NetInfo.addEventListener(state => {
    if (state.isConnected) {
      syncCallback().catch(error => {
        console.error('Offline sync on reconnect error:', error);
      });
    }
  });

  // Return cleanup function
  return () => {
    clearInterval(syncInterval);
    unsubscribe();
  };
}

/**
 * Get offline queue statistics
 */
export async function getOfflineQueueStats(config: OfflineConfig = DEFAULT_OFFLINE_CONFIG): Promise<{
  totalItems: number;
  itemsByType: Record<string, number>;
  itemsByPriority: Record<string, number>;
  oldestItem: number | null;
  retryItems: number;
  failedItems: number;
}> {
  try {
    const queue = await getOfflineQueue(config);
    const now = Date.now();

    const itemsByType: Record<string, number> = {};
    const itemsByPriority: Record<string, number> = {};
    let oldestItem: number | null = null;
    let retryItems = 0;
    let failedItems = 0;

    for (const item of queue) {
      // Count by type
      itemsByType[item.type] = (itemsByType[item.type] || 0) + 1;

      // Count by priority
      itemsByPriority[item.priority] = (itemsByPriority[item.priority] || 0) + 1;

      // Find oldest item
      if (oldestItem === null || item.timestamp < oldestItem) {
        oldestItem = item.timestamp;
      }

      // Count retry items
      if (item.retryCount > 0) {
        retryItems++;
      }

      // Count failed items
      if (item.retryCount >= config.maxRetries) {
        failedItems++;
      }
    }

    return {
      totalItems: queue.length,
      itemsByType,
      itemsByPriority,
      oldestItem,
      retryItems,
      failedItems,
    };
  } catch (error) {
    console.error('Failed to get offline queue stats:', error);
    return {
      totalItems: 0,
      itemsByType: {},
      itemsByPriority: {},
      oldestItem: null,
      retryItems: 0,
      failedItems: 0,
    };
  }
}

/**
 * Clean up old offline queue items
 */
export async function cleanupOfflineQueue(
  olderThanDays: number = 7,
  config: OfflineConfig = DEFAULT_OFFLINE_CONFIG
): Promise<number> {
  try {
    const queue = await getOfflineQueue(config);
    const cutoffTime = Date.now() - (olderThanDays * 24 * 60 * 60 * 1000);

    const filteredQueue = queue.filter(item => item.timestamp > cutoffTime);
    const removedCount = queue.length - filteredQueue.length;

    if (removedCount > 0) {
      await saveOfflineQueue(filteredQueue, config);
      console.log(`Cleaned up ${removedCount} old offline queue items`);
    }

    return removedCount;
  } catch (error) {
    console.error('Failed to cleanup offline queue:', error);
    return 0;
  }
}

/**
 * Export offline queue data for debugging
 */
export async function exportOfflineQueue(config: OfflineConfig = DEFAULT_OFFLINE_CONFIG): Promise<string> {
  try {
    const queue = await getOfflineQueue(config);
    const stats = await getOfflineQueueStats(config);

    return JSON.stringify({
      exportedAt: new Date().toISOString(),
      config,
      stats,
      items: queue.map(item => ({
        ...item,
        // Remove large data fields for export
        data: item.data ? 'DATA_PRESENT' : null,
      })),
    }, null, 2);
  } catch (error) {
    console.error('Failed to export offline queue:', error);
    return 'Failed to export offline queue';
  }
}

/**
 * Import offline queue data
 */
export async function importOfflineQueue(
  data: string,
  config: OfflineConfig = DEFAULT_OFFLINE_CONFIG
): Promise<void> {
  try {
    const parsed = JSON.parse(data);

    if (parsed.items && Array.isArray(parsed.items)) {
      await saveOfflineQueue(parsed.items, config);
      console.log(`Imported ${parsed.items.length} offline queue items`);
    }
  } catch (error) {
    console.error('Failed to import offline queue:', error);
    throw error;
  }
}
