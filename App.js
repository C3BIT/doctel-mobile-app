import React, { Suspense, useEffect, useState } from "react";
import { Provider } from "react-redux";
import FlashMessage from "react-native-flash-message";
import { StatusBar } from "react-native";
import MainApp from "./MainApp";
import Loader from "./app/components/common/Loader";
import store from "./app/redux/store";
import CustomSplashScreen from "./app/screens/SplashScreen";

import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";

export default function App() {
  const [isAppReady, setIsAppReady] = useState(false);

  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      opacity.value = withTiming(0, { duration: 800 });
      scale.value = withTiming(0.9, { duration: 800 }); 

      setTimeout(() => {
        setIsAppReady(true);
      }, 800);
    }, 2000); 

    return () => clearTimeout(splashTimer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Provider store={store}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {!isAppReady ? (
        <Animated.View style={[{ flex: 1 }, animatedStyle]}>
          <CustomSplashScreen />
        </Animated.View>
      ) : (
        <Suspense fallback={<Loader />}>
          <MainApp />
          <FlashMessage position="top" />
        </Suspense>
      )}
    </Provider>
  );
}
