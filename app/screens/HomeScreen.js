import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  ScrollView,
  Platform,
} from "react-native";
import CustomLanguageSwitch from "../components/common/CustomLanguageSwitch";
import WellnessCard from "../components/common/WellnessCard";
import CallFeature from "../components/common/CallFeature";

const { width, height } = Dimensions.get("window");

const dynamicWidth = (percentage) => (width * percentage) / 100;
const dynamicHeight = (percentage) => (height * percentage) / 100;
const dynamicFontSize = (size) => (width * size) / 375;

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Image
            source={require("../assets/headerLogo.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <CustomLanguageSwitch />
        </View>
        <View style={styles.horizontalLine} />

        <View style={styles.headerContent}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.question}>How are you feeling today?</Text>
          </View>
          <Image
            source={require("../assets/leaves.png")}
            style={styles.leavesImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.wellnessCardContainer}>
          <WellnessCard />
        </View>
      </View>

      <View style={styles.appointmentContainer}>
        <TouchableOpacity style={styles.appointmentButton}>
          <View style={styles.appointmentContent}>
            <View style={styles.iconContainer}>
              <Image
                source={require("../assets/calender.png")}
                style={styles.calendarIcon}
                resizeMode="contain"
              />
            </View>
            <View>
              <Text style={styles.appointmentText}>Book Appointment</Text>
              <Text style={styles.appointmentSubtext}>
                View Your Previous Call History
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.contentContainer}>
        <CallFeature />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerContainer: {
    backgroundColor: "#20ACE2",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingBottom: dynamicHeight(2),
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: dynamicWidth(5),
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    height: dynamicHeight(8),
  },
  horizontalLine: {
    width: "100%",
    height: 1,
    backgroundColor: "#0A4E52",
    opacity: 0.3,
    marginTop: dynamicHeight(2),
  },
  logoImage: {
    width: dynamicWidth(60),
    height: dynamicHeight(6),
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    top: dynamicHeight(1),
    height: dynamicHeight(8),
    paddingHorizontal: dynamicWidth(5),
  },
  headerTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  question: {
    color: "#FFFFFF",
    fontSize: dynamicFontSize(18),
    textAlign: "left",
  },
  leavesImage: {
    width: dynamicWidth(30),
    height: dynamicHeight(25),
    opacity: 0.7,
  },
  wellnessCardContainer: {
    paddingHorizontal: dynamicWidth(5),
  },
  appointmentContainer: {
    backgroundColor: "#FFFFFF",
    padding: dynamicWidth(4),
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: dynamicWidth(4),
  },
  appointmentButton: {
    backgroundColor: "#192F5D",
    borderRadius: 12,
    padding: dynamicWidth(4),
  },
  appointmentContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    width: dynamicWidth(10),
    height: dynamicWidth(10),
    justifyContent: "center",
    alignItems: "center",
    marginRight: dynamicWidth(4),
  },
  calendarIcon: {
    width: dynamicWidth(5),
    height: dynamicWidth(5),
  },
  appointmentText: {
    color: "#fff",
    fontSize: dynamicFontSize(16),
    fontWeight: "600",
  },
  appointmentSubtext: {
    color: "#fff",
    opacity: 0.8,
    fontSize: dynamicFontSize(12),
    marginTop: dynamicHeight(0.5),
  },
});

export default HomeScreen;
