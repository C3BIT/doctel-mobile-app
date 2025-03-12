import React, { useRef, useCallback, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  BackHandler,
  Alert,
  TouchableOpacity,
} from "react-native";
import { JitsiMeeting } from "@jitsi/react-native-sdk";
import { useWebSocket } from "../../providers/WebSocketProvider";
import { Mic, Video, Phone } from "lucide-react-native";

const JitsiMeetingScreen = ({ route, navigation }) => {
  const { room, doctorInfo } = route.params;
  const jitsiMeetingRef = useRef(null);
  const { socket } = useWebSocket();
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);

  // Handle hardware back button on Android
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        handleEndCall();
        return true;
      }
    );

    return () => backHandler.remove();
  }, []);

  // Handle doctor disconnection
  useEffect(() => {
    if (!socket) return;

    const handleDoctorDisconnected = (data) => {
      console.log("Doctor disconnected:", data);
      Alert.alert("Call Ended", "The doctor has disconnected from the call.", [
        { text: "OK", onPress: handleEndCall },
      ]);
    };

    socket.on("doctor:disconnected", handleDoctorDisconnected);

    return () => {
      socket.off("doctor:disconnected", handleDoctorDisconnected);
    };
  }, [socket]);

  const handleEndCall = () => {
    if (socket?.connected) {
      socket.emit("call:end");
      console.log("Call ended by patient");
    }

    if (jitsiMeetingRef.current) {
      try {
        jitsiMeetingRef.current.close();
      } catch (error) {
        console.error("Error closing Jitsi meeting:", error);
      }
    }

    navigation.goBack();
  };

  const toggleAudio = useCallback(() => {
    if (jitsiMeetingRef.current) {
      jitsiMeetingRef.current.executeCommand("toggleAudio");
      setIsAudioMuted(!isAudioMuted);
    }
  }, [isAudioMuted]);

  const toggleVideo = useCallback(() => {
    if (jitsiMeetingRef.current) {
      jitsiMeetingRef.current.executeCommand("toggleVideo");
      setIsVideoMuted(!isVideoMuted);
    }
  }, [isVideoMuted]);

  // Jitsi event callbacks
  const onConferenceTerminated = useCallback(() => {
    console.log("Jitsi conference terminated");
    handleEndCall();
  }, []);

  const onConferenceJoined = useCallback(() => {
    console.log("Conference joined successfully");
  }, []);

  const onConferenceWillJoin = useCallback(() => {
    console.log("Will join conference");
  }, []);

  const onError = useCallback((error) => {
    console.error("Jitsi meeting error:", error);
    Alert.alert(
      "Connection Error",
      "Failed to join the video call. Please try again.",
      [{ text: "OK", onPress: handleEndCall }]
    );
  }, []);

  // Process Jitsi API events for audio/video state tracking
  const onApiResponse = useCallback((event) => {
    if (event?.name === "audioMuteStatusChanged") {
      setIsAudioMuted(event.muted);
    } else if (event?.name === "videoMuteStatusChanged") {
      setIsVideoMuted(event.muted);
    }
  }, []);

  return (
    <View style={styles.container}>
      <JitsiMeeting
        ref={jitsiMeetingRef}
        serverURL="https://call.bloomattires.com"
        room={room}
        config={{
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          subject: "Medical Consultation",
          prejoinPageEnabled: false,
          hideConferenceTimer: false,
          whiteboard: {
            enabled: true,
            collabServerBaseUrl: "https://call.bloomattires.com/",
          },
          // Hide native controls we'll replace
          toolbarButtons: [
            "hangup",
            "chat",
            "raisehand",
            "tileview",
            "whiteboard",
            "settings",
          ],
        }}
        flags={{
          prejoinPageEnabled: false,
          "welcomePage.enabled": false,
          "ios.screensharing.enabled": true,
          "fullscreen.enabled": true,
          "audioOnly.enabled": true,
          "android.screensharing.enabled": true,
          "pip.enabled": true,
          "pip-while-screen-sharing.enabled": true,
          "conference-timer.enabled": true,
          "toolbox.enabled": true,
          "filmstrip.enabled": true,
        }}
        userInfo={{
          displayName: "Patient",
          email: "",
          avatar: "",
        }}
        onConferenceTerminated={onConferenceTerminated}
        onConferenceJoined={onConferenceJoined}
        onConferenceWillJoin={onConferenceWillJoin}
        onError={onError}
        eventListeners={[
          { name: "audioMuteStatusChanged", listener: onApiResponse },
          { name: "videoMuteStatusChanged", listener: onApiResponse },
        ]}
        style={styles.jitsiMeeting}
      />

      {/* Custom buttons overlay */}
      <View style={styles.customButtonsContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            isAudioMuted ? styles.buttonRed : styles.buttonGreen,
          ]}
          onPress={toggleAudio}
        >
          <Mic width={24} height={24} color="#ffffff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            isVideoMuted ? styles.buttonRed : styles.buttonRed,
          ]}
          onPress={toggleVideo}
        >
          <Video width={24} height={24} color="#ffffff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonRed]}
          onPress={handleEndCall}
        >
          <Phone width={24} height={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  jitsiMeeting: {
    flex: 1,
  },
  customButtonsContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#192841",
    borderRadius: 30,
    marginHorizontal: 40,
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  buttonGreen: {
    backgroundColor: "#4CAF50",
  },
  buttonRed: {
    backgroundColor: "#F44336",
  },
});

export default JitsiMeetingScreen;
