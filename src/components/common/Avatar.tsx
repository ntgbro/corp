import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '../../config';

export interface AvatarProps {
  source?: string | { uri: string };
  name?: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  onPress?: () => void;
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  size = 'medium',
  onPress,
  style,
}) => {
  const theme = useTheme();

  const getSize = () => {
    const sizes = {
      small: 32,
      medium: 40,
      large: 56,
      xlarge: 80,
    };
    return sizes[size];
  };

  const getFontSize = () => {
    const fontSizes = {
      small: 14,
      medium: 16,
      large: 20,
      xlarge: 28,
    };
    return fontSizes[size];
  };

  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  const renderContent = () => {
    if (source) {
      return (
        <Image
          source={typeof source === 'string' ? { uri: source } : source}
          style={[styles.avatar, { width: getSize(), height: getSize() }]}
        />
      );
    }

    return (
      <View style={[styles.avatar, styles.fallback, { width: getSize(), height: getSize(), backgroundColor: theme.colors.border }]}>
        <Text style={[styles.initials, { fontSize: getFontSize(), color: theme.colors.textSecondary }]}>
          {getInitials(name)}
        </Text>
      </View>
    );
  };

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} style={[style]}>
        {renderContent()}
      </TouchableOpacity>
    );
  }

  return (
    <View style={style}>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallback: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Avatar;
