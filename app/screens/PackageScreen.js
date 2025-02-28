import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Platform,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ChevronLeft } from "lucide-react-native";

const PackageScreen = () => {
  const navigation = useNavigation();

  const packages = [
    {
      id: 1,
      name: "Free Plan",
      price: "20 Tk",
      description: "For personal use",
      color: "#1CD7AF",
      isSubscribed: false,
    },
    {
      id: 2,
      name: "Basic Plan",
      price: "35 Tk",
      description: "For personal use",
      color: "#1976D2",
      isSubscribed: true,
    },
    {
      id: 3,
      name: "Pro Plan",
      price: "60 Tk",
      description: "For personal use",
      color: "#9C6BF5",
      isSubscribed: false,
    },
  ];

  const handleGoBack = () => navigation.goBack();

  const handleSubscriptionToggle = (packageId) => {
    console.log(`Toggle subscription for package: ${packageId}`);
  };

  const statusBarHeight =
    StatusBar.currentHeight || (Platform.OS === "ios" ? 44 : 0);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />

      <SafeAreaView
        style={[styles.headerContainer, { paddingTop: statusBarHeight }]}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <ChevronLeft size={24} color="#0E4946" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Package</Text>
          <View style={styles.rightPlaceholder} />
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {packages.map((pkg) => (
          <View
            key={pkg.id}
            style={[styles.packageCard, { backgroundColor: pkg.color }]}
          >
            <View style={styles.packageInfo}>
              <Text style={styles.packageName}>{pkg.name}</Text>
              <Text style={styles.packageDescription}>{pkg.description}</Text>

              {pkg.isSubscribed && (
                <TouchableOpacity
                  style={styles.unsubscribeButton}
                  onPress={() => handleSubscriptionToggle(pkg.id)}
                >
                  <Text style={styles.unsubscribeButtonText}>Unsubscribe</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.priceContainer}>
              <Text style={styles.packagePrice}>{pkg.price}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  headerContainer: {
    backgroundColor: "#F5F7FA",
    paddingBottom: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0E4946",
    flex: 1,
    textAlign: "center",
  },
  rightPlaceholder: { width: 40 },
  scrollView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 24,
  },
  packageCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 8,
    marginVertical: 8,
    padding: 16,
  },
  packageInfo: { flex: 1 },
  packageName: {
    fontSize: 24,
    fontWeight: "500",
    color: "white",
    marginBottom: 4,
  },
  packageDescription: {
    fontSize: 14,
    fontWeight: "400",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  unsubscribeButton: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  unsubscribeButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#1976D2",
  },
  priceContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  packagePrice: {
    fontSize: 48,
    fontWeight: "700",
    fontWeight: "bold",
    color: "white",
  },
});

export default PackageScreen;
