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
import Select from "@/components/Drodpown";
import Button from "@/components/Button";
import Dropdown from "@/components/Drodpown";

const Signup: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate an API call or any asynchronous operation
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleSelect = (option: string) => {
    console.log("Selected option:", option);
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
            source={require("@Assets//logo-light.png")}
            style={styles.logo}
          />

          <Image
            source={require("@Assets//user.png")}
            style={styles.userLogo}
          />
        </View>

        {/* Input Section */}
        <View style={styles.inputContainer}>
          <Text style={styles.formTitle}>Registration</Text>
          <Input placeholder="Username" />
          <Input placeholder="Email" keyboardType="email-address" />
          <Dropdown
            label="Gender"
            options={[
              { id: "Male", label: "Male" },
              { id: "Female", label: "Female" },
              { id: "Others", label: "Others" },
            ]}
            onSelect={handleSelect}
          />
          <Input placeholder="Password" secureTextEntry />
          <Input placeholder="Re-Enter Password" secureTextEntry />
          <Button title="Signup" onPress={() => {}} variant={"Primary"} />
          <Image
            source={require("@Assets//glitters-left.png")}
            style={styles.floatingGlittersLeft}
          />

          <Image
            source={require("@Assets//glitters-left.png")}
            style={styles.floatingGlittersRight}
          />
        </View>

        {/* Sign Up Link */}
        <View style={styles.signUpContainer}>
          <TouchableOpacity>
            <Link href="/Login" style={styles.signUpLink}>
              Sign In
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

  iconContainer: {
    marginBottom: 30,
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
