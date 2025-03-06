import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, View, Dimensions, Text, Platform, TouchableOpacity } from "react-native";
import { Home, Package, User } from "lucide-react-native";
import PackageScreen from "../../screens/PackageScreen";
import { ProfileScreen } from "./../../screens/ProfileScreen";
import HomeScreen from "./../../screens/HomeScreen";

const Tab = createBottomTabNavigator();
const { height, width } = Dimensions.get("window");

const dynamicHeight = (percentage) => (height * percentage) / 100;
const dynamicWidth = (percentage) => (width * percentage) / 100;

const CustomTabBarButton = ({ children, onPress }) => (
  <View style={styles.customTabContainer}>
    <View style={styles.customTabBackground}>
      <TouchableOpacity style={styles.customTabIconWrapper} onPress={onPress}>
        {children}
      </TouchableOpacity>
    </View>
  </View>
);

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let Icon;
          switch (route.name) {
            case "Packages":
              Icon = Package;
              break;
            case "Home":
              Icon = Home;
              break;
            case "Profile":
              Icon = User;
              break;
            default:
              Icon = Home;
          }

          if (route.name === "Home") {
            return (
              <Icon
                size={dynamicWidth(5.5)}
                color="#FFFFFF"
                strokeWidth={2.5}
              />
            );
          }
          return (
            <Icon
              size={dynamicWidth(5.5)}
              color="#1E3A8A"
              strokeWidth={focused ? 2.5 : 2}
            />
          );
        },
        tabBarLabel: ({ focused }) => {
          let label;
          switch (route.name) {
            case "Packages":
              label = "Packages";
              break;
            case "Home":
              label = "";
              break;
            case "Profile":
              label = "Profile";
              break;
            default:
              label = "";
          }

          if (route.name === "Home") return null;

          return (
            <Text
              style={[styles.tabBarLabel, focused && styles.tabBarLabelFocused]}
            >
              {label}
            </Text>
          );
        },
        tabBarActiveTintColor: "#1E3A8A",
        tabBarInactiveTintColor: "#1E3A8A",
        tabBarHideOnKeyboard: true,
        tabBarStyle: styles.tabBar,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Packages" component={PackageScreen} />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarButton: (props) => <CustomTabBarButton {...props} /> }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    backgroundColor: "#F1F5F9",
    height: Platform.OS === "ios" ? dynamicHeight(8) : dynamicHeight(7),
    paddingBottom: Platform.OS === "ios" ? dynamicHeight(1) : 0,
    borderTopWidth: 0,
    elevation: 0,
  },
  tabBarLabel: {
    fontSize: dynamicWidth(2.8),
    textAlign: "center",
    color: "#1E3A8A",
    marginTop: dynamicHeight(0.3),
  },
  tabBarLabelFocused: {
    fontWeight: "500",
  },
  customTabContainer: {
    top: -dynamicHeight(2.5),
    alignItems: "center",
  },
  customTabBackground: {
    width: dynamicWidth(20),
    height: dynamicWidth(10),
    borderTopLeftRadius: dynamicWidth(10),
    borderTopRightRadius: dynamicWidth(10),
    backgroundColor: "#F1F5F9",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  customTabIconWrapper: {
    width: dynamicWidth(12),
    height: dynamicWidth(12),
    borderRadius: dynamicWidth(6),
    backgroundColor: "#1E3A8A",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default TabNavigator;
