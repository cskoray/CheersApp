import React, { useState } from "react";
import { View, Text, SafeAreaView, FlatList } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const SafetyDetail = ({ navigation }) => {
  const [lines, setLines] = useState([
    {
      title: "National Domestic Abuse Helpline",
      text: [
        "Phone: 0808 2000 247 (24/7)",
        "Website: National Domestic Abuse Helpline",
      ],
    },
    {
      title: "Samaritans",
      text: [
        "Phone: 116 123 (24/7)",
        "Email: jo@samaritans.org",
        "Website: Samaritans",
      ],
    },
    {
      title: "Mind Infoline",
      text: [
        "Phone: 0300 123 3393 (9 am - 6 pm, Mon - Fri)",
        "Text: 86463",
        "Email: info@mind.org.uk",
        "Website: Mind",
      ],
    },
    {
      title: "Childline",
      text: ["Phone: 0800 1111 (24/7)", "Website: Childline"],
    },
    {
      title: "The Mix",
      text: [
        "Phone: 0808 808 4994 (2 pm - 11 pm, every day)",
        "Text: THEMIX to 85258",
        "Website: The Mix",
      ],
    },
    {
      title: "NHS 111",
      text: ["Phone: 111 (24/7)", "Website: NHS 111"],
    },
  ]);

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
      <View style={{ top: 50 }}>
        <FlatList
          data={lines}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View
              style={{
                borderColor: "#E5E7EB",
                borderWidth: 1,
                borderRadius: 20,
                margin: 5,
                padding: 10,
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Palanquin_700Bold",
                  fontSize: 22,
                  color: "#0f172a",
                }}
              >
                {item.title}
              </Text>
              {item.text.map((text, id) => (
                <Text
                  style={{
                    fontFamily: "Palanquin_500Medium",
                    fontSize: 18,
                    color: "gray",
                  }}
                  key={id}
                >
                  {text}
                </Text>
              ))}
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default SafetyDetail;
