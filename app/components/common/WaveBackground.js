import React from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';

const { width, height } = Dimensions.get('window');

const COLORS = {
  darkBlue: '#20ACE2',
};

export const WaveBackground = ({style, children }) => {
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.backgroundLayer, { backgroundColor: COLORS.darkBlue }]}>
        <Image
          source={require('../../assets/vector.png')}
          style={styles.waveImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.contentContainer}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  backgroundLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  waveImage: {
    width: width,
    height: height * 0.35,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  contentContainer: {
    flex: 1,
    position: 'relative',
    zIndex: 1,
  },
});

export default WaveBackground;