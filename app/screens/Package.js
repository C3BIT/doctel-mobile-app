import React from "react";
import WaveBackground from "../components/common/WaveBackground";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text } from "react-native";

const Package = () => {
  return (
    <WaveBackground>
      <SafeAreaView style={styles.container}>
        {/* <Text style={styles.text}>Your content here</Text> */}
      </SafeAreaView>
    </WaveBackground>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  text: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
export default Package;
