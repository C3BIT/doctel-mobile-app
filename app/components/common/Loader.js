import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { BlurView } from "@react-native-community/blur";

const Loader = () => {

  return (
    <View style={styles.container}>
      <BlurView style={styles.blur} blurType="light" blurAmount={10} />
      <ActivityIndicator size="large" color="#ffffff" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    zIndex: 1000,
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default Loader;
