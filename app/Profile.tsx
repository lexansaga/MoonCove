import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import {
  Feather,
  FontAwesome,
  FontAwesome6,
  MaterialIcons,
} from "@expo/vector-icons";
import Input from "@Components/Input";
import Button from "@Components/Button";
import Dropdown from "@Components/Drodpown";
import { Colors } from "@/constants/Colors";

const Profile: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate a network request or any asynchronous operation
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleGenderSelect = (option: string) => {
    console.log("Selected Gender:", option);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <Feather name="home" size={24} color="#333" style={styles.homeIcon} />
        </View>

        <View style={styles.body}>
          {/* Profile Picture and Username */}
          <View style={styles.profileContainer}>
            <View style={styles.avatarContainer}>
              <FontAwesome
                name="user-o"
                size={85}
                color={Colors.dark.colorSecondary}
              />
              <TouchableOpacity style={styles.cameraIcon}>
                <FontAwesome name="camera" size={20} color="#333" />
              </TouchableOpacity>
            </View>
            <View style={styles.userNameWrapper}>
              <Text style={styles.username}>USERNAME</Text>
              <TouchableOpacity style={styles.editIcon}>
                <FontAwesome6 name="edit" size={20} color="#333" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Profile Form */}
          <View style={styles.formContainer}>
            <Input placeholder="Email" keyboardType="email-address" />
            <Input placeholder="Password" secureTextEntry />

            {/* Gender Dropdown */}
            <Dropdown
              label="Gender"
              options={[
                { id: "Male", label: "Male" },
                { id: "Female", label: "Female" },
                { id: "Other", label: "Other" },
              ]}
              onSelect={handleGenderSelect}
            />

            <Input placeholder="Bio" multiline />
          </View>

          {/* Log Out Button */}
          <View style={styles.buttonWrapper}>
            <Button
              title="LOG-OUT"
              onPress={() => console.log("Logged Out")}
              variant="Secondary"
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.dark.colorSecondary,
    paddingTop: 40,
    flexDirection: "column",
  },
  body: {
    flex: 1,
  },
  header: {
    alignItems: "flex-start",
    marginBottom: 20,
  },
  homeIcon: {
    marginLeft: 10,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
    gap: 15,
  },
  avatarContainer: {
    position: "relative",
    alignItems: "center",
    backgroundColor: Colors.dark.colorPrimary,
    borderRadius: 100,
    justifyContent: "center",
    padding: 20,
    aspectRatio: 1,
    height: 150,
    width: 150,
  },
  cameraIcon: {
    position: "absolute",
    top: 0,
    right: 0,
    borderRadius: 50,
    borderColor: Colors.dark.colorPrimary,
    borderWidth: 8,
    backgroundColor: Colors.dark.colorSecondary,
    padding: 5,
  },
  userNameWrapper: {
    gap: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  editIcon: {
    backgroundColor: "transparent",
  },
  formContainer: {
    backgroundColor: "#1A1B45",
    padding: 20,
    paddingTop: 40,
    paddingBottom: 80,
    borderTopStartRadius: 35,
    borderTopEndRadius: 35,
    flexDirection: "column",
    gap: 12,
    flex: 1,
  },
  label: {
    color: "#E6D4C5",
    fontSize: 16,
    marginBottom: 5,
    fontFamily: "HazelnutMilktea-Bold",
  },
  buttonWrapper: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Profile;
