import { Colors } from "@/constants/Colors";
import React from "react";
import { StyleSheet, TextInput, TextInputProps } from "react-native";

interface InputProps extends TextInputProps {
  placeholder?: string;
  placeholderTextColor?: string;
  text?: string;
}

export default function Input({
  placeholder = "Enter text",
  placeholderTextColor = Colors.default.colorTextBrown, // Brown color
  ...props
}: InputProps) {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor={placeholderTextColor}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#E6D4C5",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 100,
    color: Colors.default.colorTextBrown,
    fontWeight: "500",
    letterSpacing: 1.2,
    fontFamily: "HazelnutMilktea-Bold",
  },
});
