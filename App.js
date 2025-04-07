import React, { useEffect, Suspense } from "react";
import { Provider } from "react-redux";
import FlashMessage from "react-native-flash-message";
import { StatusBar } from "react-native";
import MainApp from "./MainApp";
import Loader from "./app/components/common/Loader";
import store from "./app/redux/store";
import SplashScreen from "react-native-splash-screen";
export default function App() {
  useEffect(() => {
    const hideSplashScreen = async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      SplashScreen.hide();
    };

    hideSplashScreen();
  }, []);
  return (
    <Provider store={store}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <Suspense fallback={<Loader />}>
        <MainApp />
        <FlashMessage position="top" />
      </Suspense>
    </Provider>
  );
}