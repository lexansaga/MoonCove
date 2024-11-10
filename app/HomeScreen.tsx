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
import { FontAwesome } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { Link, useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { get, ref, set, push } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  listAll,
  getDownloadURL,
} from "firebase/storage";
import { authentication, database } from "@/firebase/Firebase";
import useUser from "@/store/User.store";

const HomeScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const currentUser = useUser();
  const setUser = useUser((state) => state.setUser);

  // Fetch and set the current user data
  useEffect(() => {
    const fetchCurrentUser = async (userId: string) => {
      try {
        const userRef = ref(database, `Users/${userId}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setUser({
            id: userId,
            email: userData.email,
            username: userData.username,
            gender: userData.gender,
          });
        } else {
          Alert.alert("Error", "User data not found in the database.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        Alert.alert("Error", "Failed to fetch user data.");
      }
    };

    const createGalleryStructure = async (userId: string) => {
      try {
        const galleryRef = ref(database, `Gallery/${userId}/Items`);
        const snapshot = await get(galleryRef);

        if (!snapshot.exists()) {
          const storage = getStorage();
          const quotesRef = storageRef(storage, "Quotes");
          const { items } = await listAll(quotesRef);

          const imageUrls = await Promise.all(
            items.map(async (itemRef) => {
              const url = await getDownloadURL(itemRef);
              return url;
            })
          );

          const newItems = imageUrls.map((imageUrl, index) => ({
            id: `quote-${index}`,
            image: imageUrl,
            openIndex: [0],
            status: index > 0 ? "pending" : "in-progress",
          }));
          console.log(newItems);

          newItems.forEach((item) => {
            const itemRef = ref(database, `Gallery/${userId}/Items/${item.id}`);
            set(itemRef, item);
          });

          console.log("Gallery structure created for new user.");
        } else {
          console.log("Gallery structure already exists for the user.");
        }
      } catch (error) {
        console.error("Error creating gallery structure:", error);
        Alert.alert("Error", "Failed to create gallery structure.");
      }
    };

    const unsubscribe = onAuthStateChanged(authentication, (user) => {
      if (user) {
        fetchCurrentUser(user.uid);
        createGalleryStructure(user.uid); // Create gallery structure for new user
      } else {
        router.replace("/Login"); // Redirect to login if not authenticated
      }
    });

    return () => unsubscribe(); // Clean up the subscription
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require("@Assets/logo-light.png")}
            style={styles.logo}
          />
          <Link href={"/Profile"}>
            <FontAwesome
              name="gear"
              size={24}
              color="#333"
              style={styles.settingsIcon}
            />
          </Link>
        </View>

        {/* Welcome Text */}
        <View style={styles.welcomeContainer}>
          <FontAwesome name="user-o" size={24} color="#333" />
          <Text style={styles.welcomeText}>Hello {currentUser?.username}</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <View style={styles.menuGroup}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.menuItem, styles.statistic]}
              onPress={() => router.push("/Productivity")}
            >
              <Image
                source={require("@Assets/statistic.png")}
                style={styles.menuImage}
              />
              <Text style={styles.menuText}>My Statistic</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.menuItem, styles.timer]}
              onPress={() => {
                router.push("/Timer");
              }}
            >
              <Image
                source={require("@Assets/timer.png")}
                style={styles.menuImage}
              />
              <Text style={styles.menuText}>Timer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.menuItem, styles.puzzle]}
              onPress={() => {
                router.push("/Gallery");
              }}
            >
              <Image
                source={require("@Assets/puzzle.png")}
                style={styles.menuImage}
              />
              <Text style={styles.menuText}>Puzzle</Text>
            </TouchableOpacity>
          </View>

          {/* Second Menu Group */}
          <View style={styles.menuGroup}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.menuItem, styles.relax, styles.relaxLarge]}
              onPress={() => {
                router.replace("/Relax");
              }}
            >
              <Image
                source={require("@Assets/relax.png")}
                style={[styles.menuImage, styles.menuImageCover]}
              />
              <Text style={[styles.menuText, styles.menuTextTop]}>Relax</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                router.push("/Profile");
              }}
              style={[styles.menuItem, styles.profile, styles.profileSmall]}
            >
              <Image
                source={require("@Assets/notes.png")}
                style={styles.menuImage}
              />
              <Text style={[styles.menuText, styles.menuTextWhite]}>
                Profile
              </Text>
            </TouchableOpacity>
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
    backgroundColor: "#F3F1E7",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 25,
  },
  logo: {
    width: 100,
    height: 50,
    resizeMode: "contain",
    position: "absolute",
    left: "50%",
    transform: [{ translateX: -50 }],
  },
  settingsIcon: {
    marginRight: 10,
  },
  welcomeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "500",
    marginLeft: 10,
    color: "#333",
  },
  menuContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "nowrap",
    flex: 1,
    paddingBottom: 80,
  },
  menuGroup: {
    flexDirection: "column",
    justifyContent: "space-between",
    width: "48.5%",
    height: "100%",
    gap: 10,
  },
  menuItem: {
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    flex: 1,
    overflow: "hidden",
  },
  menuText: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.default.colorText,
    position: "absolute",
    bottom: 10,
    fontFamily: "HazelnutMilktea-Bold",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  menuTextTop: {
    top: 20,
    bottom: 0,
  },
  menuTextWhite: {
    color: "white",
  },
  menuImage: {
    width: "90%",
    height: "80%",
    resizeMode: "contain",
    position: "relative",
  },
  menuImageCover: {
    width: "100%",
    height: "80%",
    resizeMode: "cover",
    position: "absolute",
    bottom: 0,
  },
  statistic: {
    backgroundColor: "#87C0C6",
  },
  timer: {
    backgroundColor: "#FDCDCB",
  },
  puzzle: {
    backgroundColor: "#88B889",
  },
  relax: {
    backgroundColor: "#C6978F",
  },
  profile: {
    backgroundColor: "#292A40",
  },
  relaxLarge: {
    flex: 2,
  },
  profileSmall: {
    flex: 1,
  },
});

export default HomeScreen;
