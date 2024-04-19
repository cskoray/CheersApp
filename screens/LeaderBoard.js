import React, { useEffect, useState, useRef } from "react";
import {
  View,
  FlatList,
  Text,
  SafeAreaView,
  Image,
  Animated,
} from "react-native";
import { auth, db, doc } from "../firebase";
import {
  collection,
  getDocs,
  getDoc,
  query,
  updateDoc,
} from "firebase/firestore";
import ActivityIndicator from "../components/ActivityIndicator";
import * as SecureStore from "expo-secure-store";
import { Avatar } from "react-native-elements";
import { useIsFocused } from "@react-navigation/native";
import { Octicons } from "@expo/vector-icons";

const LeaderBoard = () => {
  const [userTopics, setUserTopics] = useState([]);
  const [allTopics, setAllTopics] = useState([]);
  const [id, setId] = useState();
  const [extradata, setExtraData] = useState();
  const [loding, setLoading] = useState(true);
  const hopId = auth?.currentUser?.uid;

  const [animation] = useState(new Animated.Value(0));
  const [key, setKey] = useState(0); // Add a key state
  const isFocused = useIsFocused(); // useIsFocused hook
  const champs = [
    {
      _id: "1",
      name: "John Doe",
      avatar: "https://picsum.photos/200/300?a",
      points: 334,
      rank: "1",
    },
    {
      _id: "2",
      name: "Hallie Berry",
      avatar: "https://picsum.photos/200/300?s",
      points: 320,
      rank: "2",
    },
    {
      _id: "3",
      name: "Natalie Portman",
      avatar: "https://picsum.photos/200/300?d",
      points: 284,
      rank: "3",
    },
    {
      _id: "zQdXh0OECmd63a7BfomTzBbrrFE2",
      name: "You",
      avatar: "https://picsum.photos/200/300?b",
      points: 58,
      rank: "452",
    },
  ];

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
    if (isFocused) {
      setKey((prevKey) => prevKey + 1); // Increment the key to force re-render
    }

    Animated.sequence([
      Animated.timing(animation, {
        toValue: -25,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        toValue: 25,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [hopId, isFocused]);

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
            Champions
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
              Top supporters of our community
            </Text>
          </View>
          <FlatList
            style={{ height: "100%" }}
            data={champs}
            extraData={extradata}
            renderItem={({ item }) => (
              <>
                {hopId && hopId === item._id && (
                  <>
                    <View
                      style={{
                        flex: 1,
                        top: 25,
                        left: 75,
                      }}
                    >
                      <Octicons name="dot-fill" size={10} color="#0f172a" />
                    </View>
                    <View
                      style={{
                        flex: 1,
                        top: 45,
                        left: 75,
                      }}
                    >
                      <Octicons name="dot-fill" size={10} color="#0f172a" />
                    </View>
                    <View
                      style={{
                        flex: 1,
                        top: 65,
                        left: 75,
                      }}
                    >
                      <Octicons name="dot-fill" size={10} color="#0f172a" />
                    </View>
                  </>
                )}
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    top: hopId && hopId === item._id ? 80 : 10,
                    padding: hopId && hopId === item._id ? 15 : 10,
                    // paddingHorizontal: hopId && hopId === item._id ? 10 : 0,
                    backgroundColor:
                      hopId && hopId === item._id ? "#F3F4F6" : "",
                    paddingVertical: 10,
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: "Palanquin_600SemiBold",
                      alignSelf: "center",
                    }}
                  >
                    {item.rank == "1" ? (
                      <Image
                        source={require("../assets/1.png")}
                        style={{ width: 30, height: 30 }}
                      />
                    ) : item.rank == "2" ? (
                      <Image
                        source={require("../assets/2.png")}
                        style={{ width: 30, height: 30 }}
                      />
                    ) : item.rank == "3" ? (
                      <Image
                        source={require("../assets/3.png")}
                        style={{ width: 30, height: 30 }}
                      />
                    ) : (
                      item.rank
                    )}
                  </Text>

                  {hopId === item._id ? (
                    <>
                      <Animated.View
                        style={{
                          left: 10,
                          transform: [{ translateY: animation }],
                        }}
                      >
                        <Avatar
                          rounded
                          source={{
                            uri: item.avatar,
                          }}
                          size={56}
                        />
                      </Animated.View>
                      <Animated.View
                        style={{
                          flex: 1,
                          justifyContent: "center",
                          transform: [{ translateY: animation }],
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 18,
                            left: 25,
                            fontFamily: "Palanquin_600SemiBold",
                            top: 10,
                          }}
                        >
                          {hopId && hopId === item._id ? "(You)" : item.name}
                        </Text>
                        <Text
                          style={{
                            right: 10,
                            color: "#4b5563",
                            fontFamily: "Palanquin_600SemiBold",
                            fontSize: 18,
                            alignSelf: "flex-end",
                            bottom: 20,
                          }}
                        >
                          {item.points} points
                        </Text>
                      </Animated.View>
                    </>
                  ) : (
                    <>
                      <View style={{ left: 10 }}>
                        <Avatar
                          rounded
                          source={{
                            uri: item.avatar,
                          }}
                          size={56}
                        />
                      </View>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 18,
                            left: 25,
                            fontFamily: "Palanquin_600SemiBold",
                            top: 10,
                          }}
                        >
                          {hopId && hopId === item._id ? "(You)" : item.name}
                        </Text>
                        <Text
                          style={{
                            right: 10,
                            color: "#4b5563",
                            fontFamily: "Palanquin_600SemiBold",
                            fontSize: 18,
                            alignSelf: "flex-end",
                            bottom: 20,
                          }}
                        >
                          {item.points} points
                        </Text>
                      </View>
                    </>
                  )}
                </View>
              </>
            )}
            key={(item) => item._id}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LeaderBoard;
