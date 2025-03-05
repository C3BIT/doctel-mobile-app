import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const dynamicWidth = (percentage) => (width * percentage) / 100;
const dynamicFontSize = (size) => (width * size) / 375;

const WellnessCard = () => {
  return (
    <View style={styles.wellnessCard}>
      <View style={styles.wellnessBox}>
        <Text style={styles.wellnessLabel}>Wellness Score</Text>
        <Text style={styles.wellnessScore}>100</Text>
        <Image source={require('../../assets/wellness.png')} style={styles.wellnessImage} />
      </View>

      <View style={styles.wellnessDetails}>
        <View style={styles.testHeader}>
          <Text style={styles.testTitle}>WELLNESS TEST</Text>
          <Text style={styles.testScore}>8/10</Text>
        </View>
        <Text style={styles.testDescription}>Let's do all the tests and update score</Text>
        <TouchableOpacity>
          <Text style={styles.moreDetails}>More Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wellnessCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: dynamicWidth(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  wellnessBox: {
    width: '35%',
    backgroundColor: '#00B0ED',
    borderRadius: 12,
    padding: dynamicWidth(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  wellnessLabel: {
    color: '#fff',
    fontSize: dynamicFontSize(12),
  },
  wellnessScore: {
    fontSize: dynamicFontSize(26),
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 5,
  },
  wellnessImage: {
    width: dynamicWidth(18),
    height: dynamicWidth(18),
  },
  wellnessDetails: {
    flex: 1,
    paddingLeft: dynamicWidth(4),
    justifyContent: 'center',
  },
  testHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  testTitle: {
    color: '#00B0ED',
    fontWeight: 'bold',
    fontSize: dynamicFontSize(14),
  },
  testScore: {
    color: '#00B0ED',
    fontWeight: 'bold',
    fontSize: dynamicFontSize(14),
  },
  testDescription: {
    color: '#666',
    fontSize: dynamicFontSize(12),
    marginBottom: 5,
  },
  moreDetails: {
    color: '#00B0ED',
    fontSize: dynamicFontSize(12),
    textDecorationLine: 'underline',
  },
});

export default WellnessCard;
