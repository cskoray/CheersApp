import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { auth, db, doc } from "../firebase";
import {
  collection,
  getDocs,
  getDoc,
  query,
  updateDoc,
} from "firebase/firestore";
import { MaterialIcons } from "@expo/vector-icons";
import ActivityIndicator from "../components/ActivityIndicator";
import * as SecureStore from "expo-secure-store";

const Topics = () => {
  const [userTopics, setUserTopics] = useState([]);
  const [allTopics, setAllTopics] = useState([]);
  const [id, setId] = useState();
  const [extradata, setExtraData] = useState();
  const [loding, setLoading] = useState(true);
  const hopId = auth?.currentUser?.uid;

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
    let idToken = await SecureStore.getItemAsync("token");
    // if (idToken) {
    //   console.log("appJS-token=", idToken);
    // }
    setLoading(true);
    setUserTopics([]);
    const docRef = doc(db, "users", auth?.currentUser?.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      if (!isTopicIdExists(docSnap.data()?._id)) {
        setUserTopics(docSnap.data().topics);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    setId(hopId);
    // setUserTopics([]);
    setAllTopics([]);

    getAllTopics();
    getUserTopics();
    if (userTopics?.length > 0) {
      // navigation.navigate("Picture");
    }
    setLoading(false);
  }, [hopId]);

  // const tt = [
  //   { topicName: "Social Media Comparison", icon: "📱" },
  //   { topicName: "Work-Life Imbalance", icon: "⚖️" },
  //   { topicName: "Financial Strain", icon: "💸" },
  //   { topicName: "Loneliness and Isolation", icon: "😔" },
  //   { topicName: "Body Image Pressures", icon: "👤" },
  //   { topicName: "Uncertain Future", icon: "🌐" },
  //   { topicName: "Relationship Challenges", icon: "❤️" },
  //   { topicName: "Health Anxiety", icon: "🤒" },
  //   { topicName: "Trauma and Past Experiences", icon: "💔" },
  //   { topicName: "Political Turmoil", icon: "🌍" },
  //   { topicName: "Technology Addiction", icon: "📵" },
  //   { topicName: "Parenting Stress", icon: "👶" },
  //   { topicName: "Educational Pressure", icon: "🎓" },
  //   { topicName: "Ageing and Isolation", icon: "🕰️" },
  //   { topicName: "Digital Overload", icon: "💻" },
  //   { topicName: "Cultural Identity Struggles", icon: "🌐" },
  //   { topicName: "Sleep Deprivation", icon: "😴" },
  //   { topicName: "Perfectionism", icon: "🎯" },
  //   { topicName: "Environmental Concerns", icon: "🌱" },
  //   { topicName: "Substance Abuse and Addiction", icon: "🚬" },
  // ];

  // const add = async () => {
  //   tt.map((topic) => {
  //     addDoc(collection(db, "topics"), {
  //       _id: Crypto.randomUUID(),
  //       topicName: topic.topicName,
  //       icon: topic.icon,
  //     });
  //   });
  // };

  const deleteAllUserTopicsFirebase = async () => {
    const docRef = doc(db, "users", id);
    await updateDoc(docRef, {
      topics: [],
    }).catch((err) => {
      console.log(err);
    });
  };

  const saveUserTopicsFirebase = async () => {
    deleteAllUserTopicsFirebase();
    if (userTopics?.length === 0) {
      alert("Please select at least one topic");
      return;
    }
    const docRef = doc(db, "users", id);
    await updateDoc(docRef, {
      topics: userTopics,
    }).catch((err) => {
      console.log(err);
    });
    // navigation.navigate("Picture");
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
        {userTopics?.length === 0 && (
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
        )}
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
            Topics
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

export default Topics;
