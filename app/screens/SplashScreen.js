import React from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';

const CustomSplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/doctel.png')} style={styles.logo} resizeMode="contain"/>
      <Text style={styles.subtitle}>Experience the Future of Health</Text>
      <ActivityIndicator size="large" color="#20ACE2" style={styles.indicator} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#6ECCAF',
  },
  logo: {
    width: 250,
    height: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginTop: 10,
  },
  indicator: {
    marginTop: 20,
  },
});

export default CustomSplashScreen;