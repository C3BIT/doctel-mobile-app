import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { enableScreens } from "react-native-screens";

// Screens
import LoginScreen from "./app/features/auth/screens/LoginScreen";
import OTPVerificationScreen from "./app/features/auth/screens/OTPVerificationScreen";
import PackageScreen from "./app/screens/PackageScreen";
import { ProfileScreen } from "./app/screens/ProfileScreen";
import TabNavigator from "./app/components/shared/TabNavigator";

enableScreens();

const Stack = createNativeStackNavigator();

// Unauthenticated Stack
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="OTP" component={OTPVerificationScreen} />
  </Stack.Navigator>
);

// Authenticated Stack
const AppStack = () => (
  <Stack.Navigator
    screenOptions={{ animation: "slide_from_right", headerShown: false }}
  >
    <Stack.Screen
      name="TabNavigator"
      component={TabNavigator}
      options={{ headerShown: false }}
    />
    {/* <Stack.Screen name="Package" component={PackageScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} /> */}
  </Stack.Navigator>
);

const MainApp = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar translucent backgroundColor="transparent" />
        {isAuthenticated ? <AppStack /> : <AuthStack />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default MainApp;
