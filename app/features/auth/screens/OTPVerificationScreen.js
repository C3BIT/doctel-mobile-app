import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Dimensions
} from "react-native";
import WaveBackground from "../../../components/common/WaveBackground";
import { useDispatch, useSelector } from "react-redux";
import { patientLogin } from "../../../redux/features/auth/patientAuthSlice";
import { useRoute } from "@react-navigation/native";
import Loader from "../../../components/common/Loader";
const { width, height } = Dimensions.get('window');
const OTPVerificationScreen = () => {
  const [otp, setOtp] = useState(["0", "5", "8", "3"]);
  const inputRefs = useRef([...Array(4)].map(() => React.createRef()));
  const [timer, setTimer] = useState(41);
  const { isLoading, status } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const route = useRoute();
  const { phone } = route.params;

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChangeText = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 3) {
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
   dispatch(patientLogin({
    otp: enteredOtp,
    phone
   }))
  };

  const formatTime = (seconds) => {
    return `0:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  const handleResend = () => {
    setTimer(41);
  };

  return (
    <WaveBackground>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "position" : "height"}
        style={styles.keyboardAvoidingView}
      >
          { isLoading && <Loader />}
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

            <Text style={styles.resendText}>
              Resend code in {formatTime(timer)}
            </Text>

            <TouchableOpacity
              style={styles.verifyButton}
              onPress={handleVerify}
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
  resendText: {
    color: "white",
    marginBottom: 32,
    fontSize: 14,
  },
  verifyButton: {
    width: "100%",
    backgroundColor: "#10294D",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  verifyButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default OTPVerificationScreen;
