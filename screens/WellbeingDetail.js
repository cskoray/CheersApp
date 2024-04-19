import React from "react";
import { View, Text, ScrollView, Image, SafeAreaView } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const WellbeingDetail = ({ route, navigation }) => {
  const { imageUrl, title, story, advices, supportLines } = route.params.item;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
      }}
    >
      <AntDesign
        name="leftcircle"
        size={36}
        color="#0f172a"
        style={{ top: 20, alignSelf: "flex-start", left: 10 }}
        onPress={() => {
          navigation.goBack();
        }}
      />
      <ScrollView
        directionalLockEnabled={true}
        style={{ backgroundColor: "white", borderRadius: 20, flex: 1, top: 30 }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: 10,
          }}
        >
          <Image
            source={{ uri: imageUrl }}
            style={{
              width: 240,
              height: 240,
              borderRadius: 5,
            }}
            resizeMethod="scale"
          />
          <Text
            style={{
              fontFamily: "Palanquin_700Bold",
              fontSize: 26,
              color: "#0f172a",
              alignSelf: "flex-start",
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              fontFamily: "Palanquin_500Medium",
              fontSize: 18,
              color: "gray",
            }}
          >
            {story}
          </Text>
          <Text
            style={{
              fontFamily: "Palanquin_500Medium",
              fontSize: 24,
              color: "#0f172a",
              alignSelf: "flex-start",
            }}
          >
            Advices
          </Text>
          {advices.map((advice, index) => (
            <Text
              style={{
                fontFamily: "Palanquin_500Medium",
                fontSize: 18,
                color: "gray",
                left: 10,
                alignSelf: "flex-start",
              }}
            >
              {++index}- {advice}
            </Text>
          ))}
          <Text
            style={{
              fontFamily: "Palanquin_500Medium",
              fontSize: 24,
              color: "#0f172a",
              alignSelf: "flex-start",
            }}
          >
            Support Lines
          </Text>
          {supportLines.map((supportLine, index) => (
            <Text
              style={{
                fontFamily: "Palanquin_500Medium",
                fontSize: 18,
                color: "gray",
                left: 10,
                alignSelf: "flex-start",
              }}
            >
              {++index}- {supportLine}
            </Text>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WellbeingDetail;
