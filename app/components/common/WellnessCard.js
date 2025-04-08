import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const dynamicWidth = (percentage) => (width * percentage) / 100;
const dynamicHeight = (percentage) => (height * percentage) / 100;
const dynamicFontSize = (size) => (width * size) / 375;

const WellnessCard = () => {
    const { t } = useTranslation();
  return (
    <View style={styles.wellnessCard}>
      <View style={styles.wellnessBox}>
        <Text style={styles.wellnessLabel}>  {t("wellnessScore")}</Text>
        <Text style={styles.wellnessScore}>100</Text>
        <Image source={require('../../assets/wellness.png')} style={styles.wellnessImage} />
      </View>

      <View style={styles.wellnessDetails}>
        <View style={styles.testHeader}>
          <Text style={styles.testTitle}>{t("wellnessTest")}</Text>
          <Text style={styles.testScore}>8/10</Text>
        </View>
        <Text style={styles.testDescription}>{t("updateScore")}</Text>
        <TouchableOpacity>
          <Text style={styles.moreDetails}>{t("moreDetails")}</Text>
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
    height: dynamicHeight(15),
    backgroundColor: '#00B0ED',
    borderRadius: 12,
    padding: dynamicWidth(2),
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    position: 'relative',
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
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  wellnessDetails: {
    flex: 1,
    paddingLeft: dynamicWidth(4),
    justifyContent: 'space-evenly',
  },
  testHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  testTitle: {
    color: '#20ACE2',
    fontWeight: 'bold',
    fontSize: dynamicFontSize(14),
  },
  testScore: {
    color: '#20ACE2',
    fontWeight: 'bold',
    fontSize: dynamicFontSize(14),
  },
  testDescription: {
    color: 'Gray',
    fontSize: dynamicFontSize(12),
    marginBottom: 5,
  },
  moreDetails: {
    color: '#20ACE2',
    fontSize: dynamicFontSize(12),
    textDecorationLine: 'underline',
  },
});

export default WellnessCard;