import React, { Suspense, useEffect, useState } from "react";
import { Provider } from "react-redux";
import FlashMessage from "react-native-flash-message";
import { StatusBar } from "react-native";
import MainApp from "./MainApp";
import Loader from "./app/components/common/Loader";
import store from "./app/redux/store";
import CustomSplashScreen from "./app/screens/SplashScreen";

export default function App() {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setIsAppReady(true);
    }, 500);

    return () => clearTimeout(splashTimer);
  }, []);

  return (
    <Provider store={store}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      {!isAppReady ? (
        <CustomSplashScreen />
      ) : (
        <Suspense fallback={<Loader />}>
          <MainApp />
          <FlashMessage position="top" />
        </Suspense>
      )}
    </Provider>
  );
}
