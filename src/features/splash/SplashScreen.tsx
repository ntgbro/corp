import React, { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import CenterText from '../../assets/logo-parts/CenterText.svg';
import Logo1 from '../../assets/logo-parts/CorpeasLogo_1.svg';
import Logo2 from '../../assets/logo-parts/CorpeasLogo_2.svg';
import Logo3 from '../../assets/logo-parts/CorpeasLogo_3.svg';
import Logo4 from '../../assets/logo-parts/CorpeasLogo_4.svg';
import Logo5 from '../../assets/logo-parts/CorpeasLogo_5.svg';
import Logo6 from '../../assets/logo-parts/CorpeasLogo_6.svg';

const { width, height } = Dimensions.get('window');
const centerX = width / 2 - 60;
const centerY = height / 2 - 60;

// Manual positioning function - customize these coordinates as needed
const getPosition = (idx: number) => {
  // Define specific positions for each logo to form your desired shape
  const positions = [
    { top: centerY - 250, left: centerX -25 },      // Logo 1 - Top
    { top: centerY - 192, left: centerX + 96 }, // Logo 2 - Top-right
    { top: centerY -33, left: centerX + 97}, // Logo 3 - Right
    { top: centerY + 2, left: centerX -25 },      // Logo 4 - Bottom
    { top: centerY -34, left: centerX - 126}, // Logo 5 - Left
    { top: centerY - 193, left: centerX - 126 }  // Logo 6 - Top-left
  ];
  
  return {
    position: 'absolute' as const,
    ...positions[idx]
  };
};

const SplashScreen: React.FC = () => {
  const centerOpacity = useRef(new Animated.Value(0)).current;
  const logo1Opacity = useRef(new Animated.Value(0)).current;
  const logo2Opacity = useRef(new Animated.Value(0)).current;
  const logo3Opacity = useRef(new Animated.Value(0)).current;
  const logo4Opacity = useRef(new Animated.Value(0)).current;
  const logo5Opacity = useRef(new Animated.Value(0)).current;
  const logo6Opacity = useRef(new Animated.Value(0)).current;
  
  const logosOpacity = [logo1Opacity, logo2Opacity, logo3Opacity, logo4Opacity, logo5Opacity, logo6Opacity];

  useEffect(() => {
    Animated.timing(centerOpacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true
    }).start(() => {
      // Fade in surrounding logos in sequence
      Animated.stagger(
        300,
        logosOpacity.map(opacity =>
          Animated.timing(opacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true
          })
        )
      ).start();
    });
  }, []);

  // Removed automatic navigation to allow for manual changes
  // The SplashScreen will now stay visible until manually navigated away

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.centerLogo, { opacity: centerOpacity }]}>
        <CenterText width={148} height={148} />
      </Animated.View>
      {[Logo1, Logo2, Logo3, Logo4, Logo5, Logo6].map((LogoComponent, idx) => (
        <Animated.View key={idx} style={[getPosition(idx), { opacity: logosOpacity[idx] }]}>
          {/* Increase size for Logo1 (idx=0) and Logo4 (idx=3) */}
          {idx === 0 ? (
            <LogoComponent width={172} height={172} /> // Logo1 - increased size
          ) : idx === 3 ? (
            <LogoComponent width={172} height={172} /> // Logo4 - increased size
          ) : (
            <LogoComponent width={150} height={150} /> // Other logos - original size
          )}
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  centerLogo: {
    position: 'absolute',
    top: 278,
    left: 138
  }
});

export default SplashScreen;