import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import useAuth from "../../auth/useAuth";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";
import { Keyboard } from "react-native";
import { auth, db, doc } from "../../firebase";
import { getDoc, updateDoc } from "firebase/firestore";

const Dob = () => {
  const { setAuthUser } = useAuth();
  const [day, setDay] = useState();
  const [month, setMonth] = useState();
  const [year, setYear] = useState();
  const id = auth?.currentUser?.uid;
  const usAuth = useAuth();

  const next = async () => {
    let myBirthday = new Date(year + "-" + day + "-" + month);
    let currentDate = new Date().toJSON().slice(0, 10) + " 01:00:00";
    let age = ~~((Date.now(currentDate) - myBirthday) / 31557600000);
    if (age >= 18) {
      const docRef = doc(db, "users", id);
      await updateDoc(docRef, {
        dob: myBirthday,
        status: "active",
        step: "dob_selected",
      }).catch((err) => {
        console.log(err);
      });
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        usAuth.logIn("user", docSnap.data());
        setAuthUser(docSnap.data());
      }
    } else {
      alert("You must be 18 years or older to use this app.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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
              style={{ width: "80%", height: 4, backgroundColor: "#0f172a" }}
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
              When is your birthday?
            </Text>

            <View
              style={{
                top: 50,
                flexDirection: "row",
                height: "auto",
                justifyContent: "space-around",
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text>Day</Text>
                <TextInput
                  maxLength={2}
                  keyboardType="numeric"
                  placeholder="DD"
                  style={{
                    borderWidth: 1,
                    borderColor: "#d6d3d1",
                    padding: 15,
                    fontSize: 20,
                    fontFamily: "Montserrat_500Medium",
                    lineHeight: 30,
                    borderRadius: 5,
                  }}
                  onChangeText={(text) => setDay(text)}
                />
              </View>
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text>Month</Text>
                <TextInput
                  maxLength={2}
                  keyboardType="numeric"
                  placeholder="MM"
                  style={{
                    borderWidth: 1,
                    borderColor: "#d6d3d1",
                    padding: 15,
                    fontSize: 20,
                    fontFamily: "Montserrat_500Medium",
                    lineHeight: 30,
                    borderRadius: 5,
                  }}
                  onChangeText={(text) => setMonth(text)}
                />
              </View>
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text>Year</Text>
                <TextInput
                  maxLength={4}
                  keyboardType="numeric"
                  placeholder="YYYY"
                  style={{
                    borderWidth: 1,
                    borderColor: "#d6d3d1",
                    padding: 15,
                    fontSize: 20,
                    fontFamily: "Montserrat_500Medium",
                    lineHeight: 30,
                    borderRadius: 5,
                  }}
                  onChangeText={(text) => setYear(text)}
                />
              </View>
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

export default Dob;
