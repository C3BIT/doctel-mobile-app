import React from "react";
import { LogBox, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { enableScreens } from "react-native-screens";
// Screens
import LoginScreen from "./app/features/auth/screens/LoginScreen";
import OTPVerificationScreen from "./app/features/auth/screens/OTPVerificationScreen";
import ChatScreen from "./app/screens/ChatScreen";
import TabNavigator from "./app/components/shared/TabNavigator";
import { WebSocketProvider } from "./app/providers/WebSocketProvider";
import JitsiMeetingScreen from "./app/components/Calling/JitsiMeetingScreen";
import PrescriptionScreen from "./app/screens/PrescriptionScreen";
enableScreens();
const Stack = createNativeStackNavigator();
LogBox.ignoreAllLogs();
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="OTP" component={OTPVerificationScreen} />
  </Stack.Navigator>
);

const AppStack = () => (
  <Stack.Navigator
    screenOptions={{ animation: "slide_from_bottom", headerShown: false }}
  >
    <Stack.Screen
      name="TabNavigator"
      component={TabNavigator}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="JitsiMeeting"
      component={JitsiMeetingScreen}
      options={{
        headerShown: false,
        gestureEnabled: false,
      }}
    />
    <Stack.Screen name="Chat" component={ChatScreen} />
    <Stack.Screen name="Prescription" component={PrescriptionScreen} />
  </Stack.Navigator>
);

const MainApp = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <SafeAreaProvider>
      <WebSocketProvider>
        <NavigationContainer>
          <StatusBar translucent backgroundColor="transparent" />
          {isAuthenticated ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
      </WebSocketProvider>
    </SafeAreaProvider>
  );
};

export default MainApp;
