/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    colorPrimary: "#292A40",
    colorSecondary: "#FFECB6",
  },
  default: {
    colorPrimary: "#C6978F",
    colorSecondary: "#F0E0C9",
    colorText: "#333333",
    colorTextBrown: "#4F3C39",
    colorTextBrownAccent: "#cca29b",
    colorGreen: "#88B889",
    colorRed: "#E05A47",
    colorGrey: "#50526D",
    colorBlue: "#87C0C6", // Green for Excellent
  },
  status: {
    worst: "#FF6B6B", // Bright Red for Worst
    bad: "#FFA07A", // Light Salmon for Bad
    good: "#B2D8B2", // Light Green for Good
    excellent: "#4CAF50", // Green for Excellent
  },
  highlight: "#FFCC00", // Additional color for selected/highlighted dates
};
