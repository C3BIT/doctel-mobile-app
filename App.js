import React, { useEffect, Suspense } from "react";
import { Provider } from "react-redux";
import FlashMessage from "react-native-flash-message";
import { StatusBar } from "react-native";
import RNBootSplash from "react-native-bootsplash";
import MainApp from "./MainApp";
import Loader from "./app/components/common/Loader";
import store from "./app/redux/store";

export default function App() {
  useEffect(() => {
    const init = async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      await RNBootSplash.hide({ fade: true });
    };

    init();
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