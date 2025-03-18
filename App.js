import React, { useState, useRef, useEffect, Suspense } from "react";
import { Provider } from "react-redux";
import FlashMessage from "react-native-flash-message";
import { StatusBar, StyleSheet, Animated } from "react-native";
import MainApp from "./MainApp";
import store from "./app/redux/store";
import SplashScreen from "./app/screens/SplashScreen";

export default function App() {
  const [isSplashComplete, setSplashComplete] = useState(false);
  const [isMainAppReady, setMainAppReady] = useState(false);
  const fadeMainApp = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    const preloadMainApp = async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
      setMainAppReady(true);
    };
    
    preloadMainApp();
  }, []);

  const handleSplashFinish = () => {
    setSplashComplete(true);
  };
  
  useEffect(() => {
    if (isSplashComplete && isMainAppReady) {
      Animated.timing(fadeMainApp, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }).start();
    }
  }, [isSplashComplete, isMainAppReady, fadeMainApp]);

  if (!isSplashComplete || !isMainAppReady) {
    return (
      <>
        <StatusBar 
          translucent 
          backgroundColor="transparent" 
          barStyle="light-content" 
        />
        <SplashScreen onFinish={handleSplashFinish} />
      </>
    );
  }

  return (
    <Provider store={store}>
      <StatusBar 
        translucent 
        backgroundColor="transparent" 
        barStyle="light-content" 
      />
      <Animated.View style={[styles.mainContainer, { opacity: fadeMainApp }]}>
        <MainApp />
        <FlashMessage position="top" />
      </Animated.View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
});