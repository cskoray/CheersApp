import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Button from "../components/Button";
import { View, Text, FlatList, TouchableOpacity } from "react-native";

const AboutMe = ({ user, userTopics, userInterests, extradata }) => {
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        left: "2%",
      }}
    >
      <View
        style={{
          backgroundColor: "white",
          paddingHorizontal: 10,
          width: "100%",
          marginTop: "3%",
        }}
      >
        <Text
          style={{
            fontFamily: "Palanquin_500Medium",
            fontSize: 22,
            color: "gray",
          }}
        >
          About me
        </Text>
        <View
          style={{
            width: "90%",
          }}
        >
          <Text
            style={{
              fontFamily: "Palanquin_500Medium",
              fontSize: 19,
              color: "#0f172a",
              marginLeft: "2%", // Adjust left margin as needed
              marginRight: "2%", // Adjust right margin as needed
              textAlign: "left",
              textAlignVertical: "center",
            }}
          >
            {user?.bio ? user.bio : "Add a bio to your profile"}
          </Text>
        </View>
      </View>
      <View
        style={{
          backgroundColor: "white",
          paddingHorizontal: 10,
          width: "100%",
          marginTop: "3%",
        }}
      >
        <Text
          style={{
            fontFamily: "Palanquin_500Medium",
            fontSize: 22,
            color: "gray",
          }}
        >
          My chat topics
        </Text>
        <FlatList
          horizontal={true}
          data={userTopics}
          extraData={extradata}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                flexDirection: "row",
                borderColor: "#E5E7EB",
                borderWidth: 1,
                borderRadius: 50,
                margin: 5,
                paddingHorizontal: 15,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>{item.icon}</Text>
              <Text
                style={{
                  left: 5,
                  fontFamily: "Palanquin_500Medium",
                  fontSize: 16,
                }}
              >
                {item.topicName}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <View
        style={{
          backgroundColor: "white",
          paddingHorizontal: 10,
          width: "100%",
          marginTop: "3%",
        }}
      >
        <Text
          style={{
            fontFamily: "Palanquin_500Medium",
            fontSize: 22,
            color: "gray",
          }}
        >
          My Interests
        </Text>
        <FlatList
          horizontal={true}
          data={userInterests}
          extraData={extradata}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                flexDirection: "row",
                borderColor: "#E5E7EB",
                borderWidth: 1,
                borderRadius: 50,
                margin: 5,
                paddingHorizontal: 15,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>{item.icon}</Text>
              <Text
                style={{
                  left: 5,
                  fontFamily: "Palanquin_500Medium",
                  fontSize: 16,
                }}
              >
                {item.interestName}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <View
        style={{
          backgroundColor: "white",
          paddingHorizontal: 10,
          width: "100%",
          alignItems: "center",
          height: "28%",
          top: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <MaterialCommunityIcons
            name="lightning-bolt"
            size={24}
            color="#dc2626"
          />
          <Text
            style={{
              fontFamily: "Palanquin_500Medium",
              fontSize: 25,
              color: "#475569",
            }}
          >
            Get More Connections
          </Text>
        </View>
        <View
          style={{
            width: "60%",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "Palanquin_500Medium",
              fontSize: 17,
              color: "gray",
              left: "5%",
            }}
          >
            Boost your profile!
          </Text>
        </View>
        <Button
          title="Get Cheerapp Gold"
          customStyle={{
            backgroundColor: "#fcd34d",
            width: "60%",
            borderRadius: 50,
            left: "3%",
          }}
          customTextStyle={{
            color: "#000",
            fontFamily: "Montserrat_600SemiBold",
          }}
          // onPress={() => navigation.navigate("Register")}
        />
      </View>
    </View>
  );
};

export default AboutMe;
