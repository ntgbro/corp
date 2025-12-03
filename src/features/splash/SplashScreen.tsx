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
    { top: centerY - 121, left: centerX -18 },      // Logo 1 - Top
    { top: centerY - 72, left: centerX + 86 }, // Logo 2 - Top-right
    { top: centerY +61, left: centerX + 86}, // Logo 3 - Right
    { top: centerY + 89, left: centerX -18 },      // Logo 4 - Bottom
    { top: centerY +60, left: centerX - 102}, // Logo 5 - Left
    { top: centerY - 72, left: centerX - 102 }  // Logo 6 - Top-left
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
  const logoComponents = [Logo1, Logo2, Logo3, Logo4, Logo5, Logo6];

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
        <CenterText width={120} height={120} />
      </Animated.View>
      {logoComponents.map((LogoComponent, idx) => {
        const LogoElement = LogoComponent;
        return (
          <Animated.View key={`logo-${idx}`} style={[getPosition(idx), { opacity: logosOpacity[idx] }]}>
            {/* Increase size for Logo1 (idx=0) and Logo4 (idx=3) */}
            {idx === 0 ? (
              <LogoElement width={150} height={150} /> // Logo1 - increased size
            ) : idx === 3 ? (
              <LogoElement width={150} height={150} /> // Logo4 - increased size
            ) : (
              <LogoElement width={130} height={130} /> // Other logos - original size
            )}
          </Animated.View>
        );
      })}
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
    top: centerY, // Center vertically with the circular arrangement of logos
    left: centerX // Center horizontally with the circular arrangement of logos
  }
});

export default SplashScreen;