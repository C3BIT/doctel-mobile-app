import React from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
} from "react-native";
import CustomLanguageSwitch from './../common/CustomLanguageSwitch';
const { width, height } = Dimensions.get("window");

const calculateResponsiveDimension = {
  width: (percentage) => (width * percentage) / 100,
  height: (percentage) => (height * percentage) / 100,
};

const AppHeader = () => {
  return (
    <View style={styles.container}>
      <View style={styles.topNavigation}>
        <Image
          source={require("../../assets/headerLogo.png")}
          style={styles.brandLogo}
          resizeMode="contain"
        />
        <CustomLanguageSwitch />
      </View>
      <View style={styles.divider} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#20ACE2",
    overflow: "hidden",
  },
  topNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: calculateResponsiveDimension.width(5),
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    height: calculateResponsiveDimension.height(8),
  },
  brandLogo: {
    width: calculateResponsiveDimension.width(60),
    height: calculateResponsiveDimension.height(6),
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#0A4E52",
    opacity: 0.3,
    marginTop: calculateResponsiveDimension.height(2),
  },
});

export default AppHeader;