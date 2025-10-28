import React from 'react';
import { ScrollView, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../config';

export interface CarouselProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Carousel: React.FC<CarouselProps> = ({
  children,
  style,
}) => {
  const theme = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={style}
      style={styles.container}
    >
      {children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    // Container styles
  },
});

export default Carousel;
