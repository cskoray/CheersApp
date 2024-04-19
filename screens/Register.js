import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TextInput } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { auth, db, doc } from "../firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import { setDoc } from "firebase/firestore";
import * as AppleAuthentication from "expo-apple-authentication";
import Button from "../components/Button";
import useAuth from "../auth/useAuth";
import server from "../api/server";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [see, setSee] = useState(true);
  const [id, setId] = useState();
  const [userToSave, setUserToSave] = useState();
  const { authUser, setAuthUser } = useAuth();
  const usAuth = useAuth();

  const seePass = () => {
    setSee(!see);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && userToSave) {
        user.getIdToken().then((tok) => {
          usAuth.logIn("token", tok);
          if (id) {
            setAuthUser(userToSave);
            usAuth.logIn("user", userToSave);
            server
              .sendVerificationEmail(id, userToSave.email, userToSave.name)
              .then((res) => {
                console.log("res", res);
              })
              .catch((err) => {
                console.log("err", err);
              });
          }
        });
      }
    });
    return unsubscribe;
  }, [id, userToSave]);

  const saveUser = async (user) => {
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: user.displayName,
      email,
      about: `hi there👋 this is ${user.displayName}`,
      avatar: user.photoURL,
      plan: "free",
      step: "email_sent",
      status: "onboarding",
      connections: [],
      topics: [],
      createdAt: new Date(),
    })
      .then(() => {
        const toSave = {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          about: user.about,
          avatar: user.photoURL,
          step: "email_sent",
          status: "onboarding",
          connections: [],
          topics: [],
        };
        setId(user.uid);
        setUserToSave(toSave);
        // setAuthUser(toSave);
        // usAuth.logIn("user", toSave);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const signup = async () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Registered
        const user = userCredential.user;
        updateProfile(user, {
          displayName: name,
          photoURL:
            "https://gravatar.com/avatar/94d45dbdba988afacf30d916e7aaad69?s=200&d=mp&r=x",
        })
          .then(() => {
            saveUser(user);
          })
          .catch((error) => {
            alert(error.message);
          });
      })
      .catch((error) => {
        // const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
      });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <View
        style={{
          flex: 1,
          width: "100%",
          height: "100%",
          alignItems: "center",
          backgroundColor: "#fff",
          paddingHorizontal: 30,
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
            cheerapp
          </Text>
        </View>
        <View style={{ width: "100%", top: "3%", alignItems: "center" }}>
          <Text
            style={{
              alignSelf: "flex-start",
              color: "#4b5563",
              fontFamily: "Montserrat_600SemiBold",
            }}
          >
            Name or Nickname
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
            placeholder=" Name or Nickname"
            onChangeText={(name) => setName(name)}
          />
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
              right: 10,
              bottom: 28,
              alignSelf: "flex-end",
            }}
            onPress={seePass}
          />
          <Text
            style={{
              alignSelf: "flex-start",
              color: "#9ca3af",
              fontFamily: "Montserrat_600SemiBold",
              top: 10,
            }}
          >
            Password must contain at least 8 characters.
          </Text>
          <Button
            title="Sign Up"
            customStyle={{
              backgroundColor: "#3b82f6",
              marginTop: "14%",
              paddingVertical: 18,
            }}
            customTextStyle={{
              fontFamily: "Montserrat_600SemiBold",
            }}
            onPress={() => signup()}
          />
          <Text
            style={{
              alignSelf: "flex-start",
              color: "#6b7280",
              top: 10,
            }}
          >
            By signinup you agree to our Terms of Service and Privacy Policy
          </Text>
          <Text
            style={{
              color: "#6b7280",
              top: "4%",
              fontFamily: "Montserrat_600SemiBold_Italic",
            }}
          >
            Or
          </Text>
          <Button
            title="Signup with Apple"
            customStyle={{
              backgroundColor: "#000",
              marginTop: "12%",
              paddingVertical: 18,
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
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Register;
