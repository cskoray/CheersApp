import React, { useState, useEffect } from "react";
import { auth, db, doc } from "../../firebase";
import { getDoc, getDocs, collection, query, where } from "firebase/firestore";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import Button from "../../components/Button";
import DynamicBorderColorImage from "../../components/DynamicBorderColorImage";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import server from "../../api/server";

const NewChatWaitRequest = ({ route, navigation }) => {
  const { requestUid, topicName } = route.params;
  const [user, setUser] = useState();
  const [userInterests, setUserInterests] = useState([]);

  const getUser = async () => {
    const docRef = doc(db, "users", requestUid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setUser(docSnap.data());
      const q = query(collection(db, "interests"));
      const docSnap2 = await getDocs(q);
      if (!docSnap2.empty) {
        docSnap2.forEach((doc) => {
          if (docSnap.data().interests.includes(doc.data()._id)) {
            setUserInterests((interests) => [...interests, doc.data()]);
          }
        });
      }
    }
  };

  const getAge = (seconds) => {
    let myBirthday = new Date(seconds * 1000);
    let currentDate = new Date().toJSON().slice(0, 10) + " 01:00:00";
    return ~~((Date.now(currentDate) - myBirthday) / 31557600000);
  };

  useEffect(() => {
    getUser();
  }, []);

  const reject = async () => {
    const res = await server.reject(requestUid);
    if (res) navigation.navigate("Connections");
  };

  const accept = async () => {
    const res = await server.accept(requestUid);
    if (res) navigation.navigate("Connections");
  };

  return (
    <>
      <StatusBar style="light" />
      <View style={{ backgroundColor: "white", flex: 1 }}>
        <View
          style={{
            flex: 1,
            justifyContent: "space-evenly",
          }}
        >
          <View
            style={{
              backgroundColor: "#475569",
              height: "35%",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginVertical: "20%",
            }}
          >
            <AntDesign
              name="leftcircle"
              size={36}
              color="#fff"
              style={{
                top: 20,
                width: "28%",
                alignSelf: "flex-start",
                left: 10,
              }}
              onPress={() => {
                navigation.goBack({
                  param1: "value1",
                  param2: "value2",
                });
              }}
            />
            <Text
              style={{
                fontSize: 26,
                fontFamily: "Montserrat_600SemiBold",
                color: "#fff",
                alignSelf: "center",
                top: 10,
              }}
            >
              chat is about {topicName}
            </Text>
            <DynamicBorderColorImage imageUrl={user?.avatar?.toString()} />
            <Text
              style={{
                fontSize: 26,
                fontFamily: "Montserrat_600SemiBold",
                color: "#fff",
                alignSelf: "center",
                top: 30,
              }}
            >
              {user?.name}, {getAge(user?.dob?.seconds)}
            </Text>
          </View>
          <View
            style={{
              height: "78%",
              // alignItems: "center",
              backgroundColor: "#fff",
              // justifyContent: "space-around",
            }}
            spo
          >
            <View style={{ padding: "5%" }}>
              <Text
                style={{
                  fontSize: 22,
                  fontFamily: "Montserrat_600SemiBold",
                  color: "gray",
                }}
              >
                About {user?.name}
              </Text>
              <Text
                style={{
                  fontSize: 22,
                  fontFamily: "Montserrat_500Medium",
                  padding: "3%",
                }}
              >
                {user?.bio}
              </Text>
            </View>
            <View style={{ padding: "5%" }}>
              <Text
                style={{
                  fontSize: 22,
                  fontFamily: "Montserrat_600SemiBold",
                  color: "gray",
                }}
              >
                {user?.name}'s interests
              </Text>
              <FlatList
                horizontal={true}
                data={userInterests}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      borderColor: "#E5E7EB",
                      borderWidth: 1,
                      borderRadius: 50,
                      margin: 5,
                      paddingHorizontal: 10,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#d4d4d466",
                    }}
                  >
                    <Text>{item.icon}</Text>
                    <Text
                      style={{
                        left: 5,
                        fontFamily: "Montserrat_500Medium",
                        fontSize: 16,
                        padding: 10,
                      }}
                    >
                      {item.interestName}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
            <View style={{ top: "20%" }}>
              <View
                style={{ flexDirection: "row", justifyContent: "space-evenly" }}
              >
                <Button
                  title="Reject"
                  customStyle={{
                    backgroundColor: "#ef4444",
                    width: "30%",
                    borderRadius: 15,
                  }}
                  customTextStyle={{
                    color: "#fff",
                    fontFamily: "Montserrat_600SemiBold",
                    fontSize: 20,
                  }}
                  onPress={reject}
                />
                <Button
                  title="Accept"
                  customStyle={{
                    backgroundColor: "#059669",
                    width: "30%",
                    borderRadius: 15,
                  }}
                  customTextStyle={{
                    color: "#fff",
                    fontFamily: "Montserrat_600SemiBold",
                    fontSize: 20,
                  }}
                  onPress={accept}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

export default NewChatWaitRequest;
