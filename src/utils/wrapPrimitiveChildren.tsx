import React from 'react';
import { Text } from 'react-native';

/**
 * Wrap string/number children in a <Text> node so they don't become direct children of native Views.
 * Keeps React elements unchanged and recurses into arrays.
 */
export function wrapPrimitiveChildren(children: React.ReactNode): React.ReactNode {
  if (children === null || children === undefined) return children;

  if (typeof children === 'string' || typeof children === 'number') {
    return <Text>{children}</Text>;
  }

  if (Array.isArray(children)) {
    return children.map((c, i) => <React.Fragment key={i}>{wrapPrimitiveChildren(c)}</React.Fragment>);
  }

  // If it's already a React element (or function), return as-is
  return children;
}

/**
 * Enhanced version that handles nested structures more safely
 */
export function safeWrapChildren(children: React.ReactNode): React.ReactNode {
  if (children === null || children === undefined) return children;

  if (typeof children === 'string' || typeof children === 'number') {
    return <Text>{children}</Text>;
  }

  if (Array.isArray(children)) {
    return <>{children.map((child, index) => (
      <React.Fragment key={index}>
        {safeWrapChildren(child)}
      </React.Fragment>
    ))}</>;
  }

  // Handle special cases for objects that might contain text
  if (typeof children === 'object' && children !== null) {
    // If it's already a valid React element, return as-is
    if (React.isValidElement(children)) {
      return children;
    }
  }

  return children;
}