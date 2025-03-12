import React, { useRef, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  BackHandler,
  Alert,
} from 'react-native';
import { JitsiMeeting } from '@jitsi/react-native-sdk';
import { useWebSocket } from '../../providers/WebSocketProvider';

const JitsiMeetingScreen = ({ route, navigation }) => {
  const { room, doctorInfo } = route.params;
  const jitsiMeetingRef = useRef(null);
  const { socket } = useWebSocket();

  // Handle hardware back button on Android
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      handleEndCall();
      return true;
    });

    return () => backHandler.remove();
  }, []);

  // Handle doctor disconnection
  useEffect(() => {
    if (!socket) return;

    const handleDoctorDisconnected = (data) => {
      console.log('Doctor disconnected:', data);
      Alert.alert(
        'Call Ended',
        'The doctor has disconnected from the call.',
        [{ text: 'OK', onPress: handleEndCall }]
      );
    };

    socket.on('doctor:disconnected', handleDoctorDisconnected);

    return () => {
      socket.off('doctor:disconnected', handleDoctorDisconnected);
    };
  }, [socket]);

  const handleEndCall = () => {
    if (socket?.connected) {
      socket.emit('call:end');
      console.log('Call ended by patient');
    }
    
    if (jitsiMeetingRef.current) {
      try {
        jitsiMeetingRef.current.close();
      } catch (error) {
        console.error('Error closing Jitsi meeting:', error);
      }
    }
    
    navigation.goBack();
  };

  // Jitsi event callbacks
  const onConferenceTerminated = useCallback(() => {
    console.log('Jitsi conference terminated');
    handleEndCall();
  }, []);

  const onConferenceJoined = useCallback(() => {
    console.log('Conference joined successfully');
  }, []);

  const onConferenceWillJoin = useCallback(() => {
    console.log('Will join conference');
  }, []);
  
  const onError = useCallback((error) => {
    console.error('Jitsi meeting error:', error);
    Alert.alert(
      'Connection Error',
      'Failed to join the video call. Please try again.',
      [{ text: 'OK', onPress: handleEndCall }]
    );
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
          subject: 'Medical Consultation',
          hideConferenceTimer: false,
          whiteboard: {
            enabled: true,
            collabServerBaseUrl: "https://call.bloomattires.com/",
          },
        }}
        flags={{
          "audioMute.enabled": true,
          "ios.screensharing.enabled": true,
          "fullscreen.enabled": true,
          "audioOnly.enabled": true,
          "android.screensharing.enabled": true,
          "pip.enabled": true,
          "pip-while-screen-sharing.enabled": true,
          "conference-timer.enabled": true,
          "close-captions.enabled": false,
          "toolbox.enabled": true,
        }}
        userInfo={{
          displayName: 'Patient',
          email: '',
          avatar: '',
        }}
        onConferenceTerminated={onConferenceTerminated}
        onConferenceJoined={onConferenceJoined}
        onConferenceWillJoin={onConferenceWillJoin}
        onError={onError}
        style={styles.jitsiMeeting}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  jitsiMeeting: {
    flex: 1,
  },
});

export default JitsiMeetingScreen;