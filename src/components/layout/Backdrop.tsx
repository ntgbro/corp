import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableWithoutFeedback, Animated } from 'react-native';
import { useTheme } from '../../config/theme';

interface BackdropProps {
  visible: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  opacity?: number;
  color?: string;
  blur?: boolean;
  children?: React.ReactNode;
  animationDuration?: number;
}

export const Backdrop: React.FC<BackdropProps> = ({
  visible,
  onPress,
  style,
  opacity = 0.5,
  color,
  blur = false,
  children,
  animationDuration = 250,
}) => {
  const theme = useTheme();
  const animatedOpacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(animatedOpacity, {
      toValue: visible ? opacity : 0,
      duration: animationDuration,
      useNativeDriver: true,
    }).start();
  }, [visible, opacity, animatedOpacity, animationDuration]);

  if (!visible) {
    return null;
  }

  const backdropStyle = [
    styles.container,
    {
      backgroundColor: color || theme.colors.black,
      opacity: animatedOpacity,
    },
    style,
  ];

  const Container = onPress ? TouchableWithoutFeedback : View as any;

  return (
    <Container onPress={onPress} style={styles.touchableContainer}>
      <Animated.View style={backdropStyle}>
        {children}
      </Animated.View>
    </Container>
  );
};

const styles = StyleSheet.create({
  touchableContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Backdrop;
