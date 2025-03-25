import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Camera, ChevronLeft } from "lucide-react-native";
import { Card } from "../components/common/Card";
import { Input } from "../components/common/Input";
import { Button } from "../components/common/Button";
import { Dropdown } from "../components/common/Dropdown";
import { DatePicker } from "../components/common/DatePicker";
import { WaveBackground } from "./../components/common/WaveBackground";
import * as ImagePicker from "expo-image-picker";
import { useSelector, useDispatch } from "react-redux";
import { 
  fetchPatientProfile, 
  updatePatientProfile, 
  clearPatientProfileError 
} from "../redux/features/patient/patientSlice";
import { isEqual } from 'lodash';
import FlashMessage from './../components/shared/FlashMessage';
import { ProfileSkeleton } from "../components/skeleton/ProfileSkeleton";

export const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { isLoading, updateLoading, profile, status, error } = useSelector((state) => state.patient);
  
  const [screenDimensions, setScreenDimensions] = useState(
    Dimensions.get("window")
  );
  const [profileImage, setProfileImage] = useState(
    require("../assets/avatar.png")
  );
  const [isImageChanged, setIsImageChanged] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    bloodGroup: "",
    gender: "",
    dateOfBirth: "",
    phone: "",
    height: null,
    weight: null
  });
  const [initialProfile, setInitialProfile] = useState({});

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showBloodGroupDropdown, setShowBloodGroupDropdown] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const genders = ["Male", "Female", "Other"];
  
  useEffect(() => {
    if (profile) {
      const formattedProfile = {
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        bloodGroup: profile.bloodGroup || "A+",
        gender: profile.gender || "Male",
        dateOfBirth: profile.dateOfBirth ||"1999/09/21",
        phone: profile.phone || "",
        height: profile.height !== null && profile.height !== undefined ? profile.height.toString() : "",
        weight: profile.weight !== null && profile.weight !== undefined ? profile.weight.toString() : "",
      };
      
      setProfileData(formattedProfile);
      setInitialProfile(formattedProfile);
      
      if (profile.profileImage) {
        setProfileImage({ uri: profile.profileImage });
      }
    }
  }, [profile]);

  useEffect(() => {
    if (status === "updated") {
      FlashMessage.success("Profile updated successfully");
      dispatch(clearPatientProfileError());
    } else if (status === "update_failed" && error) {
      FlashMessage.error(error);
      dispatch(clearPatientProfileError());
    }
  }, [status, error, dispatch]);

  useEffect(() => {
    dispatch(fetchPatientProfile(token));
  }, [dispatch, token]);

  useEffect(() => {
    const dimensionsHandler = ({ window }) => {
      setScreenDimensions(window);
    };

    const subscription = Dimensions.addEventListener(
      "change",
      dimensionsHandler
    );

    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          FlashMessage.error(
            "We need camera roll permissions to upload images!"
          );
        }
      }
    })();

    return () => {
      subscription?.remove();
    };
  }, []);

  const isFormDirty = () => {
    return !isEqual(profileData, initialProfile) || isImageChanged;
  };

  const handleUpdate = async () => {
    if (!isFormDirty()) return;
    try {
      const formData = new FormData();
      
      const dataToSend = {...profileData};
      if (dataToSend.height) {
        dataToSend.height = parseFloat(dataToSend.height);
      }
      
      if (dataToSend.weight) {
        dataToSend.weight = parseFloat(dataToSend.weight);
      }
      
      Object.keys(dataToSend).forEach(key => {
        if (dataToSend[key] !== null && dataToSend[key] !== undefined && 
            key !== 'phone') {
          formData.append(key, dataToSend[key]);
        }
      });
      
      if (isImageChanged && profileImage.uri) {
        const imageUri = profileImage.uri;
        const filename = imageUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image';
        
        formData.append('file', {
          uri: imageUri,
          name: filename,
          type,
        });
      }
   
      await dispatch(updatePatientProfile({
        profileData: formData,
        token
      })).unwrap();
      
      setInitialProfile({...profileData});
      setIsImageChanged(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleDateSelect = (date) => {
    setProfileData({ ...profileData, dateOfBirth: date });
    setShowDatePicker(false);
  };

  const handleSelectBloodGroup = (value) => {
    setProfileData({ ...profileData, bloodGroup: value });
    setShowBloodGroupDropdown(false);
  };

  const handleSelectGender = (value) => {
    setProfileData({ ...profileData, gender: value });
    setShowGenderDropdown(false);
  };

  const validateNumericInput = (text, fieldName) => {
    const numericRegex = /^(\d*\.?\d*)$/;
    if (text === '' || numericRegex.test(text)) {
      setProfileData({ ...profileData, [fieldName]: text });
    }
  };

  const handleImageUpload = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfileImage({ uri: result.assets[0].uri });
        setIsImageChanged(true);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      FlashMessage.error("Failed to select image. Please try again.");
    }
  };

  const handleBackPress = () => {
    if (navigation && navigation.goBack) {
      navigation.goBack();
    }
  };

  const isPortrait = screenDimensions.height > screenDimensions.width;
  const cardWidth = isPortrait
    ? Math.min(screenDimensions.width * 0.9, 450)
    : Math.min(screenDimensions.width * 0.6, 500);

  const baseUnit =
    Math.min(screenDimensions.width, screenDimensions.height) * 0.04;
  const avatarSize = baseUnit * 5;
  const iconSize = Math.max(Math.round(avatarSize * 0.3), 18);

  const statusBarHeight =
    Platform.OS === "ios"
      ? StatusBar.currentHeight || 34
      : StatusBar.currentHeight || 0;
  const headerHeight = statusBarHeight + 20;

  const dynamicStyles = StyleSheet.create({
    scrollContent: {
      flexGrow: 1,
      paddingVertical: baseUnit * 0.7,
      paddingHorizontal: baseUnit * 0.4,
      top: screenDimensions.height * 0.05,
      minHeight: screenDimensions.height - headerHeight,
    },
    card: {
      width: cardWidth,
      maxWidth: "100%",
      paddingHorizontal: baseUnit * 0.5,
    },
    avatar: {
      width: avatarSize,
      height: avatarSize,
      borderRadius: avatarSize / 2,
      borderWidth: 2,
      borderColor: "white",
    },
    cameraIconContainer: {
      position: "absolute",
      bottom: 0,
      right: 0,
      backgroundColor: "#20ACE2",
      borderRadius: iconSize / 2,
      width: iconSize,
      height: iconSize,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: "white",
    },
    cardContent: {
      padding: baseUnit * 0.5,
    },
    spacer: {
      height: avatarSize / 2,
    },
    updateButton: {
      paddingVertical: baseUnit * 0.5,
      marginTop: baseUnit * 0.7,
      opacity: isFormDirty() ? 1 : 0.5,
    },
    header: {
      height: headerHeight,
      paddingTop: statusBarHeight,
      backgroundColor: "#23C2FF",
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: baseUnit * 0.5,
    },
    headerTitle: {
      color: "white",
      fontSize: 18,
      fontWeight: "bold",
      flex: 1,
      textAlign: "center",
      marginRight: 40,
    },
    backButton: {
      padding: 8,
    },
    readOnlyInput: {
      backgroundColor: "#f0f0f0",
      color: "#666",
    },
    inputWrapper: {
      height: 60,
    },
    phoneWrapper: {
      height: 60,
      marginTop: 20,
      marginBottom: 10,
    }
  });

  return (
    <>
      {isLoading ? (
        <ProfileSkeleton />
      ) : (
        <SafeAreaView style={styles.container} edges={["left", "right"]}>

          <View style={dynamicStyles.header}>
            <TouchableOpacity
              style={dynamicStyles.backButton}
              onPress={handleBackPress}
            >
              <ChevronLeft color="white" size={24} />
            </TouchableOpacity>
            <Text style={dynamicStyles.headerTitle}>Profile</Text>
          </View>

          <WaveBackground>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.keyboardView}
            >
              <ScrollView
                contentContainerStyle={dynamicStyles.scrollContent}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.cardWrapper}>
                  <View style={styles.avatarOuterContainer}>
                    <View style={styles.avatarContainer}>
                      <Image
                        source={profileImage}
                        style={dynamicStyles.avatar}
                        resizeMode="cover"
                      />
                      <TouchableOpacity
                        style={dynamicStyles.cameraIconContainer}
                        onPress={handleImageUpload}
                      >
                        <Camera size={iconSize * 0.7} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <Card style={dynamicStyles.card}>
                    <View style={dynamicStyles.cardContent}>
                      <View style={dynamicStyles.spacer} />

                      <View style={styles.row}>
                        <Input
                          label="First Name"
                          value={profileData.firstName}
                          onChangeText={(text) =>
                            setProfileData({ ...profileData, firstName: text })
                          }
                          containerStyle={[styles.halfInput, dynamicStyles.inputWrapper]}
                        />
                        <Input
                          label="Last Name"
                          value={profileData.lastName}
                          onChangeText={(text) =>
                            setProfileData({ ...profileData, lastName: text })
                          }
                          containerStyle={[styles.halfInput, dynamicStyles.inputWrapper]}
                        />
                      </View>

                      <View style={styles.row}>
                        <Dropdown
                          label="Blood group"
                          value={profileData.bloodGroup}
                          options={bloodGroups}
                          onSelect={handleSelectBloodGroup}
                          isOpen={showBloodGroupDropdown}
                          onToggle={() =>
                            setShowBloodGroupDropdown(!showBloodGroupDropdown)
                          }
                          containerStyle={[styles.halfInput, dynamicStyles.inputWrapper]}
                        />
                        <Dropdown
                          label="Gender"
                          value={profileData.gender}
                          options={genders}
                          onSelect={handleSelectGender}
                          isOpen={showGenderDropdown}
                          onToggle={() =>
                            setShowGenderDropdown(!showGenderDropdown)
                          }
                          containerStyle={[styles.halfInput, dynamicStyles.inputWrapper]}
                        />
                      </View>

                      <View style={dynamicStyles.inputWrapper}>
                        <DatePicker
                          label="Date of birth"
                          value={profileData.dateOfBirth}
                          onPress={() => setShowDatePicker(true)}
                          isVisible={showDatePicker}
                          onDateSelect={handleDateSelect}
                          onCancel={() => setShowDatePicker(false)}
                        />
                      </View>

                      <View style={dynamicStyles.phoneWrapper}>
                        <Input
                          label="Phone Number"
                          value={profileData.phone}
                          editable={false}
                          keyboardType="phone-pad"
                          style={dynamicStyles.readOnlyInput}
                        />
                      </View>

                      <View style={styles.row}>
                        <Input
                          label="Height (cm)"
                          value={profileData.height}
                          onChangeText={(text) => validateNumericInput(text, 'height')}
                          keyboardType="decimal-pad"
                          containerStyle={[styles.halfInput, dynamicStyles.inputWrapper]}
                          placeholder="0.00"
                        />
                        <Input
                          label="Weight (kg)"
                          value={profileData.weight}
                          onChangeText={(text) => validateNumericInput(text, 'weight')}
                          keyboardType="decimal-pad"
                          containerStyle={[styles.halfInput, dynamicStyles.inputWrapper]}
                          placeholder="0.00"
                        />
                      </View>

                      <Button
                        title={updateLoading ? "Updating..." : "Update"}
                        onPress={handleUpdate}
                        disabled={!isFormDirty() || updateLoading}
                        style={{
                          ...styles.updateButton,
                          ...dynamicStyles.updateButton,
                        }}
                      />
                    </View>
                  </Card>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </WaveBackground>
        </SafeAreaView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#23C2FF",
  },
  keyboardView: {
    flex: 1,
  },
  cardWrapper: {
    position: "relative",
    paddingTop: 40,
    alignItems: "center",
  },
  card: {
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarOuterContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  updateButton: {
    backgroundColor: "#223972",
    borderRadius: 8,
  },
});