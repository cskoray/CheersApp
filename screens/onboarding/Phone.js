import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  TouchableWithoutFeedback,
  TextInput,
} from "react-native";
import useAuth from "../../auth/useAuth";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { Keyboard } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { updateDoc, getDoc } from "firebase/firestore";
import { auth, db, doc } from "../../firebase";

const Phone = () => {
  const { setAuthUser } = useAuth();
  const [phone, setPhone] = useState();
  const id = auth?.currentUser?.uid;

  const next = async () => {
    await addPhone();
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setAuthUser(docSnap.data());
    }
  };

  const addPhone = async () => {
    const docRef = doc(db, "users", id);
    await updateDoc(docRef, {
      phone: phone,
      step: "phone_entered",
    }).catch((err) => {
      console.log(err);
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View
          style={{
            flex: 1,
            backgroundColor: "white",
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
              style={{ width: "100%", height: 4, backgroundColor: "#0f172a" }}
            ></View>
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 30,
                fontFamily: "OpenSans_700Bold",
                top: 20,
              }}
            >
              What's your number?
            </Text>
            <Text
              style={{
                fontSize: 20,
                fontFamily: "Montserrat_500Medium",
                lineHeight: 30,
                top: 30,
              }}
            >
              We protect our community by making sure everyone on CheerApp is
              real.
            </Text>
            <View
              style={{
                top: 50,
                flexDirection: "row",
                height: "auto",
                justifyContent: "center",
              }}
            >
              <TextInput
                editable={false}
                placeholder="+44"
                style={{
                  margin: 10,
                  borderWidth: 1,
                  borderColor: "#d6d3d1",
                  padding: 15,
                  fontSize: 20,
                  fontFamily: "Montserrat_500Medium",
                  lineHeight: 30,
                  borderRadius: 5,
                }}
              />
              <TextInput
                editable={true}
                maxLength={11}
                keyboardType="numeric"
                placeholder="07XXXXXXXXX"
                style={{
                  margin: 10,
                  borderWidth: 1,
                  borderColor: "#d6d3d1",
                  padding: 15,
                  fontSize: 26,
                  fontFamily: "Montserrat_500Medium",
                  lineHeight: 30,
                  borderRadius: 5,
                  backgroundColor: "#f2f2f2",
                  textAlign: "auto",
                }}
                onChangeText={(text) => setPhone(text)}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                flex: 1,
                alignItems: "flex-end",
              }}
            >
              <AntDesign name="Safety" size={24} color="#0f172a" />
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Montserrat_500Medium",
                  lineHeight: 30,
                }}
              >
                We never share your number with anyone else
              </Text>
            </View>
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
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Phone;
