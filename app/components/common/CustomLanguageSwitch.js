import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { getLanguagePreference, saveLanguagePreference } from '../../storage/storage';

const LanguageSwitch = () => {
  const [isEnglish, setIsEnglish] = useState(true);
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
    const loadPref = async () => {
      const saved = await getLanguagePreference();
      setIsEnglish(saved);
      slideAnim.setValue(saved ? thumbOffset : switchWidth - thumbSize - thumbOffset);
    };
    loadPref();
  }, [slideAnim, switchWidth, thumbSize, thumbOffset]);

  const toggleLanguage = () => {
    const newLang = !isEnglish;
    setIsEnglish(newLang);
    saveLanguagePreference(newLang);

    Animated.timing(slideAnim, {
      toValue: newLang ? thumbOffset : switchWidth - thumbSize - thumbOffset,
      duration: 200,
      useNativeDriver: true,
    }).start();
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
        {!isEnglish && (
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

        {isEnglish && (
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
            {isEnglish ? 'EN' : 'BN'}
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