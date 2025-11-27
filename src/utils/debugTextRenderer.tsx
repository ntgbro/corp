import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

/**
 * Debug utility to help identify "Text strings must be rendered within a <Text> component" errors
 * This updated version always renders children so UI doesn't disappear, and shows
 * a visible overlay + console warnings when primitive children are detected.
 */

interface DebugTextRendererProps {
  children: React.ReactNode;
  debug?: boolean;
  label?: string;
}

type PrimitiveInfo = {
  path: string;
  value: string | number;
};

const findPrimitiveChildren = (node: React.ReactNode, path = '<root>', results: PrimitiveInfo[] = []) => {
  if (node === null || node === undefined || typeof node === 'boolean') return results;

  if (typeof node === 'string' || typeof node === 'number') {
    results.push({ path, value: node });
    return results;
  }

  if (Array.isArray(node)) {
    node.forEach((child, i) => findPrimitiveChildren(child, `${path}[${i}]`, results));
    return results;
  }

  if (React.isValidElement(node)) {
    // @ts-ignore - inspect children prop of valid React element
    const display = (node.type && ((node.type as any).displayName || (node.type as any).name)) || (node as any).type || 'Element';
    findPrimitiveChildren((node as any).props?.children, `${path} > ${String(display)}`, results);
    return results;
  }

  // non-element object (rare): nothing to do
  return results;
};

export const DebugTextRenderer: React.FC<DebugTextRendererProps> = ({
  children,
  debug = false,
  label = 'DebugTextRenderer',
}) => {
  const [primitives, setPrimitives] = useState<PrimitiveInfo[] | null>(null);

  useEffect(() => {
    if (!debug) {
      setPrimitives(null);
      return;
    }

    try {
      const found = findPrimitiveChildren(children, label);
      if (found.length > 0) {
        // log a helpful warning with stack to find the render site
        // eslint-disable-next-line no-console
        console.warn(`[${label}] Found unwrapped primitive children:`, found);
        // eslint-disable-next-line no-console
        console.warn(new Error(`[${label}] primitive children stack`).stack);
        setPrimitives(found);
      } else {
        setPrimitives(null);
      }
    } catch (err) {
      // If the detector itself errors, don't block rendering
      // eslint-disable-next-line no-console
      console.warn(`[${label}] debug validator error:`, err);
      setPrimitives(null);
    }
    // Only run when children or debug flag changes
  }, [children, debug, label]);

  // Render overlay/error box when primitives found, but always render children
  return (
    <>
      {/*
        If debug is enabled show a subtle debug border around children.
        We always render children so the app doesn't blank.
      */}
      <View style={debug ? styles.debugWrapper : undefined}>
        {children}
      </View>

      {debug && primitives && primitives.length > 0 && (
        <View pointerEvents="box-none" style={styles.overlayContainer}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>[{label}] Unwrapped text detected</Text>
            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
              {primitives.map((p, i) => (
                <View key={i} style={styles.primitiveRow}>
                  <Text style={styles.primitivePath}>{p.path}</Text>
                  <Text style={styles.primitiveValue}>{String(p.value)}</Text>
                </View>
              ))}
            </ScrollView>
            <Text style={styles.errorHint}>
              Wrap these values in {'<Text>'} components or use safeWrapChildren/safeRenderContent utilities.
            </Text>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  debugWrapper: {
    borderWidth: 1,
    borderColor: '#2196f3',
    borderRadius: 4,
    margin: 2,
  },
  overlayContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    // allow it to float above app content
    zIndex: 9999,
  },
  errorContainer: {
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderColor: '#f44336',
    borderWidth: 1,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  errorTitle: {
    fontSize: 14,
    color: '#b71c1c',
    fontWeight: '700',
    marginBottom: 8,
  },
  scroll: {
    maxHeight: 160,
    marginBottom: 6,
  },
  scrollContent: {
    paddingBottom: 6,
  },
  primitiveRow: {
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 6,
  },
  primitivePath: {
    fontSize: 11,
    color: '#333',
    fontWeight: '600',
  },
  primitiveValue: {
    fontSize: 12,
    color: '#000',
  },
  errorHint: {
    fontSize: 12,
    color: '#b71c1c',
    marginTop: 6,
  },
});

export default DebugTextRenderer;