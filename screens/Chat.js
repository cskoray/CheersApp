import React, { useCallback, useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Avatar } from "react-native-elements";
import { auth, db, doc } from "../firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  where,
  updateDoc,
} from "firebase/firestore";
import {
  GiftedChat,
  Bubble,
  InputToolbar,
  Send,
} from "react-native-gifted-chat";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const Chat = ({ navigation, route }) => {
  const { convo, name, avatar } = route.params;
  const [messages, setMessages] = useState([]);
  const settings = () => {};
  const back = () => {
    navigation.navigate({ name: "Chats", params: { returned: true } });
  };
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: { borderBottomWidth: 1, borderBottomColor: "#e5e7eb" },
      title: "",
      headerLeft: () => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            paddingLeft: 10,
            alignItems: "center",
          }}
        >
          <Ionicons
            name="chevron-back-outline"
            size={24}
            color="#0f172a"
            onPress={back}
          />
          <View
            style={{
              left: 40,
              flex: 1,
              flexDirection: "row",
            }}
          >
            <Avatar
              rounded
              source={{
                uri: avatar,
              }}
            />
            <Text
              style={{
                fontSize: 24,
                alignSelf: "center",
                left: 10,
                color: "#4b5563",
                fontFamily: "Montserrat_500Medium",
              }}
            >
              {name}
            </Text>
          </View>
        </View>
      ),
      headerRight: () => (
        <TouchableOpacity
          style={{
            marginRight: 10,
          }}
          onPress={settings}
        >
          <MaterialCommunityIcons
            name="dots-vertical"
            size={24}
            color="#0f172a"
            style={{ right: 10 }}
          />
        </TouchableOpacity>
      ),
    });

    const q = query(
      collection(db, "messages"),
      where("convo", "==", convo),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) =>
      setMessages(
        snapshot.docs.map((doc) => ({
          _id: doc.data()._id,
          convo: doc.data().convo,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user,
        }))
      )
    );

    return () => {
      unsubscribe();
    };
  }, [navigation, auth.currentUser]);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );

    const { _id, createdAt, text, user } = messages[0];

    addDoc(collection(db, "messages"), {
      _id,
      convo,
      createdAt,
      text,
      user,
    });
    editLastMsgAndDate(text);
  }, []);

  const editLastMsgAndDate = async (msg) => {
    const docRef = doc(db, "chats", convo);
    await updateDoc(docRef, {
      lastMessage: msg,
      lastMessageDate: new Date(),
    }).catch((err) => {
      console.log(err);
    });
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        textStyle={{
          right: {
            color: "white",
            fontFamily: "OpenSans_400Regular",
            fontSize: 18,
            padding: 5,
          },
          left: {
            color: "#0f172a",
            fontFamily: "OpenSans_400Regular",
            fontSize: 18,
            padding: 5,
          },
        }}
        wrapperStyle={{
          right: { backgroundColor: "#01644f", padding: 3 },
          left: { backgroundColor: "#e2e8f0", padding: 3 },
        }}
      />
    );
  };

  const MessengerBarContainer = (props) => {
    return (
      <InputToolbar
        {...props}
        placeholderTextColor="#9ca3af"
        placeholder="Type your message here..."
        containerStyle={{
          backgroundColor: "#fff",
          borderColor: "#e5e7eb",
          borderWidth: 0.5,
          borderRadius: 82,
          height: 35,
          marginHorizontal: 8,
          bottom: 3,
        }}
      />
    );
  };

  const renderSend = (props) => {
    return (
      <Send {...props} containerStyle={{ right: 3, bottom: 3 }}>
        <View style={{ height: "100%" }}>
          <MaterialCommunityIcons name="send-circle" size={40} color="green" />
        </View>
      </Send>
    );
  };

  return (
    <View style={{ flex: 1, paddingBottom: 45 }}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderInputToolbar={(props) => MessengerBarContainer(props)}
        renderSend={renderSend}
        renderAvatar={null}
        bottomOffset={48}
        placeholder=""
        showAvatarForEveryMessage={true}
        onSend={(msg) => onSend(msg)}
        user={{
          _id: auth?.currentUser?.email,
          name: auth?.currentUser?.displayName,
          avatar: auth?.currentUser?.photoURL,
        }}
      />
    </View>
  );
};

export default Chat;
