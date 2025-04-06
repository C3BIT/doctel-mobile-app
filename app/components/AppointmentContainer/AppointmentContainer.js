import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get("window");
const dynamicWidth = (percentage) => (width * percentage) / 100;
const dynamicHeight = (percentage) => (height * percentage) / 100;
const dynamicFontSize = (size) => (width * size) / 375;

const AppointmentContainer = () => {
  return (
    <TouchableOpacity 
      style={styles.appointmentButton} 
    >
      <View style={styles.appointmentContent}>
        <View style={styles.iconContainer}>
          <Image
            source={require("../../assets/calender.png")}
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
  );
};

const styles = StyleSheet.create({
  appointmentButton: {
    backgroundColor: "#192F5D",
    borderRadius: 12,
    padding: dynamicWidth(4),
    marginBottom: dynamicHeight(1),
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

export default AppointmentContainer;