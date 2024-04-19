import React, { useRef, useEffect } from "react";
import { TouchableOpacity, Animated } from "react-native";

const BlinkingButton = ({ onPress }) => {
  const backgroundColor = useRef(new Animated.Value(0)).current;
  const textColor = useRef(new Animated.Value(0)).current;

  const startColorChange = () => {
    Animated.parallel([
      Animated.timing(backgroundColor, {
        toValue: 1,
        duration: 1000, // Adjust the duration as needed
        useNativeDriver: false,
      }),
      Animated.timing(textColor, {
        toValue: 1,
        duration: 1000, // Adjust the duration as needed
        useNativeDriver: false,
      }),
    ]).start();
  };

  useEffect(() => {
    startColorChange();
  }, []);

  const interpolatedBackgroundColor = backgroundColor.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["white", "#0f172a", "white"],
  });

  const interpolatedTextColor = textColor.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["#0f172a", "white", "#0f172a"],
  });

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <Animated.View
        style={{
          shadowColor: "#171717",
          shadowOffset: { width: 2, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
          elevation: 10,
          flexDirection: "row",
          borderRadius: 30,
          backgroundColor: interpolatedBackgroundColor,
          flexDirection: "row",
          padding: 10,
        }}
      >
        <Animated.Text
          style={{
            fontFamily: "Montserrat_500Medium",
            fontSize: 12,
            color: interpolatedTextColor,
          }}
        >
          Complete my profile
        </Animated.Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default BlinkingButton;
