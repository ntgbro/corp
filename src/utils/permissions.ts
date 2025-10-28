import { Platform, PermissionsAndroid, Alert } from 'react-native';

// Permission types
export type PermissionType =
  | 'camera'
  | 'photo_library'
  | 'location'
  | 'location_always'
  | 'location_when_in_use'
  | 'microphone'
  | 'contacts'
  | 'notifications'
  | 'storage'
  | 'phone_state'
  | 'bluetooth'
  | 'background_location';

// Permission status
export type PermissionStatus = 'granted' | 'denied' | 'blocked' | 'unavailable';

// Permission request result
export interface PermissionRequestResult {
  status: PermissionStatus;
  granted: boolean;
  canAskAgain: boolean;
  error?: string;
}

// Mock implementation
export const check = async (permission: string): Promise<string> => {
  console.log('Mock permission check:', permission);
  return 'granted';
};

export const request = async (permission: string): Promise<string> => {
  console.log('Mock permission request:', permission);
  return 'granted';
};

export const PERMISSIONS = {
  IOS: {
    CAMERA: 'ios.camera',
    PHOTO_LIBRARY: 'ios.photoLibrary',
    LOCATION_WHEN_IN_USE: 'ios.locationWhenInUse',
    LOCATION_ALWAYS: 'ios.locationAlways',
    MICROPHONE: 'ios.microphone',
    NOTIFICATION: 'ios.notification',
    MEDIA_LIBRARY: 'ios.mediaLibrary',
  },
  ANDROID: {
    CAMERA: 'android.camera',
    READ_EXTERNAL_STORAGE: 'android.readExternalStorage',
    WRITE_EXTERNAL_STORAGE: 'android.writeExternalStorage',
    ACCESS_FINE_LOCATION: 'android.accessFineLocation',
    ACCESS_BACKGROUND_LOCATION: 'android.accessBackgroundLocation',
    RECORD_AUDIO: 'android.recordAudio',
    POST_NOTIFICATIONS: 'android.postNotifications',
  },
};

export const RESULTS = {
  GRANTED: 'granted',
  DENIED: 'denied',
  BLOCKED: 'blocked',
  UNAVAILABLE: 'unavailable',
};

// Check if a permission is granted
export async function checkPermission(permission: PermissionType): Promise<PermissionStatus> {
  try {
    let permissionKey: any;

    switch (permission) {
      case 'camera':
        permissionKey = Platform.OS === 'ios'
          ? PERMISSIONS.IOS.CAMERA
          : PERMISSIONS.ANDROID.CAMERA;
        break;
      case 'photo_library':
        permissionKey = Platform.OS === 'ios'
          ? PERMISSIONS.IOS.PHOTO_LIBRARY
          : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
        break;
      case 'location':
      case 'location_when_in_use':
        permissionKey = Platform.OS === 'ios'
          ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
        break;
      case 'location_always':
        permissionKey = Platform.OS === 'ios'
          ? PERMISSIONS.IOS.LOCATION_ALWAYS
          : PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION;
        break;
      case 'microphone':
        permissionKey = Platform.OS === 'ios'
          ? PERMISSIONS.IOS.MICROPHONE
          : PERMISSIONS.ANDROID.RECORD_AUDIO;
        break;
      case 'notifications':
        permissionKey = Platform.OS === 'ios'
          ? PERMISSIONS.IOS.NOTIFICATION
          : PERMISSIONS.ANDROID.POST_NOTIFICATIONS;
        break;
      case 'storage':
        permissionKey = Platform.OS === 'ios'
          ? PERMISSIONS.IOS.MEDIA_LIBRARY
          : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;
        break;
      default:
        return 'unavailable';
    }

    const result = await check(permissionKey);

    switch (result) {
      case RESULTS.GRANTED:
        return 'granted';
      case RESULTS.DENIED:
        return 'denied';
      case RESULTS.BLOCKED:
        return 'blocked';
      case RESULTS.UNAVAILABLE:
        return 'unavailable';
      default:
        return 'unavailable';
    }
  } catch (error) {
    console.error('Permission check error:', error);
    return 'unavailable';
  }
}

// Request a permission
export async function requestPermission(
  permission: PermissionType,
  rationale?: {
    title: string;
    message: string;
    buttonPositive: string;
    buttonNegative?: string;
  }
): Promise<PermissionRequestResult> {
  try {
    let permissionKey: any;

    switch (permission) {
      case 'camera':
        permissionKey = Platform.OS === 'ios'
          ? PERMISSIONS.IOS.CAMERA
          : PERMISSIONS.ANDROID.CAMERA;
        break;
      case 'photo_library':
        permissionKey = Platform.OS === 'ios'
          ? PERMISSIONS.IOS.PHOTO_LIBRARY
          : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
        break;
      case 'location':
      case 'location_when_in_use':
        permissionKey = Platform.OS === 'ios'
          ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
        break;
      case 'location_always':
        permissionKey = Platform.OS === 'ios'
          ? PERMISSIONS.IOS.LOCATION_ALWAYS
          : PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION;
        break;
      case 'microphone':
        permissionKey = Platform.OS === 'ios'
          ? PERMISSIONS.IOS.MICROPHONE
          : PERMISSIONS.ANDROID.RECORD_AUDIO;
        break;
      case 'notifications':
        permissionKey = Platform.OS === 'ios'
          ? PERMISSIONS.IOS.NOTIFICATION
          : PERMISSIONS.ANDROID.POST_NOTIFICATIONS;
        break;
      case 'storage':
        permissionKey = Platform.OS === 'ios'
          ? PERMISSIONS.IOS.MEDIA_LIBRARY
          : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;
        break;
      default:
        return {
          status: 'unavailable',
          granted: false,
          canAskAgain: false,
          error: 'Permission not supported',
        };
    }

    const result = await request(permissionKey);

    const granted = result === RESULTS.GRANTED;
    let status: PermissionStatus;
    let canAskAgain = true;

    switch (result) {
      case RESULTS.GRANTED:
        status = 'granted';
        break;
      case RESULTS.DENIED:
        status = 'denied';
        canAskAgain = true;
        break;
      case RESULTS.BLOCKED:
        status = 'blocked';
        canAskAgain = false;
        break;
      case RESULTS.UNAVAILABLE:
        status = 'unavailable';
        canAskAgain = false;
        break;
      default:
        status = 'unavailable';
        canAskAgain = false;
    }

    return {
      status,
      granted,
      canAskAgain,
    };
  } catch (error) {
    console.error('Permission request error:', error);
    return {
      status: 'unavailable',
      granted: false,
      canAskAgain: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Check multiple permissions at once
export async function checkMultiplePermissions(
  permissions: PermissionType[]
): Promise<Record<PermissionType, PermissionStatus>> {
  const results: Record<PermissionType, PermissionStatus> = {} as Record<PermissionType, PermissionStatus>;

  for (const permission of permissions) {
    results[permission] = await checkPermission(permission);
  }

  return results;
}

// Request multiple permissions
export async function requestMultiplePermissions(
  permissions: PermissionType[]
): Promise<Record<PermissionType, PermissionRequestResult>> {
  const results: Record<PermissionType, PermissionRequestResult> = {} as Record<PermissionType, PermissionRequestResult>;

  for (const permission of permissions) {
    results[permission] = await requestPermission(permission);
  }

  return results;
}

// Show permission rationale dialog
export function showPermissionRationale(
  rationale: {
    title: string;
    message: string;
    buttonPositive: string;
    buttonNegative?: string;
  }
): Promise<boolean> {
  return new Promise((resolve) => {
    Alert.alert(
      rationale.title,
      rationale.message,
      [
        {
          text: rationale.buttonNegative || 'Cancel',
          style: 'cancel',
          onPress: () => resolve(false),
        },
        {
          text: rationale.buttonPositive,
          onPress: () => resolve(true),
        },
      ]
    );
  });
}

// Request permission with rationale
export async function requestPermissionWithRationale(
  permission: PermissionType,
  rationale: {
    title: string;
    message: string;
    buttonPositive: string;
    buttonNegative?: string;
  }
): Promise<PermissionRequestResult> {
  const currentStatus = await checkPermission(permission);

  if (currentStatus === 'denied') {
    const shouldShowRationale = await showPermissionRationale(rationale);
    if (!shouldShowRationale) {
      return {
        status: 'denied',
        granted: false,
        canAskAgain: true,
      };
    }
  }

  return await requestPermission(permission);
}

// Get permission status message
export function getPermissionStatusMessage(permission: PermissionType, status: PermissionStatus): string {
  const messages: Record<PermissionType, Record<PermissionStatus, string>> = {
    camera: {
      granted: 'Camera permission granted',
      denied: 'Camera access is required to take photos',
      blocked: 'Camera permission is blocked. Please enable it in settings',
      unavailable: 'Camera is not available on this device',
    },
    photo_library: {
      granted: 'Photo library access granted',
      denied: 'Photo library access is required to select images',
      blocked: 'Photo library permission is blocked. Please enable it in settings',
      unavailable: 'Photo library is not available on this device',
    },
    location: {
      granted: 'Location access granted',
      denied: 'Location access is required for delivery services',
      blocked: 'Location permission is blocked. Please enable it in settings',
      unavailable: 'Location services are not available on this device',
    },
    location_always: {
      granted: 'Background location access granted',
      denied: 'Background location access is required for order tracking',
      blocked: 'Background location permission is blocked. Please enable it in settings',
      unavailable: 'Background location is not available on this device',
    },
    location_when_in_use: {
      granted: 'Location access granted',
      denied: 'Location access is required for delivery services',
      blocked: 'Location permission is blocked. Please enable it in settings',
      unavailable: 'Location services are not available on this device',
    },
    microphone: {
      granted: 'Microphone access granted',
      denied: 'Microphone access is required for voice features',
      blocked: 'Microphone permission is blocked. Please enable it in settings',
      unavailable: 'Microphone is not available on this device',
    },
    notifications: {
      granted: 'Notification permission granted',
      denied: 'Notification permission is required for order updates',
      blocked: 'Notification permission is blocked. Please enable it in settings',
      unavailable: 'Notifications are not available on this device',
    },
    storage: {
      granted: 'Storage access granted',
      denied: 'Storage access is required to save files',
      blocked: 'Storage permission is blocked. Please enable it in settings',
      unavailable: 'Storage access is not available on this device',
    },
    contacts: {
      granted: 'Contacts access granted',
      denied: 'Contacts access is required for quick orders',
      blocked: 'Contacts permission is blocked. Please enable it in settings',
      unavailable: 'Contacts are not available on this device',
    },
    phone_state: {
      granted: 'Phone state access granted',
      denied: 'Phone state access is required for some features',
      blocked: 'Phone state permission is blocked. Please enable it in settings',
      unavailable: 'Phone state access is not available on this device',
    },
    bluetooth: {
      granted: 'Bluetooth access granted',
      denied: 'Bluetooth access is required for device connectivity',
      blocked: 'Bluetooth permission is blocked. Please enable it in settings',
      unavailable: 'Bluetooth is not available on this device',
    },
    background_location: {
      granted: 'Background location access granted',
      denied: 'Background location access is required for order tracking',
      blocked: 'Background location permission is blocked. Please enable it in settings',
      unavailable: 'Background location is not available on this device',
    },
  };

  return messages[permission]?.[status] || 'Permission status unknown';
}

// Check if all permissions are granted
export function areAllPermissionsGranted(statuses: Record<PermissionType, PermissionStatus>): boolean {
  return Object.values(statuses).every(status => status === 'granted');
}

// Check if any permission is denied
export function hasDeniedPermissions(statuses: Record<PermissionType, PermissionStatus>): boolean {
  return Object.values(statuses).some(status => status === 'denied');
}

// Check if any permission is blocked
export function hasBlockedPermissions(statuses: Record<PermissionType, PermissionStatus>): boolean {
  return Object.values(statuses).some(status => status === 'blocked');
}

// Get permissions that need to be requested
export function getPermissionsToRequest(
  currentStatuses: Record<PermissionType, PermissionStatus>
): PermissionType[] {
  return Object.entries(currentStatuses)
    .filter(([_, status]) => status === 'denied')
    .map(([permission, _]) => permission as PermissionType);
}

// Get permissions that are blocked (user needs to go to settings)
export function getBlockedPermissions(
  currentStatuses: Record<PermissionType, PermissionStatus>
): PermissionType[] {
  return Object.entries(currentStatuses)
    .filter(([_, status]) => status === 'blocked')
    .map(([permission, _]) => permission as PermissionType);
}

// Open app settings (for blocked permissions)
export function openAppSettings(): Promise<void> {
  return new Promise((resolve, reject) => {
    // This would typically use a library like react-native-app-settings
    // For now, we'll just log and resolve
    console.log('Opening app settings...');
    Alert.alert(
      'Permission Required',
      'Please go to Settings > Apps > Corpease > Permissions to enable the required permissions.',
      [{ text: 'OK', onPress: () => resolve() }]
    );
  });
}
