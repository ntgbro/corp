import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../config/theme';

export interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  style?: ViewStyle;
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = 'top',
  style,
}) => {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);

  const renderTrigger = () => {
    // If children is a primitive, wrap in Text to avoid "Text strings must be rendered within a <Text> component"
    if (typeof children === 'string' || typeof children === 'number') {
      return <Text>{children}</Text>;
    }
    return children;
  };

  const getTooltipStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      position: 'absolute',
      backgroundColor: theme.colors.text,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      zIndex: 1000,
    };

    const positions: Record<string, ViewStyle> = {
      top: {
        ...baseStyle,
        bottom: '100%',
        left: '50%',
        marginLeft: -50,
        marginBottom: 8,
      },
      bottom: {
        ...baseStyle,
        top: '100%',
        left: '50%',
        marginLeft: -50,
        marginTop: 8,
      },
      left: {
        ...baseStyle,
        right: '100%',
        top: '50%',
        marginTop: -12,
        marginRight: 8,
      },
      right: {
        ...baseStyle,
        left: '100%',
        top: '50%',
        marginTop: -12,
        marginLeft: 8,
      },
    };

    return positions[position];
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        onPress={() => setVisible(!visible)}
        style={styles.trigger}
      >
        {renderTrigger()}
      </TouchableOpacity>

      {visible && (
        <View style={getTooltipStyle()}>
          <Text style={[styles.tooltipText, { color: theme.colors.white }]}>
            {content}
          </Text>
          <View style={[styles.arrow, getArrowStyle(position)]} />
        </View>
      )}
    </View>
  );
};

const getArrowStyle = (position: 'top' | 'bottom' | 'left' | 'right') => {
  const baseArrow = {
    position: 'absolute' as const,
    width: 0,
    height: 0,
    borderStyle: 'solid' as const,
  };

  const arrows = {
    top: {
      ...baseArrow,
      borderLeftWidth: 6,
      borderRightWidth: 6,
      borderBottomWidth: 8,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderBottomColor: '#333',
      bottom: -8,
      left: '50%',
      marginLeft: -6,
    },
    bottom: {
      ...baseArrow,
      borderLeftWidth: 6,
      borderRightWidth: 6,
      borderTopWidth: 8,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderTopColor: '#333',
      top: -8,
      left: '50%',
      marginLeft: -6,
    },
    left: {
      ...baseArrow,
      borderTopWidth: 6,
      borderBottomWidth: 6,
      borderRightWidth: 8,
      borderTopColor: 'transparent',
      borderBottomColor: 'transparent',
      borderRightColor: '#333',
      right: -8,
      top: '50%',
      marginTop: -6,
    },
    right: {
      ...baseArrow,
      borderTopWidth: 6,
      borderBottomWidth: 6,
      borderLeftWidth: 8,
      borderTopColor: 'transparent',
      borderBottomColor: 'transparent',
      borderLeftColor: '#333',
      left: -8,
      top: '50%',
      marginTop: -6,
    },
  };

  return arrows[position];
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  trigger: {
    // Trigger takes full space
  },
  tooltipText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  arrow: {
    // Arrow styles handled by getArrowStyle function
  },
});

export default Tooltip;
