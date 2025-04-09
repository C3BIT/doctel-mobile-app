import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { useTranslation } from "react-i18next";
const { width, height } = Dimensions.get("window");
const dp = {
  w: (percentage) => (width * percentage) / 100,
  h: (percentage) => (height * percentage) / 100,
  fs: (size) => Math.min((width * size) / 375, (height * size) / 812),
};

const WellnessCard = () => {
  const { t } = useTranslation();
  
  return (
    <View style={styles.wellnessCard}>
      <View style={styles.wellnessBox}>
        <Text style={styles.wellnessLabel}>{t("wellnessScore")}</Text>
        <Text style={styles.wellnessScore}>100</Text>
        <Image 
          source={require('../../assets/wellness.png')} 
          style={styles.wellnessImage} 
          resizeMode="contain"
        />
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
    borderRadius: dp.w(5),
    padding: dp.w(3),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: dp.h(12),
  },
  wellnessBox: {
    width: dp.w(28),
    aspectRatio: 1,
    backgroundColor: '#00B0ED',
    borderRadius: dp.w(4),
    padding: dp.w(2),
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    position: 'relative',
  },
  wellnessLabel: {
    color: '#fff',
    fontSize: dp.fs(12),
    marginBottom: dp.h(0.5),
  },
  wellnessScore: {
    fontSize: dp.fs(30),
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: dp.h(0.2),
  },
  wellnessImage: {
    width: dp.w(15),
    height: dp.w(15),
    position: 'absolute',
    bottom: dp.h(1),
    right: dp.w(1),
  },
  wellnessDetails: {
    flex: 1,
    paddingHorizontal: dp.w(4),
    justifyContent: 'space-between',
    paddingVertical: dp.h(0.8),
  },
  testHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: dp.h(0.5),
  },
  testTitle: {
    color: '#20ACE2',
    fontWeight: 'bold',
    fontSize: dp.fs(16),
  },
  testScore: {
    color: '#20ACE2',
    fontWeight: 'bold',
    fontSize: dp.fs(16),
  },
  testDescription: {
    color: 'gray',
    fontSize: dp.fs(13),
    marginBottom: dp.h(1),
  },
  moreDetails: {
    color: '#20ACE2',
    fontSize: dp.fs(13),
    textDecorationLine: 'underline',
  },
});

export default WellnessCard;