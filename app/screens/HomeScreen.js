import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  SafeAreaView,
  Platform,
} from "react-native";
import CustomLanguageSwitch from "../components/common/CustomLanguageSwitch";
import WellnessCard from "../components/common/WellnessCard";

const { width, height } = Dimensions.get("window");

const dynamicWidth = (percentage) => (width * percentage) / 100;
const dynamicHeight = (percentage) => (height * percentage) / 100;
const dynamicFontSize = (size) => (width * size) / 375;

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Text style={styles.logoText}>DOCTEL</Text>
          <CustomLanguageSwitch />
        </View>

        <View style={styles.headerContent}>
          <Text style={styles.question}>How are you feeling today?</Text>
        </View>

        <Image
          source={require("../assets/leaves.png")}
          style={styles.leavesBackground}
          resizeMode="contain"
        />
        <View style={styles.wellnessCardContainer}>
          <WellnessCard />
        </View>
      </View>

      <View style={styles.contentContainer}>
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
  logoText: {
    color: "#FFFFFF",
    fontSize: dynamicFontSize(18),
    fontWeight: "bold",
  },
  headerContent: {
    paddingHorizontal: dynamicWidth(5),
    paddingBottom: dynamicHeight(2),
  },
  question: {
    color: "#fff",
    fontSize: dynamicFontSize(18),
    fontWeight: "500",
    marginBottom: dynamicHeight(2),
  },
  wellnessCardContainer: {
    paddingHorizontal: dynamicWidth(5),
  },
  testHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: dynamicHeight(0.5),
  },
  testTitle: {
    color: "#00B0ED",
    fontWeight: "bold",
    fontSize: dynamicFontSize(14),
  },
  testScore: {
    color: "#00B0ED",
    fontWeight: "bold",
    fontSize: dynamicFontSize(14),
  },
  testDescription: {
    color: "#666",
    fontSize: dynamicFontSize(12),
    marginBottom: dynamicHeight(1),
  },
  moreDetails: {
    color: "#00B0ED",
    fontSize: dynamicFontSize(12),
    textDecorationLine: "underline",
  },
  leavesBackground: {
    position: "absolute",
    right: 0,
    top: dynamicHeight(10),
    width: dynamicWidth(30),
    height: dynamicHeight(15),
    opacity: 0.7,
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
    marginBottom: dynamicHeight(2),
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
