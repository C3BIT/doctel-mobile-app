import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { getLanguage, setLanguage } from '../../storage/storage';

const LanguageSwitch = () => {
  const { i18n } = useTranslation();
  const slideAnim = useRef(new Animated.Value(0)).current;
  const { width: screenWidth } = Dimensions.get('window');
  const switchWidth = Math.min(Math.max(80, screenWidth * 0.20), 100);
  const switchHeight = switchWidth * 0.4; 
  const thumbSize = switchHeight * 0.7;
  const fontSize = switchHeight * 0.35;
  const padding = switchHeight * 0.15;
  const borderWidth = Math.max(1, switchHeight * 0.04);
  const thumbOffset = borderWidth + padding;
  
  useEffect(() => {
    const savedLanguage = getLanguage();
    i18n.changeLanguage(savedLanguage);
    const initialPosition = savedLanguage === 'en' 
      ? thumbOffset 
      : switchWidth - thumbSize - thumbOffset;
    slideAnim.setValue(initialPosition);
  }, []);
  
  useEffect(() => {
    const position = i18n.language === 'en' 
      ? thumbOffset 
      : switchWidth - thumbSize - thumbOffset;
      
    Animated.timing(slideAnim, {
      toValue: position,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [i18n.language, switchWidth, thumbSize, thumbOffset]);

  const toggleLanguage = () => {
      const newLanguage = i18n.language === 'en' ? 'bn' : 'en';
      i18n.changeLanguage(newLanguage);
      setLanguage(newLanguage);
  };

  return (
    <View style={[styles.container, { padding: switchHeight * 0.1 }]}>
      <Pressable
        onPress={toggleLanguage}
        style={[
          styles.track,
          {
            width: switchWidth,
            height: switchHeight,
            borderRadius: switchHeight / 2,
            borderWidth: borderWidth,
            shadowRadius: switchHeight * 0.1,
            shadowOffset: { width: 0, height: switchHeight * 0.05 },
          },
        ]}
      >
        {i18n.language === 'bn' && (
          <Text
            style={[
              styles.label,
              {
                fontSize: fontSize,
                left: switchWidth * 0.15,
              },
            ]}
          >
            EN
          </Text>
        )}

        {i18n.language === 'en' && (
          <Text
            style={[
              styles.label,
              {
                fontSize: fontSize,
                right: switchWidth * 0.15,
              },
            ]}
          >
            BN
          </Text>
        )}

        <Animated.View
          style={[
            styles.thumb,
            {
              width: thumbSize,
              height: thumbSize,
              borderRadius: thumbSize / 2,
              transform: [{ translateX: slideAnim }],
              shadowRadius: switchHeight * 0.1,
              shadowOffset: { width: 0, height: switchHeight * 0.1 },
            },
          ]}
        >
          <Text
            style={[
              styles.thumbText,
              {
                fontSize: fontSize,
              },
            ]}
          >
            {i18n.language === 'en' ? 'EN' : 'BN'}
          </Text>
        </Animated.View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  track: {
    backgroundColor: '#fff',
    position: 'relative',
    justifyContent: 'center',
    elevation: 2,
    borderColor: '#20ACE2',
    shadowColor: '#000',
    shadowOpacity: 0.2,
  },
  label: {
    position: 'absolute',
    fontWeight: 'bold',
    zIndex: 1,
    color: '#20ACE2',
  },
  thumb: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    backgroundColor: '#20ACE2',
    shadowColor: '#000',
    shadowOpacity: 0.3,
  },
  thumbText: {
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default LanguageSwitch;