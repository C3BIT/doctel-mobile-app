import React, { useEffect, Suspense } from "react";
import { Provider } from "react-redux";
import FlashMessage from "react-native-flash-message";
import { StatusBar } from "react-native";
import MainApp from "./MainApp";
import Loader from "./app/components/common/Loader";
import store from "./app/redux/store";

export default function App() {
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