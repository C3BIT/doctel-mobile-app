import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
  Dimensions,
  Platform,
  Alert,
  NativeModules,
} from 'react-native';
import { JitsiMeeting } from '@jitsi/react-native-sdk';
import WaveBackground from '../common/WaveBackground';
import { useWebSocket } from '../../providers/WebSocketProvider';

const { width, height } = Dimensions.get('window');

const dynamicWidth = (percentage) => (width * percentage) / 100;
const dynamicHeight = (percentage) => (height * percentage) / 100;
const dynamicFontSize = (size) => (width * size) / 375;

if (NativeModules.RNJitsiMeetingModule) {
  if (!NativeModules.RNJitsiMeetingModule.addListener) {
    NativeModules.RNJitsiMeetingModule.addListener = () => {};
  }
  if (!NativeModules.RNJitsiMeetingModule.removeListeners) {
    NativeModules.RNJitsiMeetingModule.removeListeners = () => {};
  }
}

const VideoCallScreen = ({ visible, onClose, doctorInfo }) => {
  const [callStatus, setCallStatus] = useState('connecting'); 
  const [jitsiUrl, setJitsiUrl] = useState('');
  const [showJitsi, setShowJitsi] = useState(false);
  const { socket } = useWebSocket();
  const callTimeoutRef = useRef(null);
  const jitsiMeetingRef = useRef(null);
  
  useEffect(() => {
    if (visible) {
      initiateCall();
      callTimeoutRef.current = setTimeout(() => {
        if (callStatus === 'connecting') {
          setCallStatus('failed');
        //   Alert.alert(
        //     'Call Failed',
        //     'No doctors available at this moment. Please try again later.',
        //     [{ text: 'OK', onPress: handleClose }]
        //   );
        }
      }, 30000);
    }
    
    return () => {
      if (callTimeoutRef.current) {
        clearTimeout(callTimeoutRef.current);
      }
    };
  }, [visible]);

  useEffect(() => {
    if (!socket) return;
    
    const handleInitiated = (data) => handleCallInitiated(data);
    const handleAccepted = (data) => handleCallAccepted(data);
    const handleFailed = (data) => handleCallFailed(data);
    const handleDisconnected = (data) => handleDoctorDisconnected(data);
    
    socket.on('call:initiated', handleInitiated);
    socket.on('call:accepted', handleAccepted);
    // socket.on('call:failed', handleFailed);
    socket.on('doctor:disconnected', handleDisconnected);
    
    return () => {
      socket.off('call:initiated', handleInitiated);
      socket.off('call:accepted', handleAccepted);
      socket.off('call:failed', handleFailed);
      socket.off('doctor:disconnected', handleDisconnected);
    };
  }, [socket]);

  const initiateCall = () => {
    if (socket && socket.connected) {
      console.log('Initiating call to doctor');
      socket.emit('call:initiate');
      setCallStatus('connecting');
    } else {
      console.error('Socket not connected');
      Alert.alert(
        'Connection Error',
        'Unable to connect to the service. Please try again later.',
        [{ text: 'OK', onPress: handleClose }]
      );
    }
  };

  const handleCallInitiated = (data) => {
    console.log('Call initiated:', data);
    setJitsiUrl(data.jitsiRoom);
  };

  const handleCallAccepted = (data) => {
    console.log('Call accepted by doctor:', data);
    if (callTimeoutRef.current) {
      clearTimeout(callTimeoutRef.current);
    }
    
    setCallStatus('accepted');
    setShowJitsi(true);
  };

  const handleCallFailed = (data) => {
    console.log('Call failed:', data);
    if (callTimeoutRef.current) {
      clearTimeout(callTimeoutRef.current);
    }
    
    setCallStatus('failed');
    Alert.alert(
      'Call Failed',
      data.message || 'Unable to connect with a doctor. Please try again later.',
      [{ text: 'OK', onPress: handleClose }]
    );
  };

  const handleDoctorDisconnected = (data) => {
    console.log('Doctor disconnected:', data);
    Alert.alert(
      'Call Ended',
      'The doctor has disconnected from the call.',
      [{ text: 'OK', onPress: handleClose }]
    );
  };

  const handleCancel = () => {
    if (socket && socket.connected) {
      socket.emit('call:end');
      console.log('Call cancelled by patient');
    }
    handleClose();
  };

  const handleClose = () => {
    if (jitsiMeetingRef.current) {
      try {
        jitsiMeetingRef.current.close();
      } catch (error) {
        console.error('Error closing Jitsi meeting:', error);
      }
    }
    
    setShowJitsi(false);
    setCallStatus('connecting');
    setJitsiUrl('');
    onClose();
  };

  // Jitsi event callbacks
  const onConferenceTerminated = useCallback(() => {
    console.log('Jitsi conference terminated');
    if (socket && socket.connected) {
      socket.emit('call:end');
    }
    handleClose();
  }, [socket]);

  const onConferenceJoined = useCallback(() => {
    console.log('Conference joined');
  }, []);

  const onConferenceWillJoin = useCallback(() => {
    console.log('Will join conference');
  }, []);

  const renderJitsiMeeting = () => {
    if (!showJitsi || !jitsiUrl) return null;
    
    const jitsiRoomName = jitsiUrl.split('/').pop();
    
    return (
      <View style={styles.jitsiContainer}>
        <JitsiMeeting
          ref={jitsiMeetingRef}
          serverURL="https://call.bloomattires.com"
          room={jitsiRoomName}
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
          style={styles.jitsiMeeting}
        />
      </View>
    );
  };

  // Render calling UI
  const renderCallingScreen = () => {
    return (
      <WaveBackground>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.callingContainer}>
            <View style={styles.doctorAvatarContainer}>
              <Image
                source={require('../../assets/avatar.png')}
                style={styles.doctorAvatar}
              />
            </View>
            
            <Text style={styles.doctorName}>
              {doctorInfo?.name || 'Dr. Waiting for doctor...'}
            </Text>
            <Text style={styles.doctorCredentials}>
              {doctorInfo?.credentials || 'Connecting to a specialist'}
            </Text>
            
            <Text style={styles.callingText}>
              {callStatus === 'connecting' ? 'Calling...' : 'Connected'}
            </Text>
            
            <View style={styles.cancelButtonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
              >
                <Image
                  source={require('../../assets/audioIcon.png')}
                  style={styles.cancelIcon}
                />
                <Text style={styles.cancelText}>slide to cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </WaveBackground>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleCancel}
    >
      {showJitsi ? renderJitsiMeeting() : renderCallingScreen()}
    </Modal>
  );
};

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  callingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doctorAvatarContainer: {
    width: dynamicWidth(30),
    height: dynamicWidth(30),
    borderRadius: dynamicWidth(15),
    backgroundColor: '#8EE4AF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: dynamicHeight(3),
  },
  doctorAvatar: {
    width: dynamicWidth(25),
    height: dynamicWidth(25),
    borderRadius: dynamicWidth(12.5),
  },
  doctorName: {
    fontSize: dynamicFontSize(20),
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: dynamicHeight(1),
    textAlign: 'center',
  },
  doctorCredentials: {
    fontSize: dynamicFontSize(14),
    color: '#E0FFFF',
    marginBottom: dynamicHeight(2),
    textAlign: 'center',
  },
  callingText: {
    fontSize: dynamicFontSize(16),
    color: '#FFFFFF',
    marginBottom: dynamicHeight(10),
  },
  cancelButtonContainer: {
    position: 'absolute',
    bottom: dynamicHeight(5),
    width: dynamicWidth(80),
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 30,
    paddingHorizontal: dynamicWidth(4),
    paddingVertical: dynamicHeight(1.5),
  },
  cancelIcon: {
    width: dynamicWidth(8),
    height: dynamicWidth(8),
    tintColor: '#FF6347',
  },
  cancelText: {
    color: '#FFFFFF',
    marginLeft: dynamicWidth(2),
    fontSize: dynamicFontSize(14),
  },
  jitsiContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  jitsiMeeting: {
    flex: 1,
  },
});

export default VideoCallScreen;