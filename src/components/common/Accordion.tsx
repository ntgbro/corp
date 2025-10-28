import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../config';

export interface AccordionProps {
  title: string;
  children: React.ReactNode;
  expanded?: boolean;
  onToggle?: (expanded: boolean) => void;
  style?: ViewStyle;
  titleStyle?: ViewStyle;
}

export const Accordion: React.FC<AccordionProps> = ({
  title,
  children,
  expanded: controlledExpanded,
  onToggle,
  style,
  titleStyle,
}) => {
  const theme = useTheme();
  const [internalExpanded, setInternalExpanded] = useState(false);

  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  const handleToggle = () => {
    const newExpanded = !isExpanded;
    if (controlledExpanded === undefined) {
      setInternalExpanded(newExpanded);
    }
    onToggle?.(newExpanded);
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        onPress={handleToggle}
        style={[styles.header, { borderBottomColor: theme.colors.border }]}
      >
        <Text style={[styles.title, { color: theme.colors.text }, titleStyle]}>
          {title}
        </Text>
        <Text style={[styles.icon, { color: theme.colors.textSecondary }]}>
          {isExpanded ? '−' : '+'}
        </Text>
      </TouchableOpacity>

      {isExpanded && (
        <View style={[styles.content, { borderBottomColor: theme.colors.border }]}>
          {children}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  icon: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  content: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

export default Accordion;
