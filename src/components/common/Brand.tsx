import React from 'react';
import { View, Image, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../config';

export interface BrandProps {
  variant?: 'logo' | 'text' | 'full';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

export const Brand: React.FC<BrandProps> = ({
  variant = 'full',
  size = 'medium',
  style,
}) => {
  const theme = useTheme();

  const getSize = () => {
    const sizes = {
      small: { logoSize: 24, fontSize: 16 },
      medium: { logoSize: 32, fontSize: 20 },
      large: { logoSize: 48, fontSize: 28 },
    };
    return sizes[size];
  };

  const renderContent = () => {
    switch (variant) {
      case 'logo':
        return (
          <View style={[styles.logo, { width: getSize().logoSize, height: getSize().logoSize, backgroundColor: theme.colors.primary }]}>
            <Text style={[styles.logoText, { fontSize: getSize().logoSize * 0.6, color: theme.colors.white }]}>
              C
            </Text>
          </View>
        );
      case 'text':
        return (
          <Text style={[styles.text, { fontSize: getSize().fontSize, color: theme.colors.primary }]}>
            Corpease
          </Text>
        );
      case 'full':
        return (
          <View style={styles.full}>
            <View style={[styles.logo, { width: getSize().logoSize, height: getSize().logoSize, backgroundColor: theme.colors.primary, marginRight: 12 }]}>
              <Text style={[styles.logoText, { fontSize: getSize().logoSize * 0.6, color: theme.colors.white }]}>
                C
              </Text>
            </View>
            <Text style={[styles.text, { fontSize: getSize().fontSize, color: theme.colors.primary }]}>
              Corpease
            </Text>
          </View>
        );
    }
  };

  return (
    <View style={[styles.container, style]}>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  text: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  full: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Brand;
