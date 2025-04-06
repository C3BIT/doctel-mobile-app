import React, { useState, useRef } from 'react';
import { View, Text, Pressable, Animated, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const switchWidth = width * 0.2;
const switchHeight = height * 0.04;
const thumbSize = switchHeight * 0.7;
const textSize = switchWidth * 0.14;
const paddingSize = switchWidth * 0.03;
const positionOffset = switchWidth * 0.08;

const CustomLanguageSwitch = () => {
  const [isEnglish, setIsEnglish] = useState(true);
  const switchAnim = useRef(new Animated.Value(0)).current;

  const toggleSwitch = () => {
    Animated.timing(switchAnim, {
      toValue: isEnglish ? 1 : 0,
      duration: 600,
      useNativeDriver: false,
    }).start();
    setIsEnglish(!isEnglish);
  };

  const interpolatedPosition = switchAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [positionOffset, switchWidth - thumbSize - positionOffset],
  });

  return (
    <Pressable onPress={toggleSwitch} style={styles.container}>
      <View style={[styles.switchBackground, { width: switchWidth, height: switchHeight }]}>
        <Text style={[styles.label, styles.labelEN, { fontSize: textSize, color: isEnglish ? '#20ACE2' : '#999' }]}>EN</Text>
        <Text style={[styles.label, styles.labelBN, { fontSize: textSize, color: isEnglish ? '#999' : '#20ACE2' }]}>BN</Text>
        <Animated.View 
          style={[
            styles.switchThumb, 
            { 
              width: thumbSize, 
              height: thumbSize, 
              transform: [{ translateX: interpolatedPosition }] 
            }
          ]}
        >
          <Text style={[styles.switchText, { fontSize: textSize }]}>{isEnglish ? 'EN' : 'BN'}</Text>
        </Animated.View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchBackground: {
    borderRadius: 50,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    paddingHorizontal: paddingSize,
    borderWidth: 2,
    borderColor: '#20ACE2',
  },
  switchThumb: {
    position: 'absolute',
    backgroundColor: '#20ACE2',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchText: {
    color: 'white',
    fontWeight: 'bold',
  },
  label: {
    position: 'absolute',
    fontWeight: 'bold',
  },
  labelEN: {
    left: '18%',
  },
  labelBN: {
    right: '18%',
  },
});

export default CustomLanguageSwitch;