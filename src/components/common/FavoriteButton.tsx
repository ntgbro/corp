import React, { useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Animated, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface FavoriteButtonProps {
  isFavorited?: boolean;
  onPress?: () => void;
  size?: number;
  style?: any;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  isFavorited = false,
  onPress,
  size = 20, // Decreased from 24 to 20
  style,
}) => {
  const scaleValue = new Animated.Value(1);
  const fillOpacity = new Animated.Value(isFavorited ? 1 : 0);

  // Update animation when prop changes
  useEffect(() => {
    fillOpacity.setValue(isFavorited ? 1 : 0);
  }, [isFavorited]);

  const handlePress = () => {
    // Trigger the animation
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate the fill - always animate to the opposite state
    Animated.timing(fillOpacity, {
      toValue: isFavorited ? 0 : 1, // Use prop directly, not local state
      duration: 200,
      useNativeDriver: true,
    }).start();

    // Call the onPress callback if provided
    if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.container, style]}
      activeOpacity={0.7}
    >
      <Animated.View
        style={{
          transform: [{ scale: scaleValue }],
        }}
      >
        <Svg
          width={size}
          height={size}
          viewBox="0 0 103.69 96.18"
        >
          {/* Outline heart (always visible) */}
          <Path
            d="M269.17,252.66a22.44,22.44,0,0,1-3.92,12.58l-.23.3-2.86,3.5-40.28,49.17a4.71,4.71,0,0,1-7,0L176.49,270h0l-5-6.3v0a22.15,22.15,0,0,1-3-11c0-14.42,14.21-26.12,31.75-26.12,5.9,0,11.44,3,16.18,5.75a4.89,4.89,0,0,0,4.83,0c4.74-2.8,10.28-5.75,16.18-5.75C255,226.54,269.17,238.24,269.17,252.66Z"
            transform="translate(-166.98 -225.04)"
            fill="none"
            stroke="#fff"
            strokeWidth="3"
          />
        </Svg>
        {/* Filled heart (animated opacity) - separate SVG to ensure proper rendering */}
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            opacity: fillOpacity,
            width: size,
            height: size,
            pointerEvents: 'none', // Ensure it doesn't interfere with touch events
          }}
        >
          <Svg
            width={size}
            height={size}
            viewBox="0 0 103.69 96.18"
          >
            <Path
              d="M269.17,252.66a22.44,22.44,0,0,1-3.92,12.58l-.23.3-2.86,3.5-40.28,49.17a4.71,4.71,0,0,1-7,0L176.49,270h0l-5-6.3v0a22.15,22.15,0,0,1-3-11c0-14.42,14.21-26.12,31.75-26.12,5.9,0,11.44,3,16.18,5.75a4.89,4.89,0,0,0,4.83,0c4.74-2.8,10.28-5.75,16.18-5.75C255,226.54,269.17,238.24,269.17,252.66Z"
              transform="translate(-166.98 -225.04)"
              fill="#ff0000" // Use a consistent red color
              stroke="#ff0000" // Use a consistent red color
              strokeWidth="3"
            />
          </Svg>
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
    padding: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
});

export default FavoriteButton;