import React from 'react';
import { View, StyleSheet } from 'react-native';

export const Card = ({ children, style }) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 0,
    overflow: 'hidden',
  },
});