import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  NativeModules,
} from 'react-native';
import { useWebSocket } from '../../providers/WebSocketProvider';
import VideoCallScreen from '../Calling/VideoCallScreen';

if (NativeModules.RNJitsiMeetingModule) {
  if (!NativeModules.RNJitsiMeetingModule.addListener) {
    NativeModules.RNJitsiMeetingModule.addListener = () => {};
  }
  if (!NativeModules.RNJitsiMeetingModule.removeListeners) {
    NativeModules.RNJitsiMeetingModule.removeListeners = () => {};
  }
}

const { width, height } = Dimensions.get('window');

const dynamicWidth = (percentage) => (width * percentage) / 100;
const dynamicHeight = (percentage) => (height * percentage) / 100;
const dynamicFontSize = (size) => (width * size) / 375;

const CallFeature = () => {
  const [isVideoCallModalVisible, setIsVideoCallModalVisible] = useState(false);
  const [isAudioCallModalVisible, setIsAudioCallModalVisible] = useState(false);
  const { socket, isConnected } = useWebSocket();
  
  useEffect(() => {
    if (socket) {
      const handleDoctorList = (doctors) => {
        console.log('Available doctors:', doctors);
      };
      
      socket.on('doctor:list', handleDoctorList);
      
      return () => {
        socket.off('doctor:list', handleDoctorList);
      };
    }
  }, [socket]);
  
  const handleVideoCall = () => {
    if (!isConnected) {
      Alert.alert(
        'Connection Error',
        'Unable to connect to the service. Trying to reconnect...',
      );
      return;
    }
    
    console.log('Video Call clicked');
    setIsVideoCallModalVisible(true);
  };

  const handleAudioCall = () => {
    console.log('Audio Call clicked');
    Alert.alert('Audio Call', 'Audio call feature coming soon');
  };

  const handleCallHistory = () => {
    console.log('Call History clicked');
  };

  const handleCloseVideoCall = () => {
    setIsVideoCallModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Consult With A Doctor Now !</Text>

      <TouchableOpacity
        style={styles.optionContainer}
        onPress={handleVideoCall}
      >
        <View style={styles.iconVideoContainer}>
          <Image
            source={require("../../assets/videoIcon.png")}
            style={styles.icon}
            resizeMode="contain"
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.optionTitle}>Video Call</Text>
          <Text style={styles.optionSubtext}>
            Connect with a doctor, no appointment
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.optionContainer}
        onPress={handleAudioCall}
      >
        <View style={styles.iconAudioContainer}>
          <Image
            source={require("../../assets/audioIcon.png")}
            style={styles.icon}
            resizeMode="contain"
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.optionTitle}>Audio Call</Text>
          <Text style={styles.optionSubtext}>
            Connect with a doctor, no appointment
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.optionContainer}
        onPress={handleCallHistory}
      >
        <View style={styles.iconHistoryContainer}>
          <Image
            source={require("../../assets/callHistoryIcon.png")}
            style={styles.icon}
            resizeMode="contain"
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.optionTitle}>Call History</Text>
          <Text style={styles.optionSubtext}>
            View Your Previous Call History
          </Text>
        </View>
      </TouchableOpacity>

      <VideoCallScreen
        visible={isVideoCallModalVisible}
        onClose={handleCloseVideoCall}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: dynamicFontSize(16),
    fontWeight: "700",
    color: "#0E4946",
    marginBottom: dynamicHeight(1),
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: dynamicWidth(3),
    marginBottom: dynamicHeight(1),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconVideoContainer: {
    backgroundColor: "#3AA7FF",
    borderRadius: 8,
    width: dynamicWidth(10),
    height: dynamicWidth(10),
    justifyContent: "center",
    alignItems: "center",
    marginRight: dynamicWidth(4),
  },
  iconAudioContainer: {
    backgroundColor: "#09D2AC",
    borderRadius: 8,
    width: dynamicWidth(10),
    height: dynamicWidth(10),
    justifyContent: "center",
    alignItems: "center",
    marginRight: dynamicWidth(4),
  },
  iconHistoryContainer: {
    backgroundColor: "#898EFF",
    borderRadius: 8,
    width: dynamicWidth(10),
    height: dynamicWidth(10),
    justifyContent: "center",
    alignItems: "center",
    marginRight: dynamicWidth(4),
  },
  icon: {
    width: dynamicWidth(5),
    height: dynamicWidth(5),
  },
  textContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: dynamicFontSize(16),
    fontWeight: "600",
    color: "#192F5D",
  },
  optionSubtext: {
    fontSize: dynamicFontSize(12),
    color: "#666",
    marginTop: dynamicHeight(0.5),
  },
});

export default CallFeature;