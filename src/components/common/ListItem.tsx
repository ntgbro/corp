import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../config';

export interface ListItemProps {
  title: string;
  subtitle?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

export const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  onPress,
  disabled = false,
  style,
}) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || !onPress}
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
    >
      <View style={styles.content}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        <View style={styles.textContainer}>
          <Text
            style={[
              styles.title,
              {
                color: disabled ? theme.colors.textSecondary : theme.colors.text,
              },
            ]}
          >
            {title}
          </Text>

          {subtitle && (
            <Text
              style={[
                styles.subtitle,
                { color: theme.colors.textSecondary },
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>

        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftIcon: {
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 20,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 18,
    marginTop: 2,
  },
  rightIcon: {
    marginLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ListItem;
