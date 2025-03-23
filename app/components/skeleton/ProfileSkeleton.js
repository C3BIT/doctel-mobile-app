import React from "react";
import { View, StyleSheet, Dimensions, Platform, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { useSharedValue, withRepeat, withTiming, useAnimatedStyle } from "react-native-reanimated";
import WaveBackground from "../common/WaveBackground";

export const ProfileSkeleton = () => {
  const opacity = useSharedValue(0.3);
  const screenDimensions = Dimensions.get("window");
  
  React.useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.7, { duration: 1000 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const isPortrait = screenDimensions.height > screenDimensions.width;
  const cardWidth = isPortrait
    ? Math.min(screenDimensions.width * 0.9, 450)
    : Math.min(screenDimensions.width * 0.6, 500);

  const baseUnit = Math.min(screenDimensions.width, screenDimensions.height) * 0.04;
  const avatarSize = baseUnit * 5;
  
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
      backgroundColor: "white",
      borderRadius: 16,
    },
    avatar: {
      width: avatarSize,
      height: avatarSize,
      borderRadius: avatarSize / 2,
      backgroundColor: "#E0E0E0",
    },
    header: {
      height: headerHeight,
      paddingTop: statusBarHeight,
      backgroundColor: "#23C2FF",
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: baseUnit * 0.5,
    },
    backButton: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: "rgba(255, 255, 255, 0.5)",
    },
    headerTitle: {
      width: 80,
      height: 20,
      backgroundColor: "rgba(255, 255, 255, 0.5)",
      marginLeft: 20,
    },
    spacer: {
      height: avatarSize / 2,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <WaveBackground>
        <View style={dynamicStyles.scrollContent}>
          <View style={styles.cardWrapper}>
            <View style={styles.avatarOuterContainer}>
              <View style={styles.avatarContainer}>
                <Animated.View style={[dynamicStyles.avatar, animatedStyle]} />
              </View>
            </View>

            <View style={[dynamicStyles.card, styles.card]}>
              <View style={styles.cardContent}>
                <View style={dynamicStyles.spacer} />

                <View style={styles.row}>
                  <Animated.View style={[styles.skeletonInput, animatedStyle]} />
                  <Animated.View style={[styles.skeletonInput, animatedStyle]} />
                </View>

                <View style={styles.row}>
                  <Animated.View style={[styles.skeletonInput, animatedStyle]} />
                  <Animated.View style={[styles.skeletonInput, animatedStyle]} />
                </View>

                <View style={styles.fullRow}>
                  <Animated.View style={[styles.skeletonFullInput, animatedStyle]} />
                </View>

                <View style={styles.fullRow}>
                  <Animated.View style={[styles.skeletonFullInput, animatedStyle]} />
                </View>

                <View style={styles.row}>
                  <Animated.View style={[styles.skeletonInput, animatedStyle]} />
                  <Animated.View style={[styles.skeletonInput, animatedStyle]} />
                </View>

                <View style={styles.buttonRow}>
                  <Animated.View style={[styles.skeletonButton, animatedStyle]} />
                </View>
              </View>
            </View>
          </View>
        </View>
      </WaveBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#23C2FF",
  },
  cardWrapper: {
    position: "relative",
    paddingTop: 40,
    alignItems: "center",
  },
  card: {
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
  cardContent: {
    padding: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 12,
  },
  fullRow: {
    marginBottom: 20,
  },
  buttonRow: {
    marginTop: 10,
  },
  skeletonInput: {
    flex: 1,
    height: 60,
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
  },
  skeletonFullInput: {
    height: 60,
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
  },
  skeletonButton: {
    height: 50,
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
    marginTop: 10,
  },
});