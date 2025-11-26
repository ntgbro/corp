import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * Debug utility to help identify "Text strings must be rendered within a <Text> component" errors
 * This component can be used to wrap suspicious areas of your app to catch and display errors
 */

interface DebugTextRendererProps {
  children: React.ReactNode;
  debug?: boolean;
  label?: string;
}

export const DebugTextRenderer: React.FC<DebugTextRendererProps> = ({ 
  children, 
  debug = false,
  label = 'DebugTextRenderer'
}) => {
  const [error, setError] = useState<string | null>(null);

  // Function to validate that all children are properly wrapped
  const validateChildren = (nodes: React.ReactNode): boolean => {
    try {
      if (nodes === null || nodes === undefined) return true;

      if (typeof nodes === 'string' || typeof nodes === 'number') {
        // This would cause the error - strings must be wrapped in Text
        if (debug) {
          console.warn(`[${label}] Found unwrapped text:`, nodes);
        }
        return false;
      }

      if (Array.isArray(nodes)) {
        return nodes.every(child => validateChildren(child));
      }

      // For React elements, check their children recursively
      if (React.isValidElement(nodes)) {
        const element = nodes as React.ReactElement<any>;
        if (element.props && element.props.children) {
          return validateChildren(element.props.children);
        }
      }

      return true;
    } catch (err) {
      console.error(`[${label}] Error validating children:`, err);
      return false;
    }
  };

  useEffect(() => {
    if (debug) {
      const isValid = validateChildren(children);
      if (!isValid) {
        setError('Invalid text rendering detected - check console for details');
      } else {
        setError(null);
      }
    }
  }, [children, debug, label]);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>DebugTextRenderer Error:</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.errorHint}>
          Wrap all text strings in {'<Text>'} components to fix this error
        </Text>
      </View>
    );
  }

  // In debug mode, wrap children with validation
  if (debug) {
    return (
      <View style={styles.debugContainer}>
        <Text style={styles.debugLabel}>[{label}]</Text>
        {children}
      </View>
    );
  }

  // Normal rendering
  return <>{children}</>;
};

const styles = StyleSheet.create({
  errorContainer: {
    padding: 16,
    backgroundColor: '#ffebee',
    borderColor: '#f44336',
    borderWidth: 1,
    borderRadius: 4,
    margin: 8,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f44336',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#f44336',
    marginBottom: 8,
  },
  errorHint: {
    fontSize: 12,
    color: '#f44336',
    fontStyle: 'italic',
  },
  debugContainer: {
    borderWidth: 1,
    borderColor: '#2196f3',
    borderRadius: 4,
    margin: 2,
    padding: 4,
  },
  debugLabel: {
    fontSize: 10,
    color: '#2196f3',
    fontWeight: 'bold',
  },
});

/**
 * HOC (Higher Order Component) version for debugging class components
 */
export const withDebugTextRenderer = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  label?: string
) => {
  return (props: P) => (
    <DebugTextRenderer debug label={label || WrappedComponent.name}>
      <WrappedComponent {...props} />
    </DebugTextRenderer>
  );
};

/**
 * Utility function to safely wrap content that might contain unwrapped text
 */
export const safeWrapContent = (content: React.ReactNode): React.ReactNode => {
  // If it's already a valid React element, return as-is
  if (React.isValidElement(content)) {
    return content;
  }

  // If it's a string or number, wrap it in Text
  if (typeof content === 'string' || typeof content === 'number') {
    return <Text>{content}</Text>;
  }

  // If it's an array, process each item
  if (Array.isArray(content)) {
    return content.map((item, index) => (
      <React.Fragment key={index}>
        {safeWrapContent(item)}
      </React.Fragment>
    ));
  }

  // For other types, return as-is
  return content;
};