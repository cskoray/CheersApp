import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import PictureScreen from "../screens/onboarding/Picture";
import IdentityScreen from "../screens/onboarding/Identity";
import DobScreen from "../screens/onboarding/Dob";
import PickTopicsScreen from "../screens/onboarding/PickTopics";
import VerifyEmailScreen from "../screens/onboarding/VerifyEmail";
// import PhoneScreen from "../screens/onboarding/Phone";
// import VerifyPhoneScreen from "../screens/onboarding/VerifyPhone";
import * as SecureStore from "expo-secure-store";
import useAuth from "../auth/useAuth";

const Stack = createStackNavigator();

const OnboardingNavigator = () => {
  const usAuth = useAuth();
  const [userStep, setUserStep] = useState();

  const getUser = async () => {
    let user = await SecureStore.getItemAsync("user");
    if (user) {
      setUserStep(JSON.parse(user).step);
    }
  };

  useEffect(() => {
    getUser();
  }, [usAuth, userStep]);

  return (
    <>
      {userStep && userStep === "email_sent" ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
        </Stack.Navigator>
      ) : userStep && userStep === "email_verified" ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="PickTopics" component={PickTopicsScreen} />
        </Stack.Navigator>
      ) : userStep && userStep === "topics_picked" ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Picture" component={PictureScreen} />
        </Stack.Navigator>
      ) : userStep && userStep === "picture_uploaded" ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Identity" component={IdentityScreen} />
        </Stack.Navigator>
      ) : userStep && userStep === "identity_selected" ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Dob" component={DobScreen} />
        </Stack.Navigator>
      ) 
      // : userStep && userStep === "dob_selected" ? (
      //   <Stack.Navigator screenOptions={{ headerShown: false }}>
      //     <Stack.Screen name="Phone" component={PhoneScreen} />
      //   </Stack.Navigator>
      // )
      //  : userStep && userStep === "phone_entered" ? (
      //   <Stack.Navigator screenOptions={{ headerShown: false }}>
      //     <Stack.Screen name="VerifyPhone" component={VerifyPhoneScreen} />
      //   </Stack.Navigator>
      // ) 
      : (
        <></>
      )}
    </>
  );
};

export default OnboardingNavigator;
