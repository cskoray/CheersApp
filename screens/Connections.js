import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
} from "react-native";
import { Avatar } from "react-native-elements";
import { auth, db, doc } from "../firebase";
import {
  getDoc,
  getDocs,
  collection,
  query,
  where,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { Entypo } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Button from "../components/Button";
import { MaterialIcons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import server from "../api/server";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

function Connections({ route, navigation }) {
  const [connections, setConnections] = useState([]);
  const [newChat, setNewChat] = useState();
  const [extradata, setExtraData] = useState(null);
  const id = auth?.currentUser?.uid;
  const [user, setUser] = useState();
  const [matchedUser, setMatchedUser] = useState();
  const [incomingChats, setIncomingChats] = useState();
  const [topic, setTopic] = useState();
  const [incomingClicked, setIncomingClicked] = useState(true);
  const [outgoingClicked, setOutgoingClicked] = useState(true);
  const [superswipes, setSuperswipes] = useState();

  const toggleIncomingChatClicked = () => {
    setIncomingClicked(!incomingClicked);
  };

  const toggleOutgoingChatClicked = () => {
    setOutgoingClicked(!outgoingClicked);
  };

  const getTopics = async (topicId) => {
    const q = query(collection(db, "topics"), where("_id", "==", topicId));
    const querySnap = await getDocs(q);
    if (!querySnap.empty) {
      querySnap.forEach((doc) => {
        setTopic(JSON.stringify(doc.data()));
      });
    }
  };

  // const addreq = async () => {
  //   const docRef = doc(db, "users", id);
  //   await updateDoc(docRef, {
  //     incomingChat: arrayUnion({
  //       uid: "Ro0XXWcKdSbTdXLgfhum7kSyZen2",
  //       name: "Emma",
  //       avatar:
  //         "https://robohash.org/732704c87cb5d687a3b8a7bca6f5ee89?set=set4&bgset=&size=400x400",
  //       topicName: "Ageing",
  //       topicId: "6c09f18d-fccd-469d-a6ff-c1af874db66d",
  //       topicIcon: "🕰️",
  //     }),
  //   }).catch((err) => {
  //     console.log(err);
  //   });
  // };

  useFocusEffect(
    React.useCallback(() => {
      getUser();
      getConnections();
    }, [])
  );

  const getUser = async () => {
    let user = await SecureStore.getItemAsync("user");
    if (user) {
      const u = JSON.parse(user);
      setUser(u);
    }
  };

  const getMatch = async () => {
    try {
      const res = await server.getNewChatMatch();
      if (res) {
        setMatchedUser(res.data);
      }
    } catch (error) {
      console.error("Error fetching match:", error);
    }
  };

  const getConnections = async () => {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      docSnap.data()?.connections?.map((connection) => {
        setExtraData(connection.uid);
      });
      setConnections(docSnap.data().connections);
      setSuperswipes(docSnap.data().superswipes);
      if (docSnap.data().newChat) {
        setNewChat(docSnap.data().newChat);
        getTopics(docSnap.data().newChat.topicId);
        getMatch();
      }
      if (docSnap.data().incomingChat) {
        setIncomingChats(docSnap.data().incomingChat);
      }
    }
  };

  // const chat = async (user) => {
  //   console.log(user);
  //   const a = query(
  //     collection(db, "chats"),
  //     or(where("fromUid", "==", id), where("toUid", "==", id))
  //   );
  //   const querySnapshot = await getDocs(a);
  //   let docId;
  //   if (querySnapshot.empty) {
  //     // await setDoc(doc(db, "chats", id + "-" + user.uid), {
  //     //   convo: id + "-" + user.uid,
  //     //   _id: Crypto.randomUUID();
  //     //   fromUid: id,
  //     //   fromName: auth?.currentUser?.displayName,
  //     //   fromAvatar: auth?.currentUser?.photoURL,
  //     //   toUid: user.uid,
  //     //   toName: user.name,
  //     //   toAvatar: user.avatar,
  //     //   lastMessage: "",
  //     //   lastMessageDate: "",
  //     //   createdAt: new Date(),
  //     // });
  //   } else {
  //     querySnapshot.forEach((doc) => {
  //       docId = doc.data().toUid + "-" + id;
  //       if (id == doc.data().toUid) {
  //         docId = doc.data().fromUid + "-" + id;
  //       }
  //     });
  //   }
  //   console.log(docId);
  //   navigation.navigate("Chat", {
  //     chatId: docId,
  //     name: user.name,
  //     avatar: user.avatar,
  //   });
  // };

  // const addConnection = async (user) => {
  //   const docRef = doc(db, "users", id);
  //   await updateDoc(docRef, {
  //     connections: arrayUnion({
  //       uid: user._id,
  //       name: user.name,
  //       avatar: user.avatar,
  //       lastMessage: "",
  //       lastMessageDate: "",
  //     }),
  //   }).catch((err) => {
  //     console.log(err);
  //   });
  // };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      {/* <ScrollView> */}
      <View
        style={{
          margin: 10,
          // height: "100%",
          // flex: 1,
          // alignSelf: "center",
        }}
      >
        <Text
          style={{
            fontSize: 26,
            fontFamily: "OpenSans_700Bold",
          }}
        >
          Connections
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            top: 20,
          }}
        >
          <Image
            source={{ uri: user?.avatar?.toString() }}
            style={{
              width: 84,
              height: 84,
              borderRadius: 42,
            }}
          />
          <MaterialCommunityIcons
            name="star-four-points"
            size={24}
            color="#fcd34d"
            style={{
              position: "absolute",
              left: 60,
              top: 5,
              shadowOpacity: 0,
              zIndex: 1,
            }}
          />
          <MaterialCommunityIcons
            name="star-four-points"
            size={18}
            color="#fcd34d"
            style={{
              position: "absolute",
              left: 77,
              top: 30,
              shadowOpacity: 0,
              zIndex: 1,
            }}
          />
          <MaterialCommunityIcons
            name="star-four-points"
            size={12}
            color="#fcd34d"
            style={{
              position: "absolute",
              left: 47,
              top: 0,
              shadowOpacity: 0,
              zIndex: 1,
            }}
          />
          <View
            style={{
              flexDirection: "column",
              backgroundColor: "#fcd34d",
              padding: 10,
              borderRadius: 20,
              margin: 10,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Montserrat_500Medium",
                lineHeight: 30,
              }}
            >
              Supercharge your profile with boost!
            </Text>
            <Button
              title="Upgrade from £1.99"
              customStyle={{
                backgroundColor: "white",
                paddingVertical: 12,
                width: "auto",
                borderRadius: 50,
                alignSelf: "flex-end",
                margin: 2,
                borderColor: "#0f172a",
                borderWidth: 0.2,
              }}
              customTextStyle={{
                fontFamily: "Montserrat_600SemiBold",
                color: "#000",
              }}
            />
          </View>
        </View>
        {topic && superswipes && !matchedUser ? (
          <View
            style={{
              top: "3%",
              paddingVertical: "2%",
              backgroundColor: "#0f172a",
              borderRadius: 10,
              paddingHorizontal: 10,
            }}
          >
            <TouchableOpacity
              style={{
                // flex: 1,
                flexDirection: "row",
                padding: 10,
                justifyContent: "space-between",
                alignItems: "center",
              }}
              onPress={() => {
                navigation.navigate("NewChatWait", {
                  agePref: newChat.agePref,
                  genderPref: newChat.genderPref,
                  topic: topic,
                });
              }}
            >
              <Text
                style={{
                  fontSize: 36,
                  color: "#fff",
                  fontFamily: "Montserrat_600SemiBold",
                }}
              >
                {JSON.parse(topic).icon}
              </Text>
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    color: "#fff",
                    fontFamily: "Montserrat_600SemiBold",
                  }}
                >
                  {JSON.parse(topic).topicName}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    color: "#fff",
                    fontFamily: "Montserrat_600SemiBold",
                  }}
                >
                  looking for someone new...
                </Text>
              </View>
              <LottieView
                style={{
                  width: 60,
                  padding: 0,
                  margin: 0,
                }}
                autoPlay
                loop
                source={require("../assets/animations/anim.json")}
                accessibilityLabel="Searching animation "
              />
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{
              top: "5%",
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: "2%",
              }}
              onPress={() => toggleIncomingChatClicked()}
            >
              <Text
                style={{
                  fontSize: 20,
                  color: "#0f172a",
                  fontFamily: "Montserrat_500Medium",
                }}
              >
                Incoming chat requests ({incomingChats?.length})
              </Text>
              {incomingClicked ? (
                <Ionicons name="chevron-down-outline" size={24} color="black" />
              ) : (
                <Ionicons name="chevron-up-outline" size={24} color="black" />
              )}
            </TouchableOpacity>
            {incomingClicked &&
              incomingChats?.map((incomingChat) => (
                <View
                  key={incomingChat?.uid}
                  style={{
                    backgroundColor: "#fff",
                    borderColor: "#e2e8f0",
                    borderWidth: 1,
                    borderRadius: 10,
                    paddingHorizontal: 10,
                    margin: 5,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      // justifyContent: "space-evenly",
                      alignItems: "center",
                      paddingVertical: "2%",
                    }}
                    onPress={() => {
                      navigation.navigate("NewChatWaitRequest", {
                        requestUid: incomingChat.uid,
                        topicName: incomingChat.topicName,
                      });
                    }}
                  >
                    <Avatar
                      rounded
                      source={{
                        uri: incomingChat?.avatar,
                      }}
                      size={60}
                    />
                    <View
                      style={{
                        flexDirection: "column",
                        height: 60,
                        justifyContent: "center",
                        left: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          color: "#0f172a",
                          fontFamily: "Montserrat_600SemiBold",
                        }}
                      >
                        {incomingChat?.name} wants to chat about{" "}
                        {incomingChat?.topicName}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: "2%",
              }}
              onPress={() => toggleOutgoingChatClicked()}
            >
              <Text
                style={{
                  fontSize: 20,
                  color: "#0f172a",
                  fontFamily: "Montserrat_500Medium",
                }}
              >
                My chat requests (New)
              </Text>
              {outgoingClicked ? (
                <Ionicons name="chevron-down-outline" size={24} color="black" />
              ) : (
                <Ionicons name="chevron-up-outline" size={24} color="black" />
              )}
            </TouchableOpacity>
            {outgoingClicked && (
              <View
                style={{
                  borderRadius: 10,
                  paddingHorizontal: 10,
                  margin: 5,
                  paddingVertical: "2%",
                  borderColor: "#e2e8f0",
                  borderWidth: 1,
                }}
              >
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  onPress={() => {
                    navigation.navigate("NewChatWait", {
                      agePref: newChat.agePref,
                      genderPref: newChat.genderPref,
                      topic: topic,
                      matchedUser: matchedUser,
                      superswipes,
                    });
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Avatar
                      rounded
                      source={{
                        uri: matchedUser?.avatar,
                      }}
                      size={60}
                    />
                    <Text
                      style={{
                        fontSize: 16,
                        color: "#0f172a",
                        fontFamily: "Montserrat_600SemiBold",
                        left: 15,
                      }}
                    >
                      waiting for {matchedUser?.name}
                    </Text>
                  </View>
                  <LottieView
                    style={{
                      width: 60,
                      padding: 0,
                      margin: 0,
                    }}
                    autoPlay
                    loop
                    source={require("../assets/animations/anim.json")}
                    accessibilityLabel="Searching animation "
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        {connections.length === 0 ? (
          <View
            style={{
              top: "8%",
              height: "100%",
              backgroundColor: "#d4d4d466",
              borderRadius: 10,
              // justifyContent: "center",
              alignItems: "center",
              paddingVertical: "2%",
            }}
          >
            <MaterialIcons name="announcement" size={48} color="#0f172a" />
            <Text
              style={{
                fontSize: 24,
                fontFamily: "Montserrat_600SemiBold",
                lineHeight: 30,
              }}
            >
              That's everyone!
            </Text>
            <Text
              style={{
                fontSize: 20,
                fontFamily: "Montserrat_500Medium",
                lineHeight: 30,
                top: 5,
              }}
            >
              Let's start a new conversation.
            </Text>
            <Button
              title="Chat"
              customStyle={{
                backgroundColor: "#0f172a",
                paddingVertical: 17,
                width: "auto",
                borderRadius: 50,
                top: "7%",
                paddingHorizontal: 40,
              }}
              customTextStyle={{
                fontFamily: "Montserrat_600SemiBold",
                color: "#fff",
                fontSize: 20,
                lineHeight: 20,
              }}
              onPress={() => navigation.navigate("NewChat")}
            />
          </View>
        ) : (
          <View style={{ top: "15%" }}>
            <FlatList
              // style={{ flex: 1 }}
              data={connections}
              extraData={extradata}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    paddingVertical: 15,
                    borderColor: "#d4d4d4",
                    borderWidth: 0.5,
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    width: "40%",
                    borderRadius: 20,
                  }}
                  // onPress={() => chat(item)}
                >
                  <Avatar
                    rounded
                    source={{
                      uri: item.avatar,
                    }}
                    style={{
                      width: 54,
                      height: 54,
                      borderRadius: 27,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 22,
                      fontFamily: "Montserrat_500Medium",
                    }}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
              key={(item) => item._id}
            />
          </View>
        )}
      </View>
      {/* </ScrollView> */}
    </SafeAreaView>
  );
}

export default Connections;
