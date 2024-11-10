import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { globalStyles } from "@/constants/GlobalStyles";
import { Link, useRouter } from "expo-router";

import { ref, onValue, getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// Define the type for gallery items
interface GalleryItem {
  id: string;
  image: string;
  openIndex: number[];
  status: string;
}

const Gallery = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const router = useRouter();

  const fetchGalleryItems = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const db = getDatabase();
      const galleryRef = ref(db, `Gallery/${user.uid}/Items`);
      onValue(galleryRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const items = Object.values(data) as GalleryItem[];
          setGalleryItems(items);
        }
        setRefreshing(false); // Stop the refreshing animation
      });
    }
  };

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchGalleryItems();
  };

  const handleItemPress = (itemId: string) => {
    router.push({
      pathname: "/Puzzle",
      params: { itemId },
    });
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} activeOpacity={0.7}>
          <FontAwesome6
            name="chevron-left"
            size={18}
            color={Colors.default.colorTextBrown}
          />
          <Link href={"/HomeScreen"} style={globalStyles.overlink}></Link>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Your Gallery</Text>
      <View style={styles.gallery}>
        {galleryItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.imageContainer}
            activeOpacity={0.7}
            onPress={() => handleItemPress(item.id)}
          >
            <Image
              source={require("@Assets/border.png")} // Replace with your border image path
              style={styles.border}
            />

            {item.status === "in-progress" || item.status === "completed" ? (
              <Image source={{ uri: item.image }} style={styles.image} />
            ) : (
              <Image
                source={require("@Assets/lock.png")} // Replace with your lock icon path
                style={styles.lockIcon}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FFF8DC",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    gap: 5,
    marginBottom: 20,
  },
  backButton: {
    borderRadius: 3,
    borderWidth: 1,
    borderColor: Colors.default.colorTextBrown,
    aspectRatio: 1,
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  galleryIcon: {
    height: 40,
    width: 40,
  },
  title: {
    fontSize: 36,
    textAlign: "center",
    marginBottom: 48,
    fontFamily: "HazelnutMilktea-Bold",
  },
  gallery: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    columnGap: 12,
    rowGap: 62,
  },
  imageContainer: {
    position: "relative",
    width: "45%",
    aspectRatio: 16 / 9,
    justifyContent: "center",
  },
  border: {
    width: "100%",
    height: "100%",
    resizeMode: "stretch",
    position: "absolute",
    zIndex: 1,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    position: "absolute",
    zIndex: 0,
  },
  lockIcon: {
    position: "absolute",
    width: 25,
    height: 25,
    top: "6%",
    left: "43%",
    objectFit: "contain",
    zIndex: 2,
  },
});

export default Gallery;
