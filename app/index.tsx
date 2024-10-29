import { useFonts } from "expo-font";
import { useRootNavigationState, Redirect, SplashScreen } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function InitialRouting() {
  const rootNavigationState = useRootNavigationState();

  const [loaded, error] = useFonts({
    "HazelnutMilktea-Regular": require("../assets/fonts/hazelnut-milktea.ttf"),
    "HazelnutMilktea-Italic": require("../assets/fonts/hazelnut-milk-tea-itallic.ttf"),
    "HazelnutMilktea-Bold": require("../assets/fonts/hazelnut-milk-tea-bold.ttf"),
    "HazelnutMilktea-BoldItalic": require("../assets/fonts/hazelnut-milk-tea-bold-itallic.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!rootNavigationState?.key) return null;

  return <Redirect href="/Login" />;
}
