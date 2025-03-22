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
  Alert,
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
import Loader from "../components/common/Loader";

export const ProfileScreen = ({ navigation }) => {
  const [screenDimensions, setScreenDimensions] = useState(
    Dimensions.get("window")
  );
  const [profileImage, setProfileImage] = useState(
    require("../assets/avatar.png")
  );
  const [isImageChanged, setIsImageChanged] = useState(false);
  const [profile, setProfile] = useState({
    name: "Amar name ki",
    bloodGroup: "O+",
    gender: "Male",
    dateOfBirth: "1999/09/21",
    mobileNumber: "0123 456 789",
    height: "1.65",
    weight: "48",
  });
  const [initialProfile, setInitialProfile] = useState({ ...profile });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showBloodGroupDropdown, setShowBloodGroupDropdown] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const genders = ["Male", "Female", "Other"];

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
          Alert.alert(
            "Permission required",
            "Sorry, we need camera roll permissions to upload images!"
          );
        }
      }
    })();

    return () => {
      subscription?.remove();
    };
  }, []);

  const handleUpdate = () => {
    const changedFields = {};

    Object.keys(profile).forEach((key) => {
      if (profile[key] !== initialProfile[key]) {
        changedFields[key] = {
          from: initialProfile[key],
          to: profile[key],
        };
      }
    });

    if (isImageChanged) {
      changedFields.profileImage = {
        changed: true,
        details:
          typeof profileImage === "string"
            ? "Image selected from device"
            : "Default avatar",
      };
    }

    console.log("Profile updated with changes:", changedFields);
    setInitialProfile({ ...profile });
    Alert.alert("Success", "Profile updated successfully");
  };

  const handleDateSelect = (date) => {
    const formattedDate = date.toISOString().split("T")[0].replace(/-/g, "/");
    setProfile({ ...profile, dateOfBirth: formattedDate });
    setShowDatePicker(false);
  };

  const handleSelectBloodGroup = (value) => {
    setProfile({ ...profile, bloodGroup: value });
    setShowBloodGroupDropdown(false);
  };

  const handleSelectGender = (value) => {
    setProfile({ ...profile, gender: value });
    setShowGenderDropdown(false);
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
        console.log("Image selected:", result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to select image. Please try again.");
    }
  };

  const handleBackPress = () => {
    if (navigation && navigation.goBack) {
      navigation.goBack();
    } else {
      console.log("Back button pressed");
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
      // alignItems: 'center',
      // justifyContent: 'center',
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
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <SafeAreaView style={styles.container} edges={["left", "right"]}>
          <StatusBar barStyle="light-content" backgroundColor="#23C2FF" />

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

                      <Input
                        label="First name & Last name"
                        value={profile.name}
                        onChangeText={(text) =>
                          setProfile({ ...profile, name: text })
                        }
                      />

                      <View style={styles.row}>
                        <Dropdown
                          label="Blood group"
                          value={profile.bloodGroup}
                          options={bloodGroups}
                          onSelect={handleSelectBloodGroup}
                          isOpen={showBloodGroupDropdown}
                          onToggle={() =>
                            setShowBloodGroupDropdown(!showBloodGroupDropdown)
                          }
                          containerStyle={styles.halfInput}
                        />
                        <Dropdown
                          label="Gender"
                          value={profile.gender}
                          options={genders}
                          onSelect={handleSelectGender}
                          isOpen={showGenderDropdown}
                          onToggle={() =>
                            setShowGenderDropdown(!showGenderDropdown)
                          }
                          containerStyle={styles.halfInput}
                        />
                      </View>

                      <DatePicker
                        label="Date of birth"
                        value={profile.dateOfBirth}
                        onPress={() => setShowDatePicker(true)}
                        isVisible={showDatePicker}
                        onDateSelect={handleDateSelect}
                        onCancel={() => setShowDatePicker(false)}
                      />

                      <Input
                        label="Mobile Number"
                        value={profile.mobileNumber}
                        onChangeText={(text) =>
                          setProfile({ ...profile, mobileNumber: text })
                        }
                        keyboardType="phone-pad"
                      />

                      <View style={styles.row}>
                        <Input
                          label="Height (m)"
                          value={profile.height}
                          onChangeText={(text) =>
                            setProfile({ ...profile, height: text })
                          }
                          keyboardType="decimal-pad"
                          containerStyle={styles.halfInput}
                        />
                        <Input
                          label="Weight (kg)"
                          value={profile.weight}
                          onChangeText={(text) =>
                            setProfile({ ...profile, weight: text })
                          }
                          keyboardType="decimal-pad"
                          containerStyle={styles.halfInput}
                        />
                      </View>

                      <Button
                        title="Update"
                        onPress={handleUpdate}
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
