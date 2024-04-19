import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import useAuth from "../../auth/useAuth";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { auth, db, doc } from "../../firebase";
import { getDoc, updateDoc } from "firebase/firestore";

const Identity = () => {
  const { setAuthUser } = useAuth();
  const [selected, setSelected] = useState("Woman");
  const identities = ["Woman", "Man", "Nonbinary"];
  const id = auth?.currentUser?.uid;
  const usAuth = useAuth();

  const next = async () => {
    await addGender();
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      usAuth.logIn("user", docSnap.data());
      setAuthUser(docSnap.data());
    }
  };

  const addGender = async () => {
    const docRef = doc(db, "users", id);
    await updateDoc(docRef, {
      gender: selected,
      step: "identity_selected",
    }).catch((err) => {
      console.log(err);
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          // justifyContent: "center",
          margin: 20,
        }}
      >
        <View
          style={{
            width: "100%",
            height: 4,
            backgroundColor: "#E5E7EB",
            justifyContent: "center",
            position: "absolute",
          }}
        >
          <View
            style={{ width: "60%", height: 4, backgroundColor: "#0f172a" }}
          ></View>
        </View>
        <Text
          style={{
            fontSize: 30,
            fontFamily: "OpenSans_700Bold",
            top: 20,
          }}
        >
          What's your gender?
        </Text>
        <Text
          style={{
            fontSize: 20,
            fontFamily: "Montserrat_500Medium",
            lineHeight: 30,
            top: 30,
          }}
        >
          Pick which best describes you. You can always change this later
        </Text>
        <View
          style={{
            top: "5%",
            flexDirection: "column",
            flex: 1,
          }}
        >
          {identities.map((identity, idx) => (
            <TouchableOpacity
              key={idx}
              style={{
                padding: 20,
                borderColor: "#d6d3d1",
                borderWidth: 1,
                borderRadius: 5,
                margin: 10,
                top: 20,
                flexDirection: "row",
              }}
              onPress={
                selected === identity ? null : () => setSelected(identity)
              }
              // key={Crypto.randomUUID()}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: "Montserrat_500Medium",
                  lineHeight: 30,
                  flex: 1,
                }}
              >
                {identity}
              </Text>
              {selected === identity ? (
                <Ionicons name="radio-button-on" size={24} color="#0f172a" />
              ) : (
                <Ionicons
                  name="radio-button-off"
                  size={24}
                  color="#0f172a"
                  style={{ alignContent: "flex-end" }}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ alignItems: "flex-end", padding: 20 }}>
          <TouchableOpacity
            style={{
              padding: 10,
              backgroundColor: "#0f172a",
              borderRadius: 50,
              bottom: 50,
            }}
          >
            <MaterialIcons
              name="navigate-next"
              size={28}
              color="white"
              onPress={next}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Identity;
