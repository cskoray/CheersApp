import React from "react";
import { Text, StyleSheet, Pressable } from "react-native";

export default function Button(props) {
  const {
    onPress,
    title = "Join for free",
    customStyle,
    customTextStyle,
    disabled = false,
  } = props;
  return (
    <Pressable
      style={[styles.button, customStyle]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, customTextStyle]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 12,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "#324376",
    borderRadius: 5,
    width: 320,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});
