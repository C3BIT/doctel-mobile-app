import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import WaveBackground from '../../../components/common/WaveBackground';

const LoginScreen = () => {
  const [mobileNumber, setMobileNumber] = useState('');

  const validatePhoneNumber = (number) => {
    const phoneRegex = /^0\d{10}$/;
    return phoneRegex.test(number);
  };

  const handleContinue = () => {
    if (!validatePhoneNumber(mobileNumber)) {
      Alert.alert('Invalid Number', 'Mobile number must be 11 digits and start with 0.');
      return;
    }
    console.log('Continue pressed with mobile number:', mobileNumber);
  };

  const handleSocialLogin = (platform) => {
    console.log(`${platform} login pressed`);
  };

  const handleSignUp = () => {
    console.log('Sign up pressed');
  };

  return (
    <WaveBackground>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'position' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.imageContent}>
          <Image
            source={require('../../../assets/capa.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.signInText}>Sign In</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter Mobile Number"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              maxLength={11}
              value={mobileNumber}
              onChangeText={setMobileNumber}
            />
          </View>

          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton} onPress={() => handleSocialLogin('Facebook')}>
              <Image source={require('../../../assets/facebook.png')} style={styles.socialIcon} resizeMode="contain" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton} onPress={() => handleSocialLogin('WhatsApp')}>
              <Image source={require('../../../assets/whatsapp.png')} style={styles.socialIcon} resizeMode="contain" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton} onPress={() => handleSocialLogin('Google')}>
              <Image source={require('../../../assets/google.png')} style={styles.socialIcon} resizeMode="contain" />
            </TouchableOpacity>
          </View>

          <View style={styles.signUpContainer}>
            <Text style={styles.noAccountText}>Don't have an account?</Text>
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={styles.signUpText}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </WaveBackground>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  imageContent: {
    height: height * 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: width * 0.8,
    height: width * 0.8,
  },
  content: {
    height: height * 0.5, 
    alignItems: 'center',
    // justifyContent: 'center',
    paddingHorizontal: 20,
  },
  signInText: {
    fontSize: 24,
    color: 'white',
    fontWeight: '500',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  input: {
    backgroundColor: 'white',
    borderColor: 'white',
    color: '#000',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    width: '100%',
  },
  continueButton: {
    backgroundColor: '#1E3A8A',
    borderRadius: 8,
    padding: 15,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 15,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#223972',
  },
  dividerText: {
    color: '#223972',
    paddingHorizontal: 10,
    fontSize: 14,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 15,
  },
  socialButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  socialIcon: {
    width: 40,
    height: 40,
  },
  signUpContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  noAccountText: {
    color: 'white',
    marginRight: 5,
  },
  signUpText: {
    color: '#223972',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
