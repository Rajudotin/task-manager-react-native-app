import React, {
  useEffect,
  useState,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {

  const [initialRoute, setInitialRoute] =
    useState("Login");

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {

    const token = await AsyncStorage.getItem(
      "token"
    );

    if (token) {
      setInitialRoute("Projects");
    }
  };

  return (
    <AppNavigator
      initialRoute={initialRoute}
    />
  );
}