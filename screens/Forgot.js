import React, { useState } from "react";
import { View, Text, TextInput, SafeAreaView } from "react-native";
import Button from "../components/Button";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";

const Forgot = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [btnColor, setBtnColor] = useState("#3b82f6");
  const [title, setTitle] = useState("Send me code");

  const forgot = () => {
    if (isPlaying) {
      return;
    }
    setIsPlaying(true);
    setTitle("Please wait to resend code");
    setBtnColor("#9ca3af");
  };
  const timerComplete = () => {
    setIsPlaying(false);
    setTitle("Send me code");
    setBtnColor("#3b82f6");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          flex: 1,
          width: "100%",
          height: "100%",
          alignItems: "center",
          backgroundColor: "#fff",
          paddingHorizontal: 10,
        }}
      >
        <Text
          style={{
            fontSize: 36,
            fontFamily: "OpenSans_700Bold",
            alignSelf: "flex-start",
            padding: 10,
          }}
        >
          Verify email
        </Text>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: "#d1d5db",
            borderRadius: 6,
            width: "100%",
            height: 48,
            margin: 10,
          }}
          placeholder=" Email"
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            width: "100%",
          }}
        >
          <Button
            enabled={!isPlaying}
            title={title}
            customStyle={{
              backgroundColor: btnColor,
              paddingVertical: 19,
              width: "80%",
            }}
            customTextStyle={{
              fontFamily: "Montserrat_600SemiBold",
            }}
            onPress={forgot}
          />
          {isPlaying && (
            <CountdownCircleTimer
              strokeWidth={5}
              size={50}
              isPlaying={isPlaying}
              duration={9}
              colors={["#000"]}
              onComplete={timerComplete}
            >
              {({ remainingTime, color }) => (
                <Text
                  style={{
                    color,
                    fontSize: 20,
                    fontFamily: "Montserrat_600SemiBold",
                  }}
                >
                  {remainingTime}
                </Text>
              )}
            </CountdownCircleTimer>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Forgot;
