import React, { useState, useRef } from 'react';
import { View, Text, Pressable, Animated, StyleSheet } from 'react-native';

const CustomLanguageSwitch = () => {
  const [isEnglish, setIsEnglish] = useState(true);
  const switchAnim = useRef(new Animated.Value(0)).current;

  const toggleSwitch = () => {
    Animated.timing(switchAnim, {
      toValue: isEnglish ? 1 : 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
    setIsEnglish(!isEnglish);
  };

  const interpolatedPosition = switchAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [5, 45],
  });

  return (
    <Pressable onPress={toggleSwitch} style={styles.container}>
      <View style={styles.switchBackground}>
        <Text style={[styles.label, styles.labelEN, { color: isEnglish ? '#20ACE2' : '#999' }]}>EN</Text>
        <Text style={[styles.label, styles.labelBN, { color: isEnglish ? '#999' : '#20ACE2' }]}>BN</Text>
        <Animated.View 
          style={[styles.switchThumb, { transform: [{ translateX: interpolatedPosition }] }]}
        >
          <Text style={styles.switchText}>{isEnglish ? 'EN' : 'BN'}</Text>
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
    width: 90,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: '#20ACE2',
  },
  switchThumb: {
    position: 'absolute',
    width: 30,
    height: 30,
    backgroundColor: '#20ACE2',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  label: {
    position: 'absolute',
    fontWeight: 'bold',
    fontSize: 14,
  },
  labelEN: {
    left: 15,
  },
  labelBN: {
    right: 15,
  },
});

export default CustomLanguageSwitch;