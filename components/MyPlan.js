import React, { useState } from "react";
import Button from "./Button";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

const MyPlan = ({ user, userTopics, extradata }) => {
  const [selectedAdvantage, setSelectedAdvantage] = useState(0);

  const advantages = [
    {
      id: 1,
      title: "Fast track your chat requests",
      description: "Get your profile seen by more people.",
    },
    {
      id: 2,
      title: "Standout from the crowd",
      description: "Get your profile seen by more people.",
    },
    {
      id: 3,
      title: "Unlimited connections",
      description: "Connect with more compatible people.",
    },
    {
      id: 4,
      title: "Advanced filters",
      description: "Find the right people for you.",
    },
    {
      id: 5,
      title: "Free boost every week",
      description: "Boost your profile to chat more.",
    },
  ];

  const popUp = () => {};

  return (
    <View style={{ height: "100%" }}>
      <ScrollView style={{ flex: 1 }}>
        <TouchableOpacity
          style={{
            width: "100%",
          }}
        >
          <LinearGradient
            colors={["#fef3c7", "#fcd34d", "#fef3c7"]}
            locations={[0.2, 0.5, 0.8]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              flexDirection: "column",
              borderRadius: 20,
              margin: 10,
              borderColor: "#0f172a",
              borderWidth: 0.2,
            }}
          >
            <View
              style={{
                flexDirection: "column",
                padding: "2%",
                borderRadius: 20,
                margin: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 26,
                  fontFamily: "Palanquin_600SemiBold",
                  lineHeight: 30,
                  alignSelf: "center",
                }}
              >
                Cheerapp Gold
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: "Palanquin_500Medium",
                  lineHeight: 30,
                  textAlign: "center",
                }}
              >
                Get the Gold treatment, connect with amazing people and enjoy
                supercharged profile.
              </Text>
              <Button
                title="Upgrade from £9.99"
                customStyle={{
                  backgroundColor: "#fef3c7",
                  paddingVertical: 12,
                  borderRadius: 50,
                  alignSelf: "center",
                  margin: 2,
                  borderColor: "#0f172a",
                  borderWidth: 0.2,
                  width: "60%",
                }}
                customTextStyle={{
                  fontFamily: "Montserrat_600SemiBold",
                  color: "#000",
                }}
              />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <View style={{}}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 10,
            }}
          >
            <Text
              style={{
                fontSize: 22,
                fontFamily: "Palanquin_600SemiBold",
                lineHeight: 30,
                alignSelf: "flex-start",
                top: 10,
              }}
            >
              Advantages
            </Text>
            <Text
              style={{
                fontSize: 22,
                fontFamily: "Palanquin_600SemiBold",
                lineHeight: 30,
                alignSelf: "flex-end",
                top: 10,
              }}
            >
              Gold
            </Text>
          </View>
          <View style={{ top: 10 }}>
            {advantages.map((advantage) => (
              <View
                key={advantage.id}
                style={{
                  flexDirection: "row",
                  borderBottomWidth: 0.2,
                  borderColor: "gray",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  style={{ flexDirection: "row", justifyContent: "flex-start" }}
                  onPress={() => setSelectedAdvantage(advantage.id)}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: "Palanquin_500Medium",
                      lineHeight: 30,
                      alignSelf: "flex-start",
                      margin: 10,
                    }}
                  >
                    {advantage.title}
                  </Text>
                  {selectedAdvantage === advantage.id && (
                    <View
                      style={{
                        position: "absolute",
                        backgroundColor: "#0f172a",
                        padding: 15,
                        borderTopEndRadius: 10,
                        borderTopLeftRadius: 10,
                        borderBottomRightRadius: 10,
                        zIndex: 999,
                        elevation: 5,
                        bottom: 30,
                        left: "50%",
                        width: "100%",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 16,
                            fontFamily: "Palanquin_600SemiBold",
                            color: "white",
                          }}
                        >
                          {advantage.title}
                        </Text>
                        <AntDesign
                          name="closecircleo"
                          size={24}
                          color="white"
                          style={{
                            alignSelf: "flex-end",
                          }}
                          onPress={() => setSelectedAdvantage(0)}
                        />
                      </View>
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: "Palanquin_500Medium",
                          color: "white",
                        }}
                      >
                        {advantage.description}
                      </Text>
                    </View>
                  )}
                  <Feather
                    name="info"
                    size={15}
                    color="#0f172a"
                    style={{ alignSelf: "center" }}
                  />
                </TouchableOpacity>
                <FontAwesome
                  name="check"
                  size={20}
                  color="#0f172a"
                  style={{ alignSelf: "center", right: 15 }}
                />
              </View>
            ))}
          </View>
        </View>
        <View style={{ height: 100, width: "100%" }}></View>
      </ScrollView>
    </View>
  );
};

export default MyPlan;
