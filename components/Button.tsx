import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { Link } from "expo-router";

interface ButtonProps {
  title: string;
  variant?: "Primary" | "Secondary";
  isLoading?: boolean;
  onPress?: () => void;
  href?: string; // Optional href prop to navigate
  customStyles?: Object;
}

export default function Button({
  title,
  variant = "Primary",
  isLoading = false,
  onPress,
  href,
  customStyles,
}: ButtonProps) {
  const content = (
    <>
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={variant === "Primary" ? "#FFF" : Colors.default.colorTextBrown}
        />
      ) : (
        <Text
          style={[
            styles.buttonText,
            variant === "Primary" ? styles.primaryText : styles.secondaryText,
          ]}
        >
          {title}
        </Text>
      )}
    </>
  );

  // If href is provided, render as a Link
  if (href) {
    return (
      <Link
        href={href}
        asChild
        style={[
          styles.button,
          variant === "Primary" ? styles.primary : styles.secondary,
        ]}
      >
        <TouchableOpacity onPress={onPress} disabled={isLoading}>
          {content}
        </TouchableOpacity>
      </Link>
    );
  }

  // Otherwise, render as a regular TouchableOpacity button
  return (
    <TouchableOpacity
      style={[
        styles.button,
        customStyles
          ? customStyles
          : variant === "Primary"
          ? styles.primary
          : styles.secondary,
        ,
      ]}
      onPress={onPress}
      disabled={isLoading}
    >
      {content}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  primary: {
    backgroundColor: Colors.default.colorTextBrown,
  },
  secondary: {
    backgroundColor: "#E6D4C5",
  },
  buttonText: {
    fontWeight: "500",
    letterSpacing: 1.2,
    fontFamily: "HazelnutMilktea-Bold",
  },
  primaryText: {
    color: "#FFF",
  },
  secondaryText: {
    color: Colors.default.colorTextBrown,
  },
});
