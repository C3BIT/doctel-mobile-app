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
import { Mic, MicOff, Video, VideoOff, Phone } from "lucide-react-native";

const JitsiMeetingScreen = ({ route, navigation }) => {
  const { room, doctorInfo } = route.params;
  const jitsiMeetingRef = useRef(null);
  const { socket } = useWebSocket();
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  
  const [callTime, setCallTime] = useState(null);

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
    if (callTime) {
      console.log(`Call ended. Duration: ${callTime}`);
    }
    
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
    try {
      if (jitsiMeetingRef.current) {
        jitsiMeetingRef.current.setAudioMuted(!isAudioMuted);
        setIsAudioMuted(!isAudioMuted);
      }
    } catch (error) {
      console.error("Error toggling audio:", error);
    }
  }, [isAudioMuted]);

  const toggleVideo = useCallback(() => {
    try {
      if (jitsiMeetingRef.current) {
        jitsiMeetingRef.current.setVideoMuted(!isVideoMuted);
        setIsVideoMuted(!isVideoMuted);
      }
    } catch (error) {
      console.error("Error toggling video:", error);
    }
  }, [isVideoMuted]);

  const onConferenceTerminated = useCallback(() => {
    console.log("Jitsi conference terminated");
    handleEndCall();
  }, []);

  const onConferenceJoined = useCallback(() => {
    console.log("Conference joined successfully");
    setTimeout(() => {
      try {
        if (jitsiMeetingRef.current) {
          const audioMuted = jitsiMeetingRef.current.isAudioMuted();
          const videoMuted = jitsiMeetingRef.current.isVideoMuted();
          console.log("Initial states:", { audioMuted, videoMuted });
          
          if (audioMuted !== undefined) setIsAudioMuted(audioMuted);
          if (videoMuted !== undefined) setIsVideoMuted(videoMuted);
        }
      } catch (error) {
        console.error("Error getting initial mute states:", error);
      }
    }, 1000);
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

  const onApiResponse = useCallback((event) => {
    if (event?.name === "audioMuteStatusChanged") {
      setIsAudioMuted(event.muted);
    } else if (event?.name === "videoMuteStatusChanged") {
      setIsVideoMuted(event.muted);
    } else if (event?.name === "conference.timer") {
      if (event?.value) {
        if (typeof event.value === 'object' && event.value.formattedValue) {
          setCallTime(event.value.formattedValue);
        } else if (typeof event.value === 'string') {
          setCallTime(event.value);
        }
      }
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
          disableDeepLinking: true,
          disableInviteFunctions: true,
          whiteboard: {
            enabled: true,
            collabServerBaseUrl: "https://call.bloomattires.com/",
          },
          toolbarButtons: [],
          hideConferenceSubject: true,
          hideDisplayName: true,
          notifications: {
            enabled: false,
          },
          participantsPane: {
            enabled: false,
            hideDisplayName: true,
          },
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
          "filmstrip.enabled": true,
          "notifications.enabled": false,
          "participants-pane.enabled": false,
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
          { name: "conference.timer", listener: onApiResponse }
        ]}
        style={styles.jitsiMeeting}
      />

      <View style={styles.customButtonsContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            isAudioMuted ? styles.buttonRed : styles.buttonGreen,
          ]}
          onPress={toggleAudio}
          activeOpacity={0.7}
        >
          {isAudioMuted ? (
            <MicOff width={24} height={24} color="#ffffff" />
          ) : (
            <Mic width={24} height={24} color="#ffffff" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            isVideoMuted ? styles.buttonRed : styles.buttonGreen,
          ]}
          onPress={toggleVideo}
          activeOpacity={0.7}
        >
          {isVideoMuted ? (
            <VideoOff width={24} height={24} color="#ffffff" />
          ) : (
            <Video width={24} height={24} color="#ffffff" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonRed]}
          onPress={handleEndCall}
          activeOpacity={0.7}
        >
          <Phone 
            width={24} 
            height={24} 
            color="#ffffff" 
            style={{ transform: [{ rotate: "135deg" }] }} 
          />
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
    backgroundColor: "rgba(25, 40, 65, 0.9)",
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonGreen: {
    backgroundColor: "#4CAF50",
  },
  buttonRed: {
    backgroundColor: "#F44336",
  },
});

export default JitsiMeetingScreen;