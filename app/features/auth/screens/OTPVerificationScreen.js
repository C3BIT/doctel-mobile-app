import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useRoute, useNavigation } from "@react-navigation/native";

// Components
import WaveBackground from "../../../components/common/WaveBackground";
import Loader from "../../../components/common/Loader";

import { patientLogin } from "../../../redux/features/auth/patientAuthSlice";
import FlashMessage from "../../../components/shared/FlashMessage";
import { useTranslation } from "react-i18next";

const { width, height } = Dimensions.get("window");

const getResponsiveSize = (size) => {
  const standardWidth = 375;
  return (width / standardWidth) * size;
};

const OTP_LENGTH = 4;
const INITIAL_TIMER_SECONDS = 150;

const OTPVerificationScreen = () => {
  const { t } = useTranslation();
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [timer, setTimer] = useState(INITIAL_TIMER_SECONDS);

  const inputRefs = useRef([]);

  const { verifyLoading, error, status } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const route = useRoute();
  const { phone } = route.params || { phone: "" };

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

  useEffect(() => {
    if (status === "error") {
      FlashMessage.error(
        error || "Unable to verify your credentials. Please try again."
      );
    }
  }, [status, error, navigation]);

  useEffect(() => {
    inputRefs.current = Array(OTP_LENGTH)
      .fill(null)
      .map((_, i) => inputRefs.current[i] || React.createRef());
  }, []);

  useEffect(() => {
    if (Platform.OS === "ios") {
      TextInput.defaultProps = TextInput.defaultProps || {};
      TextInput.defaultProps.scrollEnabled = false;
    }
  }, []);

  const handleChangeText = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-advance to next input
      if (value && index < OTP_LENGTH - 1 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyPress = (e, index) => {
    if (
      e.nativeEvent.key === "Backspace" &&
      !otp[index] &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length === OTP_LENGTH) {
      Keyboard.dismiss();
      dispatch(
        patientLogin({
          otp: enteredOtp,
          phone,
        })
      );
    }
  };

  const handleResend = () => {
    // Reset OTP fields
    setOtp(Array(OTP_LENGTH).fill(""));
    // Reset timer
    setTimer(INITIAL_TIMER_SECONDS);
    // TODO: Add API call to resend OTP
    // Instead of dispatch here, add your code to resend OTP
  };

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const otpInputSize = Math.min(getResponsiveSize(60), width * 0.18);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <View style={styles.fixedContainer}>
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <View style={styles.container}>
            <WaveBackground>
              <View style={styles.contentWrapper}>
                <View style={styles.imageContent}>
                  <Image
                    source={require("../../../assets/capa2.png")}
                    style={styles.image}
                    resizeMode="contain"
                  />
                </View>

                <View style={styles.contentContainer}>
                  <View style={styles.verificationContainer}>
                    <Text style={styles.verificationTitle}>{t("verification")}</Text>
                    <Text style={styles.verificationSubtitle}>
                    {t("verificationCodeSent")} {phone}
                    </Text>

                    <View style={styles.otpContainer}>
                      {otp.map((digit, index) => (
                        <TextInput
                          key={index}
                          ref={(el) => (inputRefs.current[index] = el)}
                          style={[
                            styles.otpInput,
                            { width: otpInputSize, height: otpInputSize },
                          ]}
                          keyboardType="number-pad"
                          maxLength={1}
                          value={digit}
                          onChangeText={(value) =>
                            handleChangeText(value, index)
                          }
                          onKeyPress={(e) => handleKeyPress(e, index)}
                          selectionColor="#1E3A8A"
                          autoCorrect={false}
                          scrollEnabled={false}
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
                        <TouchableOpacity
                          onPress={handleResend}
                          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                          <Text style={styles.resendButton}>{t("resendCode")}</Text>
                        </TouchableOpacity>
                      )}
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.verifyButton,
                        otp.join("").length !== OTP_LENGTH &&
                          styles.disabledButton,
                      ]}
                      onPress={handleVerify}
                      disabled={otp.join("").length !== OTP_LENGTH}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.verifyButtonText}>{t("verify")}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              {verifyLoading && <Loader />}
            </WaveBackground>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#223972",
  },
  fixedContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
  },
  container: {
    flex: 1,
    position: "relative",
  },
  contentWrapper: {
    flex: 1,
    paddingTop:
      Platform.OS === "android"
        ? StatusBar.currentHeight + getResponsiveSize(10)
        : getResponsiveSize(10),
  },
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  imageContent: {
    height: height * 0.35,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: getResponsiveSize(20),
  },
  image: {
    width: Math.min(width * 0.8, 300),
    height: Math.min(width * 0.8, 300),
    maxWidth: 300,
    maxHeight: 300,
  },
  verificationContainer: {
    width: "100%",
    paddingHorizontal: getResponsiveSize(24),
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: getResponsiveSize(20),
  },
  verificationTitle: {
    fontSize: getResponsiveSize(24),
    fontWeight: "600",
    color: "white",
    marginBottom: getResponsiveSize(8),
    textAlign: "center",
  },
  verificationSubtitle: {
    fontSize: getResponsiveSize(14),
    color: "white",
    textAlign: "center",
    marginBottom: getResponsiveSize(32),
    width: "90%",
    // maxWidth: 300,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    maxWidth: 300,
    marginBottom: getResponsiveSize(24),
  },
  otpInput: {
    backgroundColor: "#10294D",
    borderRadius: getResponsiveSize(8),
    color: "white",
    fontSize: getResponsiveSize(24),
    fontWeight: "bold",
    textAlign: "center",
  },
  timerContainer: {
    alignItems: "center",
    marginBottom: getResponsiveSize(32),
    width: "100%",
  },
  resendText: {
    color: "white",
    fontSize: getResponsiveSize(14),
    marginBottom: getResponsiveSize(8),
    textAlign: "center",
  },
  resendButton: {
    color: "#4F8EF7",
    fontSize: getResponsiveSize(16),
    fontWeight: "bold",
    padding: getResponsiveSize(5),
  },
  verifyButton: {
    width: "100%",
    backgroundColor: "#10294D",
    paddingVertical: getResponsiveSize(16),
    borderRadius: getResponsiveSize(8),
    alignItems: "center",
    marginBottom: getResponsiveSize(16),
    height: getResponsiveSize(56),
    justifyContent: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
  verifyButtonText: {
    color: "white",
    fontSize: getResponsiveSize(16),
    fontWeight: "bold",
  },
});

export default React.memo(OTPVerificationScreen);
