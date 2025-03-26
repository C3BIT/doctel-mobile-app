import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import WellnessCard from './../common/WellnessCard';

const { width, height } = Dimensions.get("window");

const calculateResponsiveDimension = {
  width: (percentage) => (width * percentage) / 100,
  height: (percentage) => (height * percentage) / 100,
  fontSize: (size) => (width * size) / 375,
};

const WellnessSection = () => {
  return (
    <View style={styles.wellnessSectionContainer}>
      <View style={styles.wellnessSectionContent}>
        <View style={styles.wellnessTextContainer}>
          <Text style={styles.wellnessPromptText}>
            How are you feeling today?
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
  );
};

const styles = StyleSheet.create({
  wellnessSectionContainer: {
    backgroundColor: "#20ACE2",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingBottom: calculateResponsiveDimension.height(2),
    overflow: "hidden",
  },
  wellnessSectionContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    top: calculateResponsiveDimension.height(1),
    height: calculateResponsiveDimension.height(8),
    paddingHorizontal: calculateResponsiveDimension.width(5),
  },
  wellnessTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  wellnessPromptText: {
    color: "#FFFFFF",
    fontSize: calculateResponsiveDimension.fontSize(18),
    textAlign: "left",
  },
  decorativeImage: {
    width: calculateResponsiveDimension.width(30),
    height: calculateResponsiveDimension.height(25),
    opacity: 0.7,
  },
  wellnessCardWrapper: {
    paddingHorizontal: calculateResponsiveDimension.width(5),
  },
});

export default WellnessSection;
