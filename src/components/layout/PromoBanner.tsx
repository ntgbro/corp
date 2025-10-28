import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ViewStyle, ImageSourcePropType } from 'react-native';
import { useTheme } from '../../config/theme';

interface PromoBannerProps {
  title: string;
  subtitle?: string;
  description?: string;
  image?: ImageSourcePropType | string;
  backgroundColor?: string;
  textColor?: string;
  buttonText?: string;
  onPress?: () => void;
  onClose?: () => void;
  style?: ViewStyle;
  variant?: 'default' | 'card' | 'full-width';
  size?: 'small' | 'medium' | 'large';
  showCloseButton?: boolean;
  autoHide?: boolean;
  autoHideDelay?: number;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({
  title,
  subtitle,
  description,
  image,
  backgroundColor,
  textColor,
  buttonText,
  onPress,
  onClose,
  style,
  variant = 'default',
  size = 'medium',
  showCloseButton = false,
  autoHide = false,
  autoHideDelay = 5000,
}) => {
  const theme = useTheme();

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          padding: 12,
          titleSize: 14,
          subtitleSize: 12,
          descriptionSize: 11,
          height: 80,
        };
      case 'large':
        return {
          padding: 24,
          titleSize: 22,
          subtitleSize: 16,
          descriptionSize: 14,
          height: 200,
        };
      default: // medium
        return {
          padding: 16,
          titleSize: 18,
          subtitleSize: 14,
          descriptionSize: 13,
          height: 120,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const getVariantStyles = () => {
    const baseStyle: ViewStyle = {
      backgroundColor: backgroundColor || theme.colors.primary,
      borderRadius: variant === 'card' ? 12 : 0,
      minHeight: sizeStyles.height,
    };

    switch (variant) {
      case 'card':
        return {
          ...baseStyle,
          margin: 8,
          padding: sizeStyles.padding,
        };
      case 'full-width':
        return {
          ...baseStyle,
          width: '100%',
          marginHorizontal: 0,
          paddingHorizontal: sizeStyles.padding,
          paddingVertical: sizeStyles.padding,
        };
      default:
        return {
          ...baseStyle,
          padding: sizeStyles.padding,
          marginHorizontal: 16,
          marginVertical: 8,
        };
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        getVariantStyles(),
        style,
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
    >
      {/* Background Image */}
      {image && (
        <Image
          source={typeof image === 'string' ? { uri: image } : image}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
      )}

      {/* Overlay for text readability */}
      <View style={[
        styles.overlay,
        { backgroundColor: image ? 'rgba(0,0,0,0.3)' : 'transparent' }
      ]} />

      {/* Content */}
      <View style={styles.content}>
        {/* Left side - Text content */}
        <View style={styles.textContainer}>
          {subtitle && (
            <Text
              style={[
                styles.subtitle,
                {
                  color: textColor || theme.colors.white,
                  fontSize: sizeStyles.subtitleSize,
                  opacity: 0.9,
                },
              ]}
            >
              {subtitle}
            </Text>
          )}

          <Text
            style={[
              styles.title,
              {
                color: textColor || theme.colors.white,
                fontSize: sizeStyles.titleSize,
                fontWeight: 'bold',
              },
            ]}
          >
            {title}
          </Text>

          {description && (
            <Text
              style={[
                styles.description,
                {
                  color: textColor || theme.colors.white,
                  fontSize: sizeStyles.descriptionSize,
                  opacity: 0.8,
                },
              ]}
              numberOfLines={2}
            >
              {description}
            </Text>
          )}

          {buttonText && onPress && (
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderColor: textColor || theme.colors.white,
                },
              ]}
              onPress={onPress}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.buttonText,
                  { color: textColor || theme.colors.white }
                ]}
              >
                {buttonText}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Right side - Close button */}
        {showCloseButton && onClose && (
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={[styles.closeText, { color: textColor || theme.colors.white }]}>
              ✕
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  textContainer: {
    flex: 1,
    paddingRight: 16,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    marginBottom: 4,
  },
  description: {
    marginTop: 4,
    lineHeight: 18,
    marginBottom: 8,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PromoBanner;
