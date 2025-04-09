import React from "react";
import { View, Text, Image, StyleSheet, Dimensions, SafeAreaView } from "react-native";
import { useTranslation } from "react-i18next";
import WellnessCard from './../common/WellnessCard';

const { width, height } = Dimensions.get("window");

const dp = {
  w: (percentage) => (width * percentage) / 100,
  h: (percentage) => (height * percentage) / 100,
  fs: (size) => Math.min((width * size) / 375, (height * size) / 812),
};

const WellnessSection = () => {
  const { t } = useTranslation();
  
  return (
    <SafeAreaView>
      <View style={styles.wellnessSectionContainer}>
        <View style={styles.wellnessSectionContent}>
          <View style={styles.wellnessTextContainer}>
            <Text style={styles.wellnessPromptText}>
              {t("howAreYouFeeling")}
            </Text>
          </View>
          <Image
            source={require("../../assets/leaves.png")}
            style={styles.decorativeImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.wellnessCardWrapper}>
          <WellnessCard />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wellnessSectionContainer: {
    backgroundColor: "#20ACE2",
    borderBottomLeftRadius: dp.w(5),
    borderBottomRightRadius: dp.w(5),
    paddingBottom: dp.h(2),
    overflow: "hidden",
  },
  wellnessSectionContent: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: dp.h(2),
    paddingHorizontal: dp.w(5),
    marginBottom: dp.h(2),
    height: dp.h(8),
    position: "relative",
  },
  wellnessTextContainer: {
    flex: 0.7,
    justifyContent: "center",
    zIndex: 2,
  },
  wellnessPromptText: {
    color: "#FFFFFF",
    fontSize: dp.fs(18),
    fontWeight: "500",
  },
  decorativeImage: {
    width: dp.w(30),
    height: dp.h(12),
    position: "absolute",
    right: dp.w(0),
    top: dp.h(0),
    opacity: 0.9,
    zIndex: 1,
  },
  wellnessCardWrapper: {
    paddingHorizontal: dp.w(5),
    marginBottom: dp.h(1),
  },
});

export default WellnessSection;