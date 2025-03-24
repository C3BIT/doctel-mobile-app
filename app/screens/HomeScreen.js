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
import MessageIcon from '../assets/message_icon.svg';
import UploadDocuments from "../components/Prescription/UploadDocuments";
import AppointmentContainer from './../components/AppointmentContainer/AppointmentContainer';

const { width, height } = Dimensions.get("window");
const dynamicWidth = (percentage) => (width * percentage) / 100;
const dynamicHeight = (percentage) => (height * percentage) / 100;
const dynamicFontSize = (size) => (width * size) / 375;

const BOTTOM_TAB_HEIGHT = Platform.OS === 'ios' ? 90 : 60;
const HomeScreen = ({ navigation }) => {
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

      <ScrollView 
        style={styles.contentContainer}
        contentContainerStyle={styles.scrollViewContent}
      >
        <AppointmentContainer />
        <CallFeature  />
        <UploadDocuments navigation={navigation}/> 
      </ScrollView>

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('Chat')}
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
  contentContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: dynamicWidth(4),
  },
  scrollViewContent: {
    paddingBottom: BOTTOM_TAB_HEIGHT + dynamicHeight(3),
  },
  floatingButton: {
    position: 'absolute',
    right: dynamicWidth(5),
    bottom: Platform.OS === 'ios' 
      ? dynamicHeight(4) + BOTTOM_TAB_HEIGHT 
      : dynamicHeight(3) + BOTTOM_TAB_HEIGHT,
    backgroundColor: '#1E3A8A',
    borderRadius: 30,
    width: dynamicWidth(12),
    height: dynamicWidth(12),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    zIndex: 999,
  },
});

export default HomeScreen;