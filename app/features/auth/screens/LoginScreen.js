import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
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
import FlashMessage from "../../../components/shared/FlashMessage";
import { useTranslation } from "react-i18next";

const { width, height } = Dimensions.get("window");

const getResponsiveSize = (size) => {
  const standardWidth = 375;
  return (width / standardWidth) * size;
};

const LoginScreen = () => {
  const { isLoading, status } = useSelector((state) => state.auth);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [mobileNumber, setMobileNumber] = useState("");
  const navigation = useNavigation();

  const handleContinue = useCallback(() => {
    if (!validatePhoneNumber(mobileNumber)) {
      FlashMessage.error("Mobile number must be 11 digits and start with 0.");
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

  useEffect(() => {
    if (Platform.OS === 'ios') {
      TextInput.defaultProps = TextInput.defaultProps || {};
      TextInput.defaultProps.scrollEnabled = false;
    }
  }, []);

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
                    source={require("../../../assets/capa.png")}
                    style={styles.image}
                    resizeMode="contain"
                  />
                </View>

                <View style={styles.contentContainer}>
                  <View style={styles.inputSection}>
                    <Text style={styles.signInText}> {t("signIn")}</Text>

                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.input}
                        placeholder={t("enterMobileNumber")}
                        placeholderTextColor="#8DA1B5"
                        keyboardType="phone-pad"
                        maxLength={11}
                        value={mobileNumber}
                        onChangeText={setMobileNumber}
                        scrollEnabled={false}
                      />
                    </View>

                    <TouchableOpacity
                      style={styles.continueButton}
                      onPress={handleContinue}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.continueButtonText}>{t("continue")}</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.bottomSection}>
                    <View style={styles.dividerContainer}>
                      <View style={styles.divider} />
                      <Text style={styles.dividerText}>{t("or")}</Text>
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
                      <Text style={styles.noAccountText}>
                      {t("dontHaveAccount")}
                      </Text>
                      <TouchableOpacity
                        onPress={handleSignUp}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.signUpText}>Sign up</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
              {isLoading && <Loader />}
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  container: {
    flex: 1,
    position: 'relative',
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
    height: height * 0.3,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: width * 0.6,
    height: width * 0.6,
  },
  inputSection: {
    paddingTop: height * 0.02,
    paddingHorizontal: getResponsiveSize(30),
    width: "100%",
    alignSelf: "center",
  },
  bottomSection: {
    paddingHorizontal: getResponsiveSize(30),
    paddingBottom: height * 0.1,
    width: "100%",
    backgroundColor: "transparent",
  },
  signInText: {
    fontSize: getResponsiveSize(24),
    color: "white",
    fontWeight: "500",
    marginBottom: getResponsiveSize(20),
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: getResponsiveSize(15),
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: getResponsiveSize(8),
    padding: getResponsiveSize(15),
    fontSize: getResponsiveSize(16),
    width: "100%",
    color: "#223972",
    height: getResponsiveSize(50),
  },
  continueButton: {
    backgroundColor: "#223972",
    borderRadius: getResponsiveSize(8),
    padding: getResponsiveSize(15),
    width: "100%",
    alignItems: "center",
    marginBottom: getResponsiveSize(20),
    height: getResponsiveSize(50),
    justifyContent: "center",
  },
  continueButtonText: {
    color: "white",
    fontSize: getResponsiveSize(16),
    fontWeight: "bold",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: getResponsiveSize(15),
  },
  divider: {
    flex: 1,
    height: getResponsiveSize(2),
    backgroundColor: "#223972",
  },
  dividerText: {
    color: "#223972",
    paddingHorizontal: getResponsiveSize(10),
    fontWeight: "400",
    fontSize: getResponsiveSize(14),
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginVertical: getResponsiveSize(5),
  },
  socialButton: {
    width: getResponsiveSize(40),
    height: getResponsiveSize(40),
    marginHorizontal: getResponsiveSize(5),
    justifyContent: "center",
    alignItems: "center",
  },
  socialIcon: {
    width: getResponsiveSize(40),
    height: getResponsiveSize(40),
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: getResponsiveSize(15),
    alignItems: "center",
  },
  noAccountText: {
    color: "white",
    marginRight: getResponsiveSize(5),
    fontSize: getResponsiveSize(14),
    fontWeight: "400",
  },
  signUpText: {
    color: "#223972",
    fontSize: getResponsiveSize(16),
    fontWeight: "700",
  },
});

export default React.memo(LoginScreen);