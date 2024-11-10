import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Feather, FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import Input from "@Components/Input";
import Button from "@Components/Button";
import Dropdown from "@Components/Drodpown";
import { Colors } from "@/constants/Colors";
import { Link, useRouter } from "expo-router";
import { getAuth, signOut } from "firebase/auth";
import useUser from "@/store/User.store";
import { ref, set } from "firebase/database";
import { database, storage } from "@/firebase/Firebase";
import {
  getDownloadURL,
  uploadBytes,
  ref as storageRef,
} from "firebase/storage";

const Profile: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [tempImage, setTempImage] = useState<string | null>(null);

  // State object for editable fields
  const [tempUser, setTempUser] = useState({
    username: "",
    email: "",
    gender: "",
    password: "",
    bio: "",
    profile: "",
  });

  const user = useUser();
  const setUser = useUser((state) => state.setUser);
  const clearUser = useUser((state) => state.clearUser);
  const router = useRouter();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleGenderSelect = (option: string) => {
    setTempUser((prev) => ({ ...prev, gender: option }));
  };

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      clearUser();
      Alert.alert("Success", "Logged out successfully");
      router.replace("/Login");
    } catch (error) {
      console.error("Error during logout:", error);
      Alert.alert("Logout Failed", "An error occurred during logout.");
    }
  };

  const pickImage = async () => {
    if (!isEditable) return;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setTempImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    let profileLink = selectedImage || user.profile;

    if (tempImage) {
      try {
        const response = await fetch(tempImage);
        const blob = await response.blob();
        const storagePath = `Profile/${user.id}.jpg`;
        const storageReference = storageRef(storage, storagePath);

        // Upload the image to Firebase Storage
        await uploadBytes(storageReference, blob);

        // Get the download URL of the uploaded image
        profileLink = await getDownloadURL(storageReference);
        setSelectedImage(profileLink);
        setUser({ ...user, profile: profileLink });
      } catch (error) {
        console.error("Error uploading image to Firebase Storage:", error);
        Alert.alert("Error", "Failed to upload the profile image.");
        return;
      }
    }

    // Save updated data to Zustand store
    setUser({
      ...user,
      ...tempUser,
      profile: profileLink,
    });

    setIsEditable(false);

    try {
      await set(ref(database, `Users/${user?.id}`), {
        ...tempUser,
        profile: profileLink,
      });
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile data to Firebase Database:", error);
      Alert.alert("Error", "Failed to save profile data.");
    }
  };

  const handleEditToggle = () => {
    if (isEditable && tempImage) {
      setTempImage(null); // Revert changes if not saved
    }
    setIsEditable(!isEditable);
  };

  useEffect(() => {
    // Initialize state with current user data
    setTempUser({
      username: user.username,
      email: user.email,
      gender: user.gender,
      password: user.password,
      bio: user.bio,
      profile: user.profile,
    });
    console.log(user.profile);
  }, [user]);

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
          <Link href="/HomeScreen">
            <Feather
              name="home"
              size={24}
              color="#333"
              style={styles.homeIcon}
            />
          </Link>
        </View>

        <View style={styles.body}>
          {/* Profile Picture and Username */}
          <View style={styles.profileContainer}>
            <View
              style={[
                styles.avatarContainer,
                {
                  padding: tempImage || tempUser.profile ? 5 : 20,
                },
              ]}
            >
              {tempImage ? (
                <Image
                  source={{ uri: tempImage }}
                  style={styles.profileImage}
                />
              ) : tempUser.profile ? (
                <Image
                  source={{ uri: tempUser?.profile }}
                  style={styles.profileImage}
                />
              ) : (
                <FontAwesome
                  name="user-o"
                  size={85}
                  color={Colors.dark.colorSecondary}
                />
              )}
              {isEditable === true && (
                <TouchableOpacity style={styles.cameraIcon} onPress={pickImage}>
                  <FontAwesome name="camera" size={20} color="#333" />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.userNameWrapper}>
              <Input
                placeholder="Username"
                value={tempUser.username}
                editable={isEditable}
                onChangeText={(text) =>
                  setTempUser((prev) => ({ ...prev, username: text }))
                }
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  color: "#333",
                }}
              />
              <TouchableOpacity
                style={styles.editIcon}
                onPress={handleEditToggle}
              >
                <FontAwesome6 name="edit" size={20} color="#333" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Profile Form */}
          <View style={styles.formContainer}>
            <Input
              placeholder="Email"
              value={tempUser.email}
              editable={false}
              onChangeText={(text) =>
                setTempUser((prev) => ({ ...prev, email: text }))
              }
            />
            {/* <Input
              placeholder="Password"
              value={tempUser.password}
              secureTextEntry
              editable={isEditable}
              onChangeText={(text) =>
                setTempUser((prev) => ({ ...prev, password: text }))
              }
            /> */}

            {/* Gender Dropdown */}
            <Dropdown
              label="Gender"
              options={[
                { id: "Male", label: "Male" },
                { id: "Female", label: "Female" },
                { id: "Other", label: "Other" },
              ]}
              selectedValue={tempUser?.gender}
              onSelect={handleGenderSelect}
              disabled={!isEditable}
            />

            <Input
              placeholder="Bio"
              multiline
              editable={isEditable}
              onChangeText={(text) =>
                setTempUser((prev) => ({ ...prev, bio: text }))
              }
            />

            {isEditable && (
              <Button
                title="Save"
                onPress={handleSave}
                customStyles={{
                  backgroundColor: Colors.default.colorRed,
                }}
              />
            )}
          </View>

          {/* Log Out Button */}
          <View style={styles.buttonWrapper}>
            <Button
              title="LOG-OUT"
              onPress={handleLogout}
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
    marginLeft: 10,
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
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 75,
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
