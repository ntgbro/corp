import React from 'react';
import { Text } from 'react-native';

/**
 * Walk a React node and report primitive children (string/number).
 * Returns true if any primitive found.
 */
export function logPrimitiveChildren(node: React.ReactNode, tag = '<unknown>'): boolean {
  let found = false;

  const check = (n: React.ReactNode, path: string) => {
    if (n === null || n === undefined || typeof n === 'boolean') return;

    if (typeof n === 'string' || typeof n === 'number') {
      found = true;
      // Print helpful info and stack trace
      // eslint-disable-next-line no-console
      console.warn(`Primitive child detected at ${tag} ${path}:`, n);
      // Print call stack to find the render site
      // eslint-disable-next-line no-console
      console.warn(new Error().stack);
      return;
    }

    if (Array.isArray(n)) {
      n.forEach((child, i) => check(child, `${path}[${i}]`));
      return;
    }

    // If it's a React element, inspect its props.children
    // @ts-ignore
    if (React.isValidElement(n)) {
      // try to get displayName/type for clarity
      const type = (n.type && ((n.type as any).displayName || (n.type as any).name)) || (n as any).type || 'Element';
      check((n as any).props?.children, `${path} > ${String(type)}`);
      return;
    }
  };

  check(node, '');
  return found;
}