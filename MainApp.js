import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ProfileScreen } from "./app/screens/ProfileScreen";
import { enableScreens } from "react-native-screens";
import { Header } from "./app/components/shared/Header";
enableScreens();

// Uncomment if you want to ignore logs
// LogBox.ignoreAllLogs();

const Stack = createNativeStackNavigator();

const MainApp = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar 
          translucent 
          backgroundColor="transparent" 
          barStyle="light-content" 
        />
        <Stack.Navigator 
        screenOptions={({ route }) => ({ 
          animation: "slide_from_right",
          header: (props) => <Header {...props} title={route.name} />,
        })}
        >
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default MainApp;