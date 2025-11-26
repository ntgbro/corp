import React from 'react';
import { Text } from 'react-native';

/**
 * Safely render children by ensuring all strings/numbers are wrapped in Text components
 * This prevents the "Text strings must be rendered within a <Text> component" error
 */
export const SafeRender: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const wrapText = (node: React.ReactNode): React.ReactNode => {
    if (typeof node === 'string' || typeof node === 'number') {
      return <Text>{node}</Text>;
    }
    
    if (Array.isArray(node)) {
      return node.map((child, index) => (
        <React.Fragment key={index}>
          {wrapText(child)}
        </React.Fragment>
      ));
    }
    
    return node;
  };

  return <>{wrapText(children)}</>;
};

/**
 * Utility function to safely render dynamic content
 * @param content - The content to render
 * @returns React node with proper Text wrapping
 */
export const safeRenderContent = (content: React.ReactNode): React.ReactNode => {
  if (typeof content === 'string' || typeof content === 'number') {
    return <Text>{content}</Text>;
  }
  
  if (Array.isArray(content)) {
    return content.map((item, index) => (
      <React.Fragment key={index}>
        {safeRenderContent(item)}
      </React.Fragment>
    ));
  }
  
  return content;
};