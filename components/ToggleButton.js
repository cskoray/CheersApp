import React, { useState } from "react";
import { Text, StyleSheet, Pressable } from "react-native";

export default function ToggleButton(props) {
  const {
    onPress,
    title = "Join for free",
    customStyle,
    customTextStyle,
  } = props;

  const [isSelected, setSelection] = useState(false);

  const handlePress = () => {
    setSelection(!isSelected); // Toggle the selection
    onPress && onPress(!isSelected); // Pass the updated selection to the parent component
  };

  return (
    <Pressable
      style={[styles.button, isSelected && styles.selected, customStyle]}
      onPress={handlePress}
    >
      <Text
        style={[
          styles.text,
          isSelected && styles.selectedText,
          customTextStyle,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  text: {
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
    fontFamily: "Palanquin_600SemiBold",
    fontSize: 19,
    lineHeight: 42,
  },
  selected: {
    backgroundColor: "#0f172a", // Change the background color for the selected state
  },
  selectedText: {
    color: "white", // Change the text color for the selected state
  },
});
