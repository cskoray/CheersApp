import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { auth, db, doc } from "../../firebase";
import {
  collection,
  getDocs,
  getDoc,
  query,
  updateDoc,
} from "firebase/firestore";
import { MaterialIcons } from "@expo/vector-icons";
import useAuth from "../../auth/useAuth";
import ActivityIndicator from "../../components/ActivityIndicator";
import server from "../../api/server";

const PickTopics = () => {
  const [userTopics, setUserTopics] = useState([]);
  const [allTopics, setAllTopics] = useState([]);
  const [id, setId] = useState();
  const [extradata, setExtraData] = useState();
  const [loding, setLoading] = useState(true);
  const { authUser, setAuthUser } = useAuth();
  const hopId = auth?.currentUser?.uid;
  const usAuth = useAuth();

  const getAllTopics = async () => {
    setLoading(true);
    const q = query(collection(db, "topics"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      if (!isAllTopicIdExists(doc.data())) {
        setAllTopics((topics) => [...topics, doc.data()]);
      }
    });
    setLoading(false);
  };

  function isAllTopicIdExists(id) {
    return allTopics?.some((topic) => id === topic?._id);
  }

  function isTopicIdExists(id) {
    return userTopics?.some((topic) => id === topic?._id);
  }

  const getUserTopics = async () => {
    setLoading(true);
    setUserTopics([]);
    const docRef = doc(db, "users", auth?.currentUser?.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setAuthUser(docSnap.data());
      if (!isTopicIdExists(docSnap.data()?._id)) {
        setUserTopics(docSnap.data().topics);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    setId(hopId);
    setAllTopics([]);

    getAllTopics();
    getUserTopics();
    setLoading(false);
  }, [authUser.step, hopId]);

  const saveUserTopicsFirebase = async () => {
    if (userTopics?.length === 0) {
      alert("Please select at least one topic");
      return;
    }
    await server.setTopics(id, userTopics);
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      usAuth.logIn("user", docSnap.data());
      setAuthUser(docSnap.data());
    }
  };

  const addTopic = async (topicId) => {
    if (!isTopicIdExists(topicId)) {
      setUserTopics((topics) => [...topics, { _id: topicId }]);
      setExtraData(topicId);
    } else {
      setUserTopics((topics) =>
        topics.filter((topic) => topic._id !== topicId)
      );
      setExtraData(topicId);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      {/* <Button title="add" onPress={add} /> */}
      <ActivityIndicator visible={loding} />
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          margin: 10,
        }}
      >
        <View
          style={{
            width: "100%",
            height: 4,
            backgroundColor: "#E5E7EB",
            justifyContent: "center",
          }}
        >
          <View
            style={{ width: "20%", height: 4, backgroundColor: "#0f172a" }}
          ></View>
        </View>
        <View
          style={{
            // flex: 1,
            backgroundColor: "white",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 36,
              fontFamily: "OpenSans_700Bold",
              left: 10,
              top: 5,
            }}
          >
            Pick Topics
          </Text>
          <View
            style={{
              alignItems: "center",
              padding: 10,
            }}
          >
            <Text
              style={{
                fontSize: 17,
                fontFamily: "Montserrat_400Regular",
                lineHeight: 30,
              }}
            >
              Pick up at least one topic you want to chat. It'll help you
              connect with people
            </Text>
          </View>
          <FlatList
            style={{ height: "68%" }}
            numColumns={2}
            data={allTopics}
            extraData={extradata}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  // borderColor: "#E5E7EB",
                  borderWidth: `${isTopicIdExists(item?._id) ? 0 : 1}`,
                  borderRadius: 50,
                  margin: 5,
                  padding: 15,
                  justifyContent: "space-evenly",
                  backgroundColor: `${
                    isTopicIdExists(item?._id) ? "#E5E7EB" : "white"
                  }`,
                  borderColor: `${
                    isTopicIdExists(item?._id) ? "white" : "#E5E7EB"
                  }`,
                }}
                onPress={() => addTopic(item._id)}
              >
                <Text>{item.icon}</Text>
                <Text
                  style={{
                    left: 5,
                  }}
                >
                  {item.topicName}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
        <View style={{ alignItems: "flex-end", padding: 20 }}>
          <TouchableOpacity
            style={{
              padding: 10,
              backgroundColor: "#0f172a",
              borderRadius: 50,
            }}
          >
            <MaterialIcons
              name="navigate-next"
              size={28}
              color="white"
              onPress={saveUserTopicsFirebase}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PickTopics;
