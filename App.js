import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Palanquin_500Medium,
  Montserrat_600SemiBold,
  Montserrat_800ExtraBold,
  Montserrat_600SemiBold_Italic,
  Palanquin_600SemiBold,
  Palanquin_700Bold,
  OpenSans_500Medium,
  OpenSans_400Regular,
  OpenSans_700Bold,
  Almarai_400Regular,
} from "@expo-google-fonts/dev";
import AuthContext from "./auth/context";
import { navigationRef } from "./navigation/rootNavigation";
import AuthNavigator from "./navigation/AuthNavigator";
import UserNavigator from "./navigation/UserNavigator";
import OnboardingNavigator from "./navigation/OnboardingNavigator";
import * as SecureStore from "expo-secure-store";

export default function App() {
  const [authUser, setAuthUser] = useState();
  const [token, setToken] = useState();

  const getAu = async () => {
    let user = await SecureStore.getItemAsync("user");
    if (user) {
      // console.log("appJS-user=", user);
      setAuthUser(user);
    }
    let idToken = await SecureStore.getItemAsync("token");
    if (idToken && user) {
      setToken(idToken);
    }
  };

  useEffect(() => {
    getAu();
  }, [token]);

  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_800ExtraBold,
    Montserrat_600SemiBold_Italic,
    Palanquin_500Medium,
    Palanquin_600SemiBold,
    Palanquin_700Bold,
    OpenSans_500Medium,
    OpenSans_400Regular,
    OpenSans_700Bold,
    Almarai_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      <NavigationContainer ref={navigationRef}>
        <StatusBar style="dark" />
        {authUser ? (
          authUser.status && authUser.status === "active" ? (
            <UserNavigator />
          ) : authUser.status === "onboarding" ? (
            <OnboardingNavigator />
          ) : (
            <AuthNavigator />
          )
        ) : (
          <AuthNavigator />
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
