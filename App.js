import { Provider } from "react-redux";
import { Suspense, useEffect } from "react";
// import SplashScreen from "react-native-splash-screen";
import MainApp from "./MainApp";
import Loader from "./app/components/common/Loader";
import store from "./app/redux/store";
// import { ThemeProvider } from "./context/ThemeProvider";

export default function App() {
  // useEffect(() => {
  //   const hideSplashScreen = async () => {
  //     await new Promise((resolve) => setTimeout(resolve, 300));
  //     SplashScreen.hide();
  //   };

  //   hideSplashScreen();
  // }, []);

  return (
    <Provider store={store}>
        <Suspense fallback={<Loader />}>
          <MainApp />
        </Suspense>
    </Provider>
  );
}
