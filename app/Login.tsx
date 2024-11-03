import React, { useState, useCallback, useEffect } from "react";
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
import { Link, useRouter } from "expo-router";
import Button from "@/components/Button";
import FloatingGlitter from "@Components/FloatingGlitters";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { get, ref } from "firebase/database";
import { authentication, database } from "@/firebase/Firebase";
import useUser from "@/store/User.store";

const Login: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setUser = useUser((state) => state.setUser);
  const currentUser = useUser();
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const unsubscribe = onAuthStateChanged(authentication, (user) => {
      if (user) {
        router.replace("/HomeScreen"); // Redirect to HomeScreen if already logged in
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        authentication,
        email,
        password
      );
      const user = userCredential.user;

      // Fetch user data from Firebase Realtime Database
      const userRef = ref(database, `Users/${user.uid}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const userData = snapshot.val();
        setUser({
          id: user.uid,
          email: userData.email,
          username: userData.username,
          gender: userData.gender,
        });

        ToastAndroid.showWithGravity(
          `Welcome ${userData.username}`,
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
        router.replace("/HomeScreen"); // Use replace to prevent going back to login
      } else {
        ToastAndroid.showWithGravity(
          "User data not found in the database.",
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
      }
    } catch (error: any) {
      console.error("Error during login:", error);
      let errorMessage = "Login failed. Please try again.";

      if (error.code) {
        switch (error.code) {
          case "auth/invalid-email":
            errorMessage =
              "The email address format is incorrect. Please enter a valid email.";
            break;
          case "auth/user-disabled":
            errorMessage =
              "This account has been disabled. Please contact support for assistance.";
            break;
          case "auth/user-not-found":
            errorMessage =
              "No account found with this email. Please check the email or sign up.";
            break;
          case "auth/wrong-password":
            errorMessage =
              "The password you entered is incorrect. Please try again or reset your password.";
            break;
          case "auth/network-request-failed":
            errorMessage =
              "Network error. Please check your internet connection and try again.";
            break;
          case "auth/invalid-credential":
            errorMessage =
              "The credentials provided are invalid. Please try logging in again or contact support.";
            break;
          default:
            errorMessage =
              "An unexpected error occurred. Please try again later or contact support.";
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
          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <Input
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Button title="Signin" onPress={handleLogin} variant={"Primary"} />

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
});

export default Login;
