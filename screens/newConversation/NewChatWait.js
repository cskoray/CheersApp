import React from "react";
import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Button from "../../components/Button";
import { MaterialIcons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import DynamicBorderColorImage from "../../components/DynamicBorderColorImage";
import { FontAwesome5 } from "@expo/vector-icons";

const NewChatWait = ({ route, navigation }) => {
  const { agePref, genderPref, topic, matchedUser, superswipes } = route.params;

  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <View
        style={{
          // flex: 1,
          backgroundColor: matchedUser ? "white" : "#94a3b8",
          justifyContent: !matchedUser ? "space-evenly" : null,
          paddingVertical: !matchedUser && "5%",
          height: matchedUser && "95%",
        }}
      >
        {matchedUser && (
          <View
            style={{
              backgroundColor: "#fcd34d",
              height: "30%",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              top: 0,
            }}
          >
            <Text
              style={{
                fontSize: 26,
                fontFamily: "Montserrat_600SemiBold",
                color: "#0f172a",
                alignSelf: "center",
                top: 10,
              }}
            >
              {"waiting " + matchedUser.name + " to accept..."}
            </Text>
            <DynamicBorderColorImage
              imageUrl={matchedUser?.avatar?.toString()}
            />
          </View>
        )}
        {!matchedUser && (
          <View
            style={{
              padding: 20,
              // justifyContent: "space-between",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <MaterialIcons name="person-search" size={48} color="#0f172a" />
            <Text
              style={{
                fontSize: 26,
                fontFamily: "Montserrat_600SemiBold",
                color: "#0f172a",
              }}
            >
              "looking for someone new..."
            </Text>
          </View>
        )}
        {genderPref && agePref && topic && !matchedUser ? (
          <>
            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: "Montserrat_600SemiBold",
                  color: "#0f172a",
                  lineHeight: 30,
                }}
              >
                a {genderPref} between {agePref} of age{" "}
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: "Montserrat_600SemiBold",
                  color: "#0f172a",
                }}
              >
                to chat about
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: "Montserrat_600SemiBold",
                  color: "#0f172a",
                }}
              >
                {JSON.parse(topic).topicName}
                {JSON.parse(topic).icon}
              </Text>
            </View>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                height: "50%",
              }}
            >
              <LottieView
                autoPlay
                loop
                source={require("../../assets/animations/anim.json")}
                accessibilityLabel="Searching animation"
              />
            </View>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 26,
                  fontFamily: "Montserrat_600SemiBold",
                  color: "#0f172a",
                }}
              >
                We got you!
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: "Montserrat_600SemiBold",
                  color: "#0f172a",
                }}
              >
                but sometimes takes a while
              </Text>
              <Button
                title="My connections"
                customStyle={{
                  backgroundColor: "#0f172a",
                  width: "70%",
                  borderRadius: 15,
                  top: 15,
                }}
                customTextStyle={{
                  color: "#fff",
                  fontFamily: "Montserrat_600SemiBold",
                  fontSize: 20,
                }}
                onPress={() => navigation.navigate("Connections")}
              />
            </View>
          </>
        ) : (
          <View
            style={{
              height: "70%",
              alignItems: "center",
            }}
          >
            <View
              style={{
                height: "90%",
                paddingTop: "10%",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons
                name="star-circle"
                size={54}
                color="#fcd34d"
              />
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: "Montserrat_600SemiBold",
                  color: "#0f172a",
                }}
              >
                Superswipe to your next favorite person
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Montserrat_500Medium",
                  color: "#0f172a",
                  textAlign: "center",
                  paddingVertical: 5,
                  paddingHorizontal: "15%",
                  lineHeight: 25,
                }}
              >
                we encourage you to give some time to your potential connection
                to accept.
              </Text>
              <View
                style={{
                  width: 200,
                  height: 200,
                  backgroundColor: "#f5f5f4",
                  borderWidth: 1,
                  borderColor: "#d6d3d1",
                  borderRadius: 10,
                  marginTop: 20,
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "#0f172a",
                      paddingHorizontal: 20,
                      paddingVertical: 5,
                      borderRadius: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        fontFamily: "Montserrat_500Medium",
                        color: "white",
                      }}
                    >
                      FREE
                    </Text>
                  </View>
                  <View style={{ top: 20, alignItems: "center" }}>
                    <Text
                      style={{
                        fontSize: 38,
                        fontFamily: "Montserrat_600SemiBold",
                        color: "#0f172a",
                      }}
                    >
                      {superswipes}
                    </Text>
                    <Text
                      style={{
                        fontSize: 24,
                        fontFamily: "Montserrat_600SemiBold",
                        color: "#0f172a",
                      }}
                    >
                      Superswipes
                    </Text>
                  </View>
                </View>
                <FontAwesome5
                  name="exchange-alt"
                  size={34}
                  color="black"
                  style={{ top: "20%" }}
                />
              </View>
            </View>
            <Button
              title="My connections"
              customStyle={{
                backgroundColor: "#0f172a",
                width: "70%",
                borderRadius: 15,
              }}
              customTextStyle={{
                color: "#fff",
                fontFamily: "Montserrat_600SemiBold",
                fontSize: 20,
              }}
              onPress={() => navigation.navigate("Connections")}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default NewChatWait;
