import React, { useEffect, useRef } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, View, Dimensions, Text, Platform, TouchableOpacity, PixelRatio } from "react-native";
import PackageScreen from "../../screens/PackageScreen";
import { ProfileScreen } from "./../../screens/ProfileScreen";
import HomeScreen from "./../../screens/HomeScreen";
import { Svg, Path } from "react-native-svg";
import HomeIcon from "../../assets/home_icon.svg";
import PackageIcon from "../../assets/package_icon.svg";
import ProfileIcon from "../../assets/profile_icon.svg";

const Tab = createBottomTabNavigator();
const { height, width } = Dimensions.get("window");
const dynamicHeight = (percentage) => (height * percentage) / 100;
const dynamicWidth = (percentage) => (width * percentage) / 100;

const normalizeFontSize = (size) => {
  const scale = width / 375;
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

const ProfileScreenWrapper = (props) => {
  const isFirstRender = useRef(true);
  
  return <ProfileScreen {...props} />;
};

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.curveContainer}>
        <Svg width={width} height={dynamicHeight(7)}>
          <Path
            d={`M0,0 L${width / 2 - dynamicWidth(12)},0 
                Q${width / 2},${dynamicHeight(8)} ${width / 2 + dynamicWidth(12)},0 
                L${width},0 L${width},${dynamicHeight(10)} L0,${dynamicHeight(10)} Z`}
            fill="#eff1ed"
          />
        </Svg>
      </View>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          if (route.name === 'Home') {
            return (
              <View key={index} style={styles.customTabContainer}>
                <TouchableOpacity
                  onPress={onPress}
                  style={styles.customTabIconWrapper}
                  activeOpacity={0.8}
                >
                  <HomeIcon width={dynamicWidth(6.5)} height={dynamicWidth(6.5)} />
                </TouchableOpacity>
              </View>
            );
          }

          let IconComponent;
          switch (route.name) {
            case "Packages":
              IconComponent = PackageIcon;
              break;
            case "Profile":
              IconComponent = ProfileIcon;
              break;
            default:
              IconComponent = PackageIcon;
          }

          return (
            <TouchableOpacity
              key={index}
              onPress={onPress}
              style={styles.tabItemContainer}
              activeOpacity={0.7}
            >
              <IconComponent
                width={dynamicWidth(6.5)}
                height={dynamicWidth(6.5)}
                fill={isFocused ? "#1E3A8A" : "#6B7280"}
              />
              <Text
                style={[
                  styles.tabBarLabel,
                  isFocused && styles.tabBarLabelFocused,
                ]}
              >
                {route.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#EAEFF5' },
        lazy: false,
        unmountOnBlur: false,
      }}
    >
      <Tab.Screen 
        name="Packages" 
        component={PackageScreen} 
      />
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreenWrapper} 
        options={{
          id: 'profile-screen',
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: Platform.select({
      ios: dynamicHeight(6),
      android: dynamicHeight(6),
    }),
  },
  curveContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    zIndex: 0,
  },
  tabBar: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: Platform.select({
      ios: dynamicHeight(6),
      android: dynamicHeight(5),
    }),
    backgroundColor: "transparent",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: Platform.select({
      ios: dynamicHeight(1),
      android: 0,
    }),
    borderTopWidth: 0,
    elevation: 0,
    zIndex: 1,
  },
  tabItemContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    flexDirection: "row",
    gap: 8,
    marginTop: Platform.select({
      ios: -dynamicHeight(2.5),
      android: -dynamicHeight(2),
    }),
  },
  tabBarLabel: {
    fontSize: normalizeFontSize(14),
    textAlign: "center",
    color: "#6B7280",
    marginTop: dynamicHeight(0.3),
  },
  tabBarLabelFocused: {
    color: "#1E3A8A",
    fontWeight: "500",
  },
  customTabContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: Platform.select({
      ios: -100,
      android: -80,
    }),
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
    zIndex: 10,
  },
});

export default TabNavigator;