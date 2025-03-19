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
  StatusBar,
  Alert,
  AppState,
} from 'react-native';
import WaveBackground from '../common/WaveBackground';
import { useWebSocket } from '../../providers/WebSocketProvider';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const scale = size => (width / 375) * size;
const verticalScale = size => (height / 812) * size;

const VideoCallScreen = ({ visible, onClose }) => {
  const [callStatus, setCallStatus] = useState('connecting');
  const [jitsiRoomName, setJitsiRoomName] = useState(''); 
  const { socket } = useWebSocket();
  const callTimeoutRef = useRef(null);
  const [doctorInfo, setDoctorInfo] = useState({});
  const navigation = useNavigation();

  useEffect(() => {
    if (visible) {
      initiateCall();
      callTimeoutRef.current = setTimeout(() => {
        if (callStatus === 'connecting') {
          setCallStatus('failed');
          Alert.alert(
            'Call Failed',
            'No doctors available at this moment. Please try again later.',
            [{ text: 'OK', onPress: handleClose }]
          );
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

    const handleInitiated = (data) => {
      console.log('Call initiated:', data);
      if (data.jitsiRoom) {
        const roomUrl = data.jitsiRoom;
        let roomName;
        
        if (roomUrl.includes('/')) {
          roomName = roomUrl.split('/').pop();
          roomName = roomName.split('#')[0];
          roomName = roomName.split('?')[0];
        } else {
          roomName = roomUrl;
        }
        
        console.log('Extracted room name:', roomName);
        setJitsiRoomName(roomName);
      } else {
        console.error('No Jitsi room provided in call initiation data');
      }
    };

    const handleAccepted = (data) => {
      console.log('Call accepted by doctor:', data);
      setDoctorInfo(data);
      if (callTimeoutRef.current) {
        clearTimeout(callTimeoutRef.current);
      }
      setCallStatus('accepted');
      
      if (jitsiRoomName) {
        handleClose();
        navigation.navigate('JitsiMeeting', { 
          room: jitsiRoomName,
          doctorInfo: data
        });
      }
    };

    const handleFailed = (data) => {
      console.log('Call failed:', data);
      if (callTimeoutRef.current) {
        clearTimeout(callTimeoutRef.current);
      }
      setCallStatus('failed');
      Alert.alert(
        'Call Failed',
        data?.message || 'Unable to connect with a doctor. Please try again later.',
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

    socket.on('call:initiated', handleInitiated);
    socket.on('call:accepted', handleAccepted);
    socket.on('call:failed', handleFailed);
    socket.on('doctor:disconnected', handleDoctorDisconnected);

    return () => {
      socket.off('call:initiated', handleInitiated);
      socket.off('call:accepted', handleAccepted);
      socket.off('call:failed', handleFailed);
      socket.off('doctor:disconnected', handleDoctorDisconnected);
    };
  }, [socket, jitsiRoomName, navigation]);

  const initiateCall = () => {
    if (socket?.connected) {
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

  const handleCancel = () => {
    if (socket?.connected) {
      socket.emit('call:cancel');
      console.log('Call cancelled by patient');
    }
    handleClose();
  };

  const handleClose = () => {
    setCallStatus('connecting');
    setJitsiRoomName('');
    onClose();
  };

  const renderCallingScreen = () => {
    return (
      <WaveBackground>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.endButton}
              onPress={handleCancel}
              accessibilityLabel="End call"
            >
              <Text style={styles.endButtonText}>End</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.callingContainer}>
            <View style={styles.doctorAvatarContainer}>
              <Image
                source={require('../../assets/avatar.png')}
                style={styles.doctorAvatar}
                resizeMode="cover"
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
          </View>
          
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
              accessibilityLabel="Cancel call"
            >
              <View style={styles.cancelIconContainer}>
                <Text style={styles.cancelIconText}>X</Text>
              </View>
            </TouchableOpacity>
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
      statusBarTranslucent
    >
      {renderCallingScreen()}
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 10,
    right: 20,
    zIndex: 10,
  },
  endButton: {
    backgroundColor: '#E74C3C',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  endButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: scale(14),
  },
  callingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(20),
  },
  doctorAvatarContainer: {
    width: scale(120),
    height: scale(120),
    borderRadius: scale(60),
    backgroundColor: '#8EE4AF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(24),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  doctorAvatar: {
    width: scale(105),
    height: scale(105),
    borderRadius: scale(52.5),
  },
  doctorName: {
    fontSize: scale(22),
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: verticalScale(8),
    textAlign: 'center',
  },
  doctorCredentials: {
    fontSize: scale(16),
    color: '#E0FFFF',
    marginBottom: verticalScale(16),
    textAlign: 'center',
  },
  callingText: {
    fontSize: scale(18),
    color: '#FFFFFF',
    marginBottom: verticalScale(20),
  },
  footer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 30,
    width: '100%',
    alignItems: 'center',
  },
  cancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelIconContainer: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
    backgroundColor: '#E74C3C',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cancelIconText: {
    color: 'white',
    fontSize: scale(24),
    fontWeight: 'bold',
  }
});

export default VideoCallScreen;