import React, { useEffect, useState, useCallback } from "react";
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
  Keyboard,
  TouchableWithoutFeedback,
  StatusBar,
  SafeAreaView,
} from "react-native";
import WaveBackground from "../../../components/common/WaveBackground";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { sendOtp } from "../../../redux/features/auth/patientAuthSlice";
import Loader from "../../../components/common/Loader";

const LoginScreen = () => {
  const { isLoading, status } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [mobileNumber, setMobileNumber] = useState("");
  const navigation = useNavigation();
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleContinue = useCallback(() => {
    if (!validatePhoneNumber(mobileNumber)) {
      Alert.alert(
        "Invalid Number",
        "Mobile number must be 11 digits and start with 0."
      );
      return;
    }
    Keyboard.dismiss();
    dispatch(sendOtp({ phone: mobileNumber }));
  }, [mobileNumber, dispatch]);

  const handleSocialLogin = useCallback((platform) => {
    console.log(`${platform} login pressed`);
  }, []);

  const handleSignUp = useCallback(() => {
    Keyboard.dismiss();
    navigation.navigate("SignUpScreen");
  }, [navigation]);

  useEffect(() => {
    if (status === "otp_sent") {
      navigation.navigate("OTP", { phone: mobileNumber });
    }
  }, [status, navigation, mobileNumber]);

  const validatePhoneNumber = (number) => {
    const phoneRegex = /^0\d{10}$/;
    return phoneRegex.test(number);
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.mainContainer}>
          <WaveBackground>
            <View style={styles.container}>
              <View style={[
                styles.imageContent
              ]}>
                  <Image
                    source={require("../../../assets/capa.png")}
                    style={styles.image}
                    resizeMode="contain"
                  />

              </View>

              <View style={styles.inputSection}>
                <Text style={styles.signInText}>Sign In</Text>

                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Mobile Number"
                    placeholderTextColor="#8DA1B5"
                    keyboardType="phone-pad"
                    maxLength={11}
                    value={mobileNumber}
                    onChangeText={setMobileNumber}
                  />
                </View>

                <TouchableOpacity
                  style={styles.continueButton}
                  onPress={handleContinue}
                  activeOpacity={0.8}
                >
                  <Text style={styles.continueButtonText}>Continue</Text>
                </TouchableOpacity>
              </View>

              {!keyboardVisible && (
                <View style={styles.bottomSection}>
                  <View style={styles.dividerContainer}>
                    <View style={styles.divider} />
                    <Text style={styles.dividerText}>OR</Text>
                    <View style={styles.divider} />
                  </View>

                  <View style={styles.socialContainer}>
                    <TouchableOpacity
                      style={styles.socialButton}
                      onPress={() => handleSocialLogin("Facebook")}
                      activeOpacity={0.7}
                    >
                      <Image
                        source={require("../../../assets/facebook.png")}
                        style={styles.socialIcon}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.socialButton}
                      onPress={() => handleSocialLogin("WhatsApp")}
                      activeOpacity={0.7}
                    >
                      <Image
                        source={require("../../../assets/whatsapp.png")}
                        style={styles.socialIcon}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.socialButton}
                      onPress={() => handleSocialLogin("Google")}
                      activeOpacity={0.7}
                    >
                      <Image
                        source={require("../../../assets/google.png")}
                        style={styles.socialIcon}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.signUpContainer}>
                    <Text style={styles.noAccountText}>Don't have an account?</Text>
                    <TouchableOpacity onPress={handleSignUp} activeOpacity={0.7}>
                      <Text style={styles.signUpText}>Sign up</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
            {isLoading && <Loader />}
          </WaveBackground>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#223972",
  },
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  imageContent: {
    height: height * 0.4,
    alignItems: "center",
    justifyContent: "center",
  },
  imageContentSmall: {
    height: height * 0.1,
  },
  image: {
    width: width * 0.7,
    height: width * 0.7,
  },
  inputSection: {
    paddingHorizontal: 30,
    position: "absolute",
    top: height * 0.45,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  bottomSection: {
    paddingHorizontal: 30,
    paddingBottom: height * 0.15,
  },
  signInText: {
    fontSize: 24,
    color: "white",
    fontWeight: "500",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    width: "100%",
    color: "#223972",
  },
  continueButton: {
    backgroundColor: "#223972",
    borderRadius: 8,
    padding: 15,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  continueButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  divider: {
    flex: 1,
    height: 2,
    backgroundColor: "#223972",
  },
  dividerText: {
    color: "#223972",
    paddingHorizontal: 10,
    fontWeight: "400",
    fontSize: 14,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginVertical: 5,
  },
  socialButton: {
    width: 40,
    height: 40,
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  socialIcon: {
    width: 40,
    height: 40,
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  noAccountText: {
    color: "white",
    marginRight: 5,
    fontSize: 16,
    fontWeight: "400",
  },
  signUpText: {
    color: "#223972",
    fontSize: 18,
    fontWeight: "700",
  },
});

export default React.memo(LoginScreen);