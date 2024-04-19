import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { auth, db, doc } from "../../firebase";
import { collection, getDocs, query } from "firebase/firestore";
import Button from "../../components/Button";
import { MaterialIcons } from "@expo/vector-icons";
import server from "../../api/server";

const NewChat = ({ navigation }) => {
  const [positiveTopics, setPositiveTopics] = useState([]);
  const [negativeTopics, setNegativeTopics] = useState([]);
  const [loding, setLoading] = useState(true);
  const [newChatSubmitted, setNewChatSubmitted] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState();
  const [selectedGender, setSelectedGender] = useState();
  const [selectedAge, setSelectedAge] = useState();
  const identities = ["Woman", "Man", "Nonbinary", "No Preference"];
  const ages = ["18-25", "26-35", "36-45", "46-55", "56-65", "65-74", "75+"];

  const [mood, setMood] = useState("positive");
  const [currentStep, setCurrentStep] = useState(0);
  const [newChat, setNewChat] = useState({
    id: auth?.currentUser?.uid,
    topic: "",
    genderPref: "",
    agePref: "",
  });
  const steps = ["topic", "genderPref", "agePref"];

  const getAllTopics = async () => {
    setLoading(true);
    const q = query(collection(db, "topics"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      if (doc.data().type === "positive") {
        if (!isAllTopicIdExists(positiveTopics, doc.data()._id)) {
          setPositiveTopics((topics) => [...topics, doc.data()]);
        }
      } else {
        if (!isAllTopicIdExists(negativeTopics, doc.data()._id)) {
          setNegativeTopics((topics) => [...topics, doc.data()]);
        }
      }
    });
    setLoading(false);
  };

  function isAllTopicIdExists(list, id) {
    return list?.some((topic) => id === topic?._id);
  }

  useEffect(() => {
    getAllTopics();
  }, []);

  const pickTopic = (item) => {
    setSelectedTopic(item);
  };

  const startNewChat = async () => {
    setNewChatSubmitted(true);
    const res = await server.newChat(newChat);
    navigation.navigate("NewChatWait", { newChat });
  };

  const renderStep = () => {
    switch (steps[currentStep]) {
      case "topic":
        return (
          <View
            style={{
              width: "100%",
              height: "100%",
              alignItems: "center",
              top: 20,
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontFamily: "Montserrat_600SemiBold",
                top: 15,
              }}
            >
              Let's pick a topic for your mood?
            </Text>
            <View
              style={{
                flexDirection: "row",
                padding: 30,
                justifyContent: "space-between",
                width: "65%",
              }}
            >
              <TouchableOpacity
                activeOpacity={1}
                style={{
                  padding: 15,
                  backgroundColor: mood === "positive" ? "#fcd34d" : "#ccc9c7",
                  borderRadius: 10,
                }}
                onPress={() => setMood("positive")}
              >
                <Fontisto name="day-sunny" size={24} color="#0f172a" />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1}
                style={{
                  padding: 15,
                  backgroundColor: mood === "negative" ? "#fcd34d" : "#ccc9c7",
                  borderRadius: 10,
                }}
                onPress={() => setMood("negative")}
              >
                <Ionicons name="rainy-outline" size={24} color="#0f172a" />
              </TouchableOpacity>
            </View>
            <FlatList
              style={{
                height: "64%",
                width: "100%",
                flexWrap: "wrap",
              }}
              numColumns={3}
              horizontal={false}
              data={mood === "positive" ? positiveTopics : negativeTopics}
              extraData={mood}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) =>
                item.type === mood ? (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      borderWidth: 1,
                      borderRadius: 50,
                      margin: 5,
                      padding: 12,
                      justifyContent: "space-evenly",
                      backgroundColor:
                        selectedTopic && selectedTopic._id === item._id
                          ? "#fcd34d"
                          : "white",
                      borderColor: "#E5E7EB",
                    }}
                    onPress={() => pickTopic(item)}
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
                ) : null
              }
            />
            {selectedTopic && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  width: "100%",
                  padding: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    backgroundColor: "#E5E7EB",
                    borderRadius: 50,
                    borderColor: "#ccc9c7",
                    borderWidth: 1,
                    margin: 35,
                    padding: 15,
                    flex: 1,
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: "Montserrat_600SemiBold",
                    }}
                  >
                    {selectedTopic.topicName}
                  </Text>
                </View>
                <AntDesign
                  name="rightcircle"
                  size={50}
                  color="#0f172a"
                  style={{
                    alignSelf: "center",
                    left: 20,
                  }}
                  onPress={() => {
                    if (currentStep < steps.length - 1) {
                      newChat.topic = selectedTopic._id;
                      setNewChat(newChat);
                      setCurrentStep(currentStep + 1);
                    }
                  }}
                />
              </View>
            )}
          </View>
        );
      case "genderPref":
        return (
          <View
            style={{
              width: "100%",
              height: "100%",
              alignItems: "center",
              top: 20,
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontFamily: "Montserrat_500Medium",
                top: 15,
              }}
            >
              Chat about {selectedTopic.topicName}
              {selectedTopic.icon}
            </Text>
            <View
              style={{
                top: "5%",
                width: "100%",
                alignItems: "center",
                flex: 1,
              }}
            >
              <Text
                style={{
                  fontSize: 24,
                  fontFamily: "Montserrat_600SemiBold",
                  top: 15,
                }}
              >
                Who would you prefer?
              </Text>
              {identities?.map((identity, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={{
                    padding: 20,
                    borderColor: "#d6d3d1",
                    borderWidth: 1,
                    borderRadius: 5,
                    margin: 10,
                    backgroundColor:
                      selectedGender && selectedGender === identity
                        ? "#E5E7EB"
                        : "white",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "70%",
                    top: 20,
                  }}
                  onPress={
                    selectedGender && selectedGender === identity
                      ? null
                      : () => setSelectedGender(identity)
                  }
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: "Montserrat_500Medium",
                      lineHeight: 30,
                    }}
                  >
                    {identity}
                  </Text>
                  {selectedGender === identity ? (
                    <Ionicons
                      name="radio-button-on"
                      size={24}
                      color="#0f172a"
                    />
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
            {selectedGender && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  width: "100%",
                  padding: 10,
                }}
              >
                <AntDesign
                  name="rightcircle"
                  size={50}
                  color="#0f172a"
                  style={{
                    alignSelf: "center",
                    bottom: 40,
                    left: 20,
                  }}
                  onPress={() => {
                    if (currentStep < steps.length - 1) {
                      newChat.genderPref = selectedGender;
                      setNewChat(newChat);
                      setCurrentStep(currentStep + 1);
                    }
                  }}
                />
              </View>
            )}
          </View>
        );
      case "agePref":
        return (
          <View
            style={{
              width: "100%",
              height: "100%",
              alignItems: "center",
            }}
          >
            <View
              style={{
                top: "5%",
                width: "100%",
                alignItems: "center",
                flex: 1,
              }}
            >
              <Text
                style={{
                  fontSize: 24,
                  fontFamily: "Montserrat_600SemiBold",
                  top: 15,
                }}
              >
                Which age group would you prefer?
              </Text>
              {ages?.map((age, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={{
                    padding: 10,
                    borderColor: "#d6d3d1",
                    borderWidth: 1,
                    borderRadius: 5,
                    margin: 5,
                    backgroundColor:
                      selectedAge && selectedAge === age ? "#E5E7EB" : "white",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "70%",
                    top: 20,
                  }}
                  onPress={
                    selectedAge && selectedAge === age
                      ? null
                      : () => {
                          newChat.agePref = age;
                          setNewChat(newChat);
                          setSelectedAge(age);
                        }
                  }
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: "Montserrat_500Medium",
                      lineHeight: 30,
                    }}
                  >
                    {age}
                  </Text>
                  {selectedAge === age ? (
                    <Ionicons
                      name="radio-button-on"
                      size={24}
                      color="#0f172a"
                    />
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
            {selectedAge && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  width: "100%",
                  padding: 10,
                }}
              >
                <Button
                  disabled={newChatSubmitted}
                  title="Start chat"
                  customStyle={{
                    backgroundColor: "#0f172a",
                    paddingVertical: 17,
                    width: "auto",
                    borderRadius: 50,
                    paddingHorizontal: 40,
                    alignSelf: "center",
                    bottom: 20,
                    left: 20,
                  }}
                  customTextStyle={{
                    fontFamily: "Montserrat_600SemiBold",
                    color: "white",
                    fontSize: 22,
                    lineHeight: 20,
                  }}
                  onPress={startNewChat}
                />
              </View>
            )}
          </View>
        );
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      <View
        style={{
          backgroundColor: "#fcd34d",
          height: "20%",
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
          <View style={{ flexDirection: "row" }}>
            <MaterialCommunityIcons
              name="new-box"
              size={30}
              color="#0f172a"
              style={{ alignSelf: "flex-end", bottom: 4 }}
            />
            <Text
              style={{
                fontSize: 46,
                fontFamily: "Montserrat_500Medium",
                color: "#0f172a",
                left: 5,
                alignSelf: "flex-start",
              }}
            >
              chat
            </Text>
          </View>
          <MaterialIcons
            name="cancel"
            size={36}
            color="#0f172a"
            onPress={() => navigation.goBack()}
          />
        </View>
        <Text
          style={{
            fontSize: 22,
            fontFamily: "Montserrat_500Medium",
            color: "#0f172a",
            alignSelf: "center",
          }}
        >
          Find someone new to chat!
        </Text>
      </View>
      <View
        style={{
          alignItems: "center",
          flex: 1,
          padding: 20,
          margin: 5,
        }}
      >
        <View style={{ alignContent: "center", width: "100%" }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "50%",
              alignSelf: "center",
            }}
          >
            <View
              style={{
                width: steps[currentStep] === "topic" ? 12 : 8,
                height: steps[currentStep] === "topic" ? 12 : 8,
                borderRadius: 20,
                backgroundColor:
                  steps[currentStep] === "topic" ? "#0f172a" : "#b6b3b1",
              }}
            ></View>
            <View
              style={{
                width: steps[currentStep] === "genderPref" ? 12 : 8,
                height: steps[currentStep] === "genderPref" ? 12 : 8,
                borderRadius: 20,
                backgroundColor:
                  steps[currentStep] === "genderPref" ? "#0f172a" : "#b6b3b1",
              }}
            ></View>
            <View
              style={{
                width: steps[currentStep] === "agePref" ? 12 : 8,
                height: steps[currentStep] === "agePref" ? 12 : 8,
                borderRadius: 20,
                backgroundColor:
                  steps[currentStep] === "agePref" ? "#0f172a" : "#b6b3b1",
              }}
            ></View>
          </View>
        </View>
        {renderStep()}

        {steps[currentStep] !== "topic" && (
          <AntDesign
            name="leftcircle"
            size={50}
            color="#0f172a"
            style={{
              position: "absolute",
              top: "93%",
              alignSelf: "flex-start",
            }}
            onPress={() => {
              if (currentStep > 0) {
                setCurrentStep(currentStep - 1);
              }
            }}
          />
        )}
      </View>
    </View>
  );
};

export default NewChat;

// const tt = [
//   { topicName: "Social Media", icon: "📱", type: "negative" },
//   { topicName: "Work-Life", icon: "⚖️", type: "negative" },
//   { topicName: "Financial Strain", icon: "💸", type: "negative" },
//   { topicName: "Loneliness", icon: "😔", type: "negative" },
//   { topicName: "Body Image", icon: "👤", type: "negative" },
//   { topicName: "Uncertain Future", icon: "🌐", type: "negative" },
//   { topicName: "Relationships", icon: "❤️", type: "negative" },
//   { topicName: "Health Anxiety", icon: "🤒", type: "negative" },
//   { topicName: "Trauma", icon: "💔", type: "negative" },
//   { topicName: "Political Turmoil", icon: "🌍", type: "negative" },
//   { topicName: "Tech Addiction", icon: "📵", type: "negative" },
//   { topicName: "Parenting", icon: "👶", type: "negative" },
//   { topicName: "Education", icon: "🎓", type: "negative" },
//   { topicName: "Ageing", icon: "🕰️", type: "negative" },
//   { topicName: "Digital Overload", icon: "💻", type: "negative" },
//   { topicName: "Cultural Struggles", icon: "🌐", type: "negative" },
//   { topicName: "Sleep Deprivation", icon: "😴", type: "negative" },
//   { topicName: "Perfectionism", icon: "🎯", type: "negative" },
//   { topicName: "Environment", icon: "🌱", type: "negative" },
//   { topicName: "Substance Abuse", icon: "🚬", type: "negative" },
//   { topicName: "Exploration", icon: "🌍", type: "positive" },
//   { topicName: "Serenity", icon: "🌳", type: "positive" },
//   { topicName: "Wellness", icon: "💪", type: "positive" },
//   { topicName: "Connection", icon: "💬", type: "positive" },
//   { topicName: "Creativity", icon: "🎨", type: "positive" },
//   { topicName: "Innovation", icon: "🚀", type: "positive" },
//   { topicName: "Mindfulness", icon: "🧘", type: "positive" },
//   { topicName: "Inspiration", icon: "📖", type: "positive" },
//   { topicName: "Joy", icon: "😄", type: "positive" },
//   { topicName: "Nourishment", icon: "🥗", type: "positive" },
//   { topicName: "Companionship", icon: "🐾", type: "positive" },
//   { topicName: "Positivity", icon: "🌟", type: "positive" },
//   { topicName: "Gaming", icon: "🎮", type: "positive" },
//   { topicName: "Fitness", icon: "🏋️‍♂️", type: "positive" },
//   { topicName: "Adventure", icon: "✈️", type: "positive" },
//   { topicName: "Movies", icon: "🎬", type: "positive" },
//   { topicName: "Fashion", icon: "👗", type: "positive" },
//   { topicName: "Dance", icon: "💃", type: "positive" },
//   { topicName: "Music", icon: "🎵", type: "positive" },
//   { topicName: "Books", icon: "📚", type: "positive" },
// ];
