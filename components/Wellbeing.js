import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, FlatList } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const Wellbeing = ({ navigation, wellbeing }) => {
  const [shuffled, setShuffled] = useState();

  const shuffle = (wellbeing) => {
    for (let i = wellbeing.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [wellbeing[i], wellbeing[j]] = [wellbeing[j], wellbeing[i]];
    }
    setShuffled(wellbeing);
  };

  const wellbeingDetail = (item) => {
    navigation.navigate("WellbeingDetail", { item });
  };

  useEffect(() => {
    shuffle(wellbeing);
  }, [shuffled]);

  return (
    <View
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <View>
        <FlatList
          horizontal={true}
          data={shuffled}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                borderColor: "#E5E7EB",
                borderWidth: 1,
                borderRadius: 20,
                margin: 15,
                padding: 55,
                justifyContent: "center",
                alignItems: "center",
                width: 220,
              }}
              onPress={() => wellbeingDetail(item)}
            >
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: 200,
                  height: 190,
                }}
              >
                <Image
                  source={{ uri: item.imageUrl }}
                  style={{
                    width: 180,
                    height: 180,
                    borderRadius: 5,
                  }}
                />
                <Text
                  style={{
                    fontFamily: "Palanquin_700Bold",
                    fontSize: 22,
                    color: "gray",
                  }}
                >
                  {item.title}
                </Text>
                <Text
                  style={{
                    fontFamily: "Palanquin_500Medium",
                    fontSize: 18,
                    color: "gray",
                  }}
                >
                  {item.desc}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          // height: 50,
          justifyContent: "center",
        }}
      >
        <View
          style={{
            flexDirection: "column",
            width: "100%",
            height: 80,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#bae6fd",
              borderRadius: 6,
              padding: 10,
              marginHorizontal: 15,
              alignContent: "center",
            }}
          >
            <AntDesign
              name="Safety"
              size={32}
              color="#1e40af"
              style={{ alignSelf: "center" }}
            />
            <View style={{ flexDirection: "column", left: 10 }}>
              <TouchableOpacity>
                <Text
                  style={{
                    fontFamily: "Palanquin_500Medium",
                    fontSize: 25,
                    color: "#475569",
                  }}
                  onPress={() => navigation.navigate("SafetyDetail")}
                >
                  Your safety
                </Text>
                <Text
                  style={{
                    fontFamily: "Palanquin_500Medium",
                    fontSize: 18,
                    color: "#475569",
                  }}
                >
                  Trusted organisations and resources
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Wellbeing;
