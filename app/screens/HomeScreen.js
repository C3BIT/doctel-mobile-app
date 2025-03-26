import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Platform,
} from "react-native";
import MessageIcon from "../assets/message_icon.svg";
import CallFeature from "../components/common/CallFeature";
import UploadDocuments from "../components/Prescription/UploadDocuments";
import AppointmentContainer from "../components/AppointmentContainer/AppointmentContainer";
import AppHeader from "./../components/Header/AppHeader";
import WellnessSection from "./../components/Header/WellnessSection";

const { width, height } = Dimensions.get("window");
const dynamicWidth = (percentage) => (width * percentage) / 100;
const dynamicHeight = (percentage) => (height * percentage) / 100;

const BOTTOM_TAB_HEIGHT = Platform.OS === "ios" ? 90 : 60;

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <AppHeader />

      <ScrollView
        style={styles.rootContent}
        contentContainerStyle={styles.scrollViewContent}
      >
        <WellnessSection />
        <View style={styles.contentContainer}>
          <AppointmentContainer />
          <CallFeature />
          <UploadDocuments navigation={navigation} />
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate("Chat")}
      >
        <MessageIcon width={24} height={24} fill="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAEFF5",
  },
  rootContent: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: dynamicWidth(3),
  },
  scrollViewContent: {
    paddingBottom: BOTTOM_TAB_HEIGHT + dynamicHeight(4),
  },
  floatingButton: {
    position: "absolute",
    right: dynamicWidth(5),
    bottom:
      Platform.OS === "ios"
        ? dynamicHeight(4) + BOTTOM_TAB_HEIGHT
        : dynamicHeight(3) + BOTTOM_TAB_HEIGHT,
    backgroundColor: "#1E3A8A",
    borderRadius: 30,
    width: dynamicWidth(12),
    height: dynamicWidth(12),
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    zIndex: 999,
  },
});

export default HomeScreen;
