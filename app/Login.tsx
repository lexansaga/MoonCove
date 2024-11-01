import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import Input from "@/components/Input";
import { Link } from "expo-router";
import Button from "@/components/Button";
import FloatingGlitter from "@Components/FloatingGlitters";

const Login: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate an API call or any asynchronous operation
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollViewContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.container}>
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <Image
            source={require("@Assets//logo-light.png")}
            style={styles.logo}
          />

          <Image source={require("@Assets/user.png")} style={styles.userLogo} />
        </View>

        {/* Input Section */}
        <View style={styles.inputContainer}>
          <Input placeholder="Username" />
          <Input placeholder="Password" secureTextEntry />

          <Button
            title="Signin"
            href={"/HomeScreen"}
            onPress={() => {
              console.log("Pressed Signin button");
            }}
            variant={"Primary"}
          />

          {/* <FloatingGlitter />
          <FloatingGlitter />

          <FloatingGlitter />
          <FloatingGlitter /> */}

          <FloatingGlitter top={15} bottom={0} left={15} />
          <FloatingGlitter top={230} bottom={0} left={280} right={10} />
        </View>

        {/* Sign Up Link */}
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Create a new account? </Text>
          <TouchableOpacity>
            <Link href="/Signup" style={styles.signUpLink}>
              Sign Up
            </Link>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingTop: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#F3F1E7",
    alignItems: "center",
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    gap: 20,
    marginBottom: 20,
  },
  logo: {
    width: 280,
    height: 200,
    marginBottom: 10,
    resizeMode: "contain",
  },
  userLogo: {
    objectFit: "contain",
    width: 180,
    height: 120,
  },

  iconContainer: {
    marginBottom: 30,
  },
  inputContainer: {
    width: "90%",
    backgroundColor: Colors.default.colorPrimary,
    paddingVertical: 48,
    paddingHorizontal: 15,
    borderTopStartRadius: 20,
    borderBottomEndRadius: 20,
    marginBottom: 20,
    display: "flex",
    flexDirection: "column",
    gap: 18,
    position: "relative",
  },
  signUpContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  signUpText: {
    color: "#333",
    fontWeight: "500",
    fontFamily: "HazelnutMilktea-Bold",
    fontSize: 18,
  },
  signUpLink: {
    color: "#62A1AF",
    fontWeight: "normal",
    fontFamily: "HazelnutMilktea-Bold",
    fontSize: 18,
  },
  floatingGlittersLeft: {
    position: "absolute",
    width: 20,
    height: 20,
    bottom: 15,
    left: 15,
    objectFit: "contain",
    zIndex: 2,
  },
  floatingGlittersRight: {
    position: "absolute",
    width: 20,
    height: 20,
    top: 15,
    right: 15,
    objectFit: "contain",
    zIndex: 2,
  },
});

export default Login;
