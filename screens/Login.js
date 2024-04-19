import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { auth, db, doc } from "../firebase";
import { getDoc } from "firebase/firestore";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import useAuth from "../auth/useAuth";
import * as AppleAuthentication from "expo-apple-authentication";
import Ionicons from "@expo/vector-icons/Ionicons";
import Button from "../components/Button";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";

function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [see, setSee] = useState(true);
  const [appUser, setAppUser] = useState();
  const [id, setId] = useState();
  const usAuth = useAuth();
  const { setAuthUser } = useAuth();

  const seePass = () => {
    setSee(!see);
  };

  const getUserStatusAndStep = async (id) => {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      // console.log("docSnap.data()", docSnap.data());
      usAuth.logIn("user", docSnap.data());
      setAuthUser(docSnap.data());
      // setStatus(docSnap.data()?.status);
      // setStep(docSnap.data()?.step);
      // console.log("docSnap.data()?.step", docSnap.data()?.step);
      // let user = await SecureStore.getItemAsync("user");
      // if (user) {
      //   if (status && step) {
      //     let u = JSON.parse(user);
      //     u.status = status;
      //     u.step = step;
      //     setAppUser(u);
      //     usAuth.logIn("user", u);
      //     setAuthUser(u);
      //   }
      // }
    }
  };

  const signin = async () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setId(userCredential.user.uid);
        const user = {
          uid: userCredential.user.uid,
          name: userCredential.user.displayName,
          email: userCredential.user.email,
          avatar: userCredential.user.photoURL,
          connections: userCredential.user.connections,
          topics: userCredential.user.topics,
          interests: userCredential.user.interests,
          createdAt: userCredential.user.createdAt,
        };
        getUserStatusAndStep(userCredential.user.uid);
        setAppUser(user);
        usAuth.logIn("user", user);
        setAuthUser(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
      });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        user.getIdToken().then((idToken) => {
          usAuth.logIn("token", idToken);
        });
        getUserStatusAndStep(user.uid);
        usAuth.logIn("user", user);
      } else {
        // authUser.logOut(user);
        navigation.canGoBack() && navigation.popToTop();
      }
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        paddingHorizontal: 35,
      }}
    >
      <View
        style={{
          flexDirection: "column",
        }}
      >
        <Text
          style={{
            fontFamily: "Almarai_400Regular",
            fontSize: 70,
            padding: 20,
          }}
        >
          Cheerapp
        </Text>
      </View>
      <Text
        style={{
          alignSelf: "flex-start",
          color: "#4b5563",
          fontFamily: "Montserrat_600SemiBold",
        }}
      >
        Email
      </Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#d1d5db",
          borderRadius: 6,
          width: "100%",
          height: 48,
          margin: 10,
          padding: 10,
          fontFamily: "Montserrat_500Medium",
          fontSize: 17,
        }}
        placeholder=" Email"
        onChangeText={(email) => setEmail(email)}
      />
      <View style={{ width: "100%", margin: 10 }}>
        <Text
          style={{
            alignSelf: "flex-start",
            color: "#4b5563",
            fontFamily: "Montserrat_600SemiBold",
          }}
        >
          Password
        </Text>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: "#d1d5db",
            borderRadius: 6,
            width: "100%",
            height: 48,
            top: 10,
            padding: 10,
            fontFamily: "Montserrat_500Medium",
            fontSize: 17,
          }}
          secureTextEntry={see ? true : false}
          placeholder=" Password"
          onChangeText={(password) => setPassword(password)}
        />
        <Ionicons
          name={see ? "eye" : "eye-off"}
          color="#d1d5db"
          size={24}
          style={{
            position: "absolute",
            right: 10,
            top: 35,
          }}
          onPress={seePass}
        />
      </View>
      <TouchableOpacity
        style={{
          top: 10,
          alignSelf: "flex-start",
        }}
        onPress={() => navigation.navigate("Forgot")}
      >
        <Text
          style={{
            color: "#4b5563",
            fontFamily: "Montserrat_600SemiBold",
            textDecorationLine: "underline",
          }}
        >
          Forgot Password?
        </Text>
      </TouchableOpacity>
      <View style={{ top: "5%", alignItems: "center" }}>
        <Button
          title="Log in"
          customStyle={{
            backgroundColor: "#3b82f6",
            marginTop: "8%",
          }}
          customTextStyle={{
            fontFamily: "Montserrat_600SemiBold",
          }}
          onPress={() => signin()}
        />
        <Text
          style={{
            color: "#6b7280",
            top: "2%",
            fontFamily: "Montserrat_600SemiBold",
          }}
        >
          Or
        </Text>
        <Button
          title="Continue with Apple"
          customStyle={{
            backgroundColor: "#000",
            marginTop: "2%",
          }}
          customTextStyle={{
            fontFamily: "Montserrat_600SemiBold",
          }}
          onPress={() => {
            AppleAuthentication.signInAsync({
              requestedScopes: [
                AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                AppleAuthentication.AppleAuthenticationScope.EMAIL,
              ],
            });
          }}
        />
        <Text
          style={{
            color: "#6b7280",
            top: "20%",
            fontFamily: "Montserrat_600SemiBold",
          }}
        >
          Not joined yet?
        </Text>
        <Button
          title="Create account"
          customStyle={{
            backgroundColor: "#01644f",
            marginTop: "25%",
          }}
          customTextStyle={{
            fontFamily: "Montserrat_600SemiBold",
          }}
          onPress={() => navigation.navigate("Register")}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          flex: 1,
          alignItems: "flex-end",
          margin: 50,
        }}
      >
        <FontAwesome5 name="smile-wink" size={28} color="#0f172a" />
        <Text
          style={{
            fontSize: 15,
            fontFamily: "Montserrat_500Medium",
            lineHeight: 30,
            left: 5,
          }}
        >
          Friendly ears, ready for your cheers!
        </Text>
      </View>
    </SafeAreaView>
  );
}

export default Login;
