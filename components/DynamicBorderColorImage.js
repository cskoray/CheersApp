import React, { useState, useEffect, useRef } from "react";
import { Image, Animated } from "react-native";

const DynamicBorderColorImage = ({ imageUrl }) => {
  const getRandomColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return "#" + "0".repeat(6 - randomColor.length) + randomColor;
  };

  const borderColor = useRef(new Animated.Value(0)).current;
  const [currentColor, setCurrentColor] = useState("#94a3b8");

  useEffect(() => {
    const animateColorChange = () => {
      const newColor = getRandomColor();
      setCurrentColor(newColor);

      Animated.timing(borderColor, {
        toValue: 1,
        duration: 2000, // Adjust the duration as needed
        useNativeDriver: false,
      }).start(() => {
        // Reset the animation value to 0 for the next cycle
        borderColor.setValue(0);
        animateColorChange();
      });
    };

    animateColorChange();

    return () => {
      borderColor.stopAnimation();
    };
  }, [borderColor]);

  const interpolateColor = borderColor.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["white", "#0f172a", "white"],
  });

  return (
    <Animated.Image
      source={{ uri: imageUrl }}
      style={{
        width: 104,
        height: 104,
        borderRadius: 52,
        borderColor: interpolateColor,
        borderWidth: 3,
        top: 20,
      }}
    />
  );
};

export default DynamicBorderColorImage;
