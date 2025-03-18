import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Image } from 'react-native';
import LogoSvg from '../assets/logo/doctelLogo.svg';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const translateY = useRef(new Animated.Value(50)).current;

  useEffect(() => {

    const preloadTimeout = setTimeout(() => {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
        
        Animated.delay(1200),
        
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        onFinish();
      });
    }, 500); 
    
    return () => clearTimeout(preloadTimeout);
  }, [fadeAnim, scaleAnim, translateY, onFinish]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: translateY }
            ],
          },
        ]}
      >
        <View style={styles.logoWrapper}>
          {LogoSvg ? (
            <LogoSvg width={80} height={80} fill="#FFFFFF" />
          ) : (
            <View style={styles.logoFallback}>
              <Text style={styles.logoFallbackText}>D</Text>
            </View>
          )}
        </View>
        
        <Animated.Text 
          style={[
            styles.tagline,
            {
              opacity: fadeAnim,
              transform: [{ translateY: Animated.multiply(translateY, 1.2) }]
            }
          ]}
        >
          DOCTEL
        </Animated.Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#20ACE2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoFallback: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoFallbackText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#20ACE2',
  },
  tagline: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: 20,
  },
});

export default SplashScreen;