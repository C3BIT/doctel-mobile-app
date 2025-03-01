import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Dimensions
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useRoute } from "@react-navigation/native";

// Components
import WaveBackground from "../../../components/common/WaveBackground";
import Loader from "../../../components/common/Loader";

import { patientLogin } from "../../../redux/features/auth/patientAuthSlice";

const { width, height } = Dimensions.get('window');
const OTP_LENGTH = 4;
const INITIAL_TIMER_SECONDS = 150;

const OTPVerificationScreen = () => {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [timer, setTimer] = useState(INITIAL_TIMER_SECONDS);
  
  const inputRefs = useRef(Array(OTP_LENGTH).fill(null).map(() => React.createRef()));
  
  const { verifyLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  const route = useRoute();
  const { phone } = route.params;

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(timerInterval);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  const handleChangeText = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = () => {
    const enteredOtp = otp.join("");
    console.log("=============otp============", enteredOtp,phone);
    if (enteredOtp.length === OTP_LENGTH) {
      dispatch(patientLogin({
        otp: enteredOtp,
        phone
      }));
    }
  };

  const handleResend = () => {
    // Reset OTP fields
    setOtp(Array(OTP_LENGTH).fill(""));
    // Reset timer
    setTimer(INITIAL_TIMER_SECONDS);
    // TODO: Add API call to resend OTP
  };

  // Formatters
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  return (
    <WaveBackground>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "position" : "height"}
        style={styles.keyboardAvoidingView}
      >
        {verifyLoading && <Loader />}
        
        <View style={styles.contentContainer}>
          <View style={styles.imageContent}>
            <Image
              source={require("../../../assets/capa2.png")}
              style={styles.image}
              resizeMode="contain"
            />
          </View>

          <View style={styles.verificationContainer}>
            <Text style={styles.verificationTitle}>Verification</Text>
            <Text style={styles.verificationSubtitle}>
              Enter the verification code that was sent to your mobile number
            </Text>

            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  style={styles.otpInput}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={(value) => handleChangeText(value, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  selectionColor="#1E3A8A"
                />
              ))}
            </View>

            <View style={styles.timerContainer}>
              <Text style={styles.resendText}>
                {timer > 0 
                  ? `Resend code in ${formatTime(timer)}` 
                  : "Didn't receive the code?"}
              </Text>
              
              {timer === 0 && (
                <TouchableOpacity onPress={handleResend}>
                  <Text style={styles.resendButton}>Resend Code</Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.verifyButton,
                otp.join("").length !== OTP_LENGTH && styles.disabledButton
              ]}
              onPress={handleVerify}
              disabled={otp.join("").length !== OTP_LENGTH}
              activeOpacity={0.8}
            >
              <Text style={styles.verifyButtonText}>Verify</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </WaveBackground>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  imageContent: {
    height: height * 0.5,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: width * 0.8,
    height: width * 0.8,
  },
  verificationContainer: {
    width: "100%",
    flex: 1,
    alignItems: "center",
  },
  verificationTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "white",
    marginBottom: 8,
    textAlign: "center",
  },
  verificationSubtitle: {
    fontSize: 14,
    color: "white",
    textAlign: "center",
    marginBottom: 32,
    width: "80%",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 24,
  },
  otpInput: {
    width: 60,
    height: 60,
    backgroundColor: "#10294D",
    borderRadius: 8,
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  timerContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  resendText: {
    color: "white",
    fontSize: 14,
    marginBottom: 8,
  },
  resendButton: {
    color: "#4F8EF7",
    fontSize: 14,
    fontWeight: "bold",
  },
  verifyButton: {
    width: "100%",
    backgroundColor: "#10294D",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
  verifyButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default OTPVerificationScreen;