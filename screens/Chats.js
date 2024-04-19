import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { Avatar } from "react-native-elements";
import { auth, db, doc } from "../firebase";
import {
  setDoc,
  getDoc,
  getDocs,
  or,
  collection,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Button from "../components/Button";
import { AntDesign } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

function Chats({ navigation }) {
  const [chats, setChats] = useState([]);
  const [connections, setConnections] = useState([]);
  const [connectionIds, setConnectionIds] = useState([]);
  const [extradata, setExtraData] = useState(null);
  const id = auth?.currentUser?.uid;

  useFocusEffect(
    React.useCallback(() => {
      getConnections();
      getChats();
    }, [])
  );

  function isIdExists(id) {
    return connectionIds.some((arrVal) => id === arrVal);
  }

  const getConnections = async () => {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      docSnap.data()?.connections?.map((connection) => {
        const connsId = connection.uid;
        const version1 = connsId + "-" + id;
        const version2 = id + "-" + connsId;
        if (!isIdExists(version1)) {
          setConnectionIds((connectionIds) => [...connectionIds, version1]);
        }
        if (!isIdExists(version2)) {
          setConnectionIds((connectionIds) => [...connectionIds, version2]);
        }
        setExtraData(connsId);
      });
      setConnections(docSnap.data().connections);
    }
  };

  function findDay(date) {
    let dateToCheck = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    const oneDayBeforeYesterday = new Date(yesterday);
    const twoDayBeforeYesterday = new Date(yesterday);
    const threeDayBeforeYesterday = new Date(yesterday);
    const fourDayBeforeYesterday = new Date(yesterday);
    const fiveDayBeforeYesterday = new Date(yesterday);

    yesterday.setDate(yesterday.getDate() - 1);
    oneDayBeforeYesterday.setDate(yesterday.getDate() - 1);
    twoDayBeforeYesterday.setDate(yesterday.getDate() - 2);
    threeDayBeforeYesterday.setDate(yesterday.getDate() - 3);
    fourDayBeforeYesterday.setDate(yesterday.getDate() - 4);
    fiveDayBeforeYesterday.setDate(yesterday.getDate() - 5);

    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    if (dateToCheck.toDateString() === today.toDateString()) {
      return dateToCheck.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (dateToCheck.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else if (
      dateToCheck.toDateString() === oneDayBeforeYesterday.toDateString()
    ) {
      return days[dateToCheck.getDay()];
    } else if (
      dateToCheck.toDateString() === twoDayBeforeYesterday.toDateString()
    ) {
      return days[dateToCheck.getDay()];
    } else if (
      dateToCheck.toDateString() === threeDayBeforeYesterday.toDateString()
    ) {
      return days[dateToCheck.getDay()];
    } else if (
      dateToCheck.toDateString() === fourDayBeforeYesterday.toDateString()
    ) {
      return days[dateToCheck.getDay()];
    } else if (
      dateToCheck.toDateString() === fiveDayBeforeYesterday.toDateString()
    ) {
      return days[dateToCheck.getDay()];
    } else {
      return new Intl.DateTimeFormat("en-US").format(dateToCheck);
    }
  }

  const chat = async (selectedUser) => {
    const a = query(
      collection(db, "chats"),
      or(where("fromUid", "==", id), where("toUid", "==", id))
    );
    const querySnapshot = await getDocs(a);
    if (querySnapshot.empty) {
      await setDoc(doc(db, "chats", selectedUser.uid), {
        fromUid: id,
        fromName: auth?.currentUser?.displayName,
        fromAvatar: auth?.currentUser?.photoURL,
        toUid: selectedUser.uid,
        toName: selectedUser.name,
        lastUpdated: new Date(),
        toAvatar: selectedUser.avatar,
        lastMessage: "",
        lastMessageDate: "",
        createdAt: new Date(),
      });
    }
    navigation.navigate("Chat", {
      convo: selectedUser.id,
      name: selectedUser.name,
      avatar: selectedUser.avatar,
    });
  };

  const getChats = async () => {
    try {
      setChats([]);
      const a = query(
        collection(db, "chats"),
        or(where("fromUid", "==", id), where("toUid", "==", id)),
        orderBy("lastMessageDate", "desc")
      );
      const querySnapshot = await getDocs(a);
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          let ch = {};
          if (id == doc.data().toUid) {
            ch = {
              name: doc.data().fromName,
              avatar: doc.data().fromAvatar,
              lastMessage: doc.data().lastMessage,
              id: doc.id,
              createdAt:
                doc.data().lastMessageDate &&
                findDay(doc.data().lastMessageDate.seconds * 1000),
            };
          } else {
            ch = {
              name: doc.data().toName,
              avatar: doc.data().toAvatar,
              lastMessage: doc.data().lastMessage,
              id: doc.id,
              createdAt:
                doc.data().lastMessageDate &&
                findDay(doc.data().lastMessageDate.seconds * 1000),
            };
          }
          if (!isChatIdExists(doc.id)) {
            setChats((chats) => [...chats, ch]);
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  function isChatIdExists(id) {
    return chats.some((arrVal) => id === arrVal);
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        // justifyContent: "center",
      }}
    >
      <View
        style={{
          // left: 10,
          backgroundColor: "#fcd34d",
          height: connections.length === 0 ? "30%" : "20%",
          padding: 20,
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            top: 50,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 36,
              fontFamily: "OpenSans_700Bold",
              color: "#0f172a",
            }}
          >
            Chats
          </Text>
          <AntDesign
            name="pluscircle"
            size={28}
            color="#0f172a"
            onPress={() => navigation.navigate("NewChat")}
          />
        </View>
        {connections.length === 0 && (
          <View>
            <MaterialCommunityIcons
              name="message-badge"
              size={38}
              color="#0f172a"
              style={{ alignSelf: "center" }}
            />
            <Text
              style={{
                fontSize: 20,
                fontFamily: "Montserrat_500Medium",
                color: "#0f172a",
              }}
            >
              When someone sends you a message, you'll see it right here.
            </Text>
          </View>
        )}
      </View>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          paddingTop: connections.length === 0 && "35%",
        }}
      >
        {connections.length === 0 && (
          <>
            <MaterialCommunityIcons
              name="hand-wave"
              size={48}
              color="#b6b3b1"
            />
            <Text
              style={{
                fontSize: 26,
                fontFamily: "Montserrat_600SemiBold",
                color: "#0f172a",
                paddingVertical: 10,
              }}
            >
              Complete your profile
            </Text>
            <Text
              style={{
                fontSize: 21,
                fontFamily: "Montserrat_400Regular",
                color: "#0f172a",
                alignSelf: "center",
                paddingHorizontal: 25,
                textAlign: "center",
              }}
            >
              Interests, bio and topics will let you have more suitable
              connections
            </Text>
            <Button
              title="Edit my profile"
              customStyle={{
                backgroundColor: "#fcd34d",
                paddingVertical: 17,
                width: "auto",
                borderRadius: 50,
                top: "7%",
                paddingHorizontal: 40,
              }}
              customTextStyle={{
                fontFamily: "Montserrat_600SemiBold",
                color: "#000",
                fontSize: 20,
                lineHeight: 20,
              }}
              onPress={() => navigation.navigate("EditProfile")}
            />
          </>
        )}
        <FlatList
          style={{ width: "100%" }}
          data={chats}
          extraData={extradata}
          renderItem={({ item }) => (
            <View
              style={{
                borderTopColor: "#d4d4d4",
                borderTopWidth: 0.5,
                borderBottomColor: "#d4d4d4",
                borderBottomWidth: 0.5,
                paddingVertical: 10,
                justifyContent: "space-between",
                flexDirection: "row",
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                }}
                onPress={() => chat(item)}
              >
                <Avatar
                  rounded
                  source={{
                    uri: item.avatar,
                  }}
                  size={56}
                />
                <View
                  style={{
                    flexDirection: "column",
                    paddingHorizontal: 10,
                    width: "70%",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: "Palanquin_600SemiBold",
                    }}
                  >
                    {item.name}
                  </Text>
                  <View>
                    <Text
                      style={{
                        color: "#4b5563",
                        fontFamily: "OpenSans_400Regular",
                      }}
                    >
                      {item.lastMessage}
                    </Text>
                  </View>
                </View>
                <Text
                  style={{
                    color: "#4b5563",
                    fontFamily: "OpenSans_400Regular",
                    fontSize: 14,
                    alignSelf: "center",
                  }}
                >
                  {item.createdAt}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          key={(item) => item._id}
        />
      </View>
    </View>
  );
}

export default Chats;
