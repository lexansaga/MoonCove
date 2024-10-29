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
import { FontAwesome } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { Link, useRouter } from "expo-router";

const HomeScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter(); // Initialize useRouter
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate a network request or data fetching
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
          <Text style={styles.welcomeText}>Hello Student!</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <View style={styles.menuGroup}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.menuItem, styles.statistic]}
              onPress={() => router.push("/Productivity")} // Navigate to /Productivity
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
            >
              <Image
                source={require("@Assets/relax.png")}
                style={[styles.menuImage, styles.menuImageCover]}
              />
              <Text style={[styles.menuText, styles.menuTextTop]}>Relax</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
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
    flex: 2, // Takes up 2/3 of the column
  },
  profileSmall: {
    flex: 1, // Takes up 1/3 of the column
  },
});

export default HomeScreen;
