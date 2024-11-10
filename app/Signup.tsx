import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  ToastAndroid,
  TouchableOpacity,
} from "react-native";
import { Colors } from "@/constants/Colors";
import Input from "@/components/Input";
import { Link } from "expo-router";
import Dropdown from "@/components/Drodpown";
import Button from "@/components/Button";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { authentication, database } from "@/firebase/Firebase";

const Signup: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleSelect = (option: string) => {
    setGender(option);
  };

  const handleSignup = async () => {
    if (!username || !email || !gender || !password || !confirmPassword) {
      ToastAndroid.showWithGravity(
        "Please fill in all fields",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
      return;
    }

    if (password !== confirmPassword) {
      ToastAndroid.showWithGravity(
        "Passwords do not match",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        authentication,
        email,
        password
      );
      const user = userCredential.user;

      // Save user data to Realtime Database
      await set(ref(database, `Users/${user.uid}`), {
        username,
        email,
        gender,
      });

      ToastAndroid.showWithGravity(
        "User registered successfully!",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    } catch (error: any) {
      console.error("Error during signup:", error);

      let errorMessage = "Signup Failed: An unexpected error occurred.";

      // Handle specific Firebase error codes
      if (error.code) {
        switch (error.code) {
          case "auth/email-already-in-use":
            errorMessage =
              "The email address is already in use by another account.";
            break;
          case "auth/invalid-email":
            errorMessage =
              "The email address is not valid. Please enter a valid email.";
            break;
          case "auth/weak-password":
            errorMessage =
              "The password is too weak. Please choose a stronger password.";
            break;
          case "auth/operation-not-allowed":
            errorMessage =
              "Email/password accounts are not enabled. Please contact support.";
            break;
          case "auth/network-request-failed":
            errorMessage =
              "Network error. Please check your internet connection and try again.";
            break;
          default:
            errorMessage = "Signup Failed: " + error.message;
            break;
        }
      }

      ToastAndroid.showWithGravity(
        errorMessage,
        ToastAndroid.LONG,
        ToastAndroid.CENTER
      );
    }
  };

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
            source={require("@Assets/logo-light.png")}
            style={styles.logo}
          />

          <Image source={require("@Assets/user.png")} style={styles.userLogo} />
        </View>

        {/* Input Section */}
        <View style={styles.inputContainer}>
          <Text style={styles.formTitle}>Registration</Text>
          <Input
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />
          <Input
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <Dropdown
            label="Gender"
            options={[
              { id: "Male", label: "Male" },
              { id: "Female", label: "Female" },
              { id: "Others", label: "Others" },
            ]}
            onSelect={handleSelect}
          />
          <Input
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Input
            placeholder="Re-Enter Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <Image
            source={require("@Assets/glitters-left.png")}
            style={styles.floatingGlittersLeft}
          />

          <Image
            source={require("@Assets/glitters-left.png")}
            style={styles.floatingGlittersRight}
          />
        </View>

        {/* Sign Up Link */}
        <View style={styles.signUpContainer}>
          <TouchableOpacity style={styles.signUpLink} onPress={handleSignup}>
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 4,
            marginTop: -20,
          }}
        >
          <Text
            style={{
              color: Colors.default.colorText,
              fontFamily: "HazelnutMilktea-Bold",
            }}
          >
            Already has an account?
          </Text>
          <Link
            href="/Login"
            style={{
              color: Colors.default.colorRed,
              fontFamily: "HazelnutMilktea-Bold",
            }}
          >
            Sign Up
          </Link>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingTop: 35,
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
    width: 220,
    height: 120,
    marginBottom: 10,
    resizeMode: "contain",
  },
  userLogo: {
    objectFit: "contain",
    width: 100,
    height: 80,
  },
  inputContainer: {
    width: "90%",
    backgroundColor: Colors.default.colorPrimary,
    paddingVertical: 18,
    paddingHorizontal: 15,
    borderTopStartRadius: 20,
    borderBottomEndRadius: 20,
    marginBottom: 20,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    position: "relative",
    zIndex: 2,
  },
  signUpContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    backgroundColor: Colors.default.colorPrimary,
    width: 100,
    aspectRatio: 1,
    display: "flex",
    justifyContent: "center",
    borderRadius: 100,
    top: -60,
    zIndex: -1,
  },
  formTitle: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "500",
    color: Colors.default.colorTextBrown,
    fontFamily: "HazelnutMilktea-Bold",
    textTransform: "uppercase",
    letterSpacing: 7,
  },
  signUpText: {
    color: "#fff",
    fontWeight: "500",
    fontFamily: "HazelnutMilktea-Bold",
    fontSize: 18,
  },
  signUpLink: {
    color: Colors.default.colorSecondary,
    fontWeight: "normal",
    fontFamily: "HazelnutMilktea-Bold",
    fontSize: 18,
    top: 10,
    opacity: 1,
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

export default Signup;
