import Button from "@Components/Button";
import { Link, useRouter, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  RefreshControl,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { globalStyles } from "@/constants/GlobalStyles";
import { getDatabase, ref, onValue, update } from "firebase/database";
import { getAuth } from "firebase/auth";

// Define the type for the puzzle item
interface PuzzleItem {
  id: string;
  image: string;
  openIndex: number[];
  status: string;
}

export default function Puzzle() {
  const [item, setItem] = useState<PuzzleItem | null>(null);
  const { itemId } = useLocalSearchParams();
  const router = useRouter();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    console.log(itemId);
    const fetchPuzzleItem = () => {
      const db = getDatabase();
      const itemRef = ref(db, `Gallery/${user?.uid}/Items/${itemId}`);
      onValue(itemRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setItem(data);
          checkCompletion(data, itemId);
        }
      });
    };
    if (itemId) {
      fetchPuzzleItem();
    }
  }, [itemId]);

  const checkCompletion = (data: PuzzleItem, itemId: string) => {
    const totalPieces = 35; // Assuming there are 33 pieces in total
    if (data.openIndex.length === totalPieces && data.status !== "completed") {
      const db = getDatabase();
      const itemRef = ref(
        db,
        `Gallery/${getAuth().currentUser?.uid}/Items/${itemId}`
      );
      update(itemRef, { status: "completed" });

      findAndUpdatePendingItem(user?.uid || "");
    }
  };

  const updateStatusToInProgress = (itemId: string) => {
    const db = getDatabase();
    const itemRef = ref(db, `Gallery/${user?.uid}/Items/${itemId}`);
    update(itemRef, { status: "in-progress" });
  };

  const findAndUpdatePendingItem = (userId: string) => {
    const db = getDatabase();
    const itemsRef = ref(db, `Gallery/${userId}/Items`);

    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const items = Object.values(data) as PuzzleItem[];
        const pendingItem = items.find((item) => item.status === "pending");
        if (pendingItem) {
          updateStatusToInProgress(pendingItem.id);
        }
      }
    });
  };

  if (!item) {
    return null; // or a loading indicator
  }

  return (
    <ScrollView
      contentContainerStyle={styles.scrollViewContent}
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={() => {}} />
      }
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} activeOpacity={0.7}>
            <FontAwesome6
              name="chevron-left"
              size={18}
              color={Colors.default.colorTextBrown}
            />
            <Link href={"/HomeScreen"} style={globalStyles.overlink}></Link>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backButton} activeOpacity={0.7}>
            <Image
              source={require("@Assets/gallery.png")}
              alt="Gallery"
              style={styles.galleryIcon}
            />
            <Link href={"/Gallery"} style={globalStyles.overlink}></Link>
          </TouchableOpacity>
        </View>
        <View style={styles.puzzleContainer}>
          <Image source={{ uri: item.image }} style={styles.puzzleImage} />
          <Image
            source={require("@Assets/border.png")}
            style={styles.puzzleBorder}
          />
          <View style={styles.puzzlePieces}>
            {/* Row 1 */}
            {!item.openIndex?.includes(1) && (
              <Image
                source={require("@Assets/PuzzlePieces/1-1.png")}
                style={[
                  styles.puzzlePiece,
                  { width: 44, height: 59, top: 1, left: 3 },
                ]}
              />
            )}
            {!item.openIndex.includes(2) && (
              <Image
                source={require("@Assets/PuzzlePieces/1-2.png")}
                style={[
                  styles.puzzlePiece,
                  { width: 79, height: 47, top: 1, left: 33 },
                ]}
              />
            )}
            {!item.openIndex.includes(3) && (
              <Image
                source={require("@Assets/PuzzlePieces/1-3.png")}
                style={[
                  styles.puzzlePiece,
                  { width: 47, height: 63, top: 1, left: 97 },
                ]}
              />
            )}
            {!item.openIndex.includes(4) && (
              <Image
                source={require("@Assets/PuzzlePieces/1-4.png")}
                style={[
                  styles.puzzlePiece,
                  { width: 76, height: 47, top: 1, left: 131 },
                ]}
              />
            )}
            {!item.openIndex.includes(5) && (
              <Image
                source={require("@Assets/PuzzlePieces/1-5.png")}
                style={[
                  styles.puzzlePiece,
                  { width: 48, height: 62, top: 1, left: 194 },
                ]}
              />
            )}
            {!item.openIndex.includes(6) && (
              <Image
                source={require("@Assets/PuzzlePieces/1-6.png")}
                style={[
                  styles.puzzlePiece,
                  { width: 77, height: 47, top: 1, left: 228 },
                ]}
              />
            )}
            {!item.openIndex.includes(7) && (
              <Image
                source={require("@Assets/PuzzlePieces/1-7.png")}
                style={[
                  styles.puzzlePiece,
                  { width: 48, height: 63, top: 1, left: 291 },
                ]}
              />
            )}

            {/* Row 2 */}
            {!item.openIndex.includes(8) && (
              <Image
                source={require("@Assets/PuzzlePieces/2-1.png")}
                style={[
                  styles.puzzlePiece,
                  { width: 58, height: 43, top: 47, left: 3 },
                ]}
              />
            )}
            {!item.openIndex.includes(9) && (
              <Image
                source={require("@Assets/PuzzlePieces/2-2.png")}
                style={[
                  styles.puzzlePiece,
                  { width: 66, height: 76, top: 33, left: 39 },
                ]}
              />
            )}
            {!item.openIndex.includes(10) && (
              <Image
                source={require("@Assets/PuzzlePieces/2-3.png")}
                style={[
                  styles.puzzlePiece,
                  { width: 78, height: 47, top: 48, left: 82 },
                ]}
              />
            )}
            {!item.openIndex.includes(11) && (
              <Image
                source={require("@Assets/PuzzlePieces/2-4.png")}
                style={[
                  styles.puzzlePiece,
                  { width: 66, height: 76, top: 34, left: 136 },
                ]}
              />
            )}
            {!item.openIndex.includes(12) && (
              <Image
                source={require("@Assets/PuzzlePieces/2-5.png")}
                style={[
                  styles.puzzlePiece,
                  { width: 78, height: 47, top: 48, left: 179 },
                ]}
              />
            )}
            {!item.openIndex.includes(13) && (
              <Image
                source={require("@Assets/PuzzlePieces/2-6.png")}
                style={[
                  styles.puzzlePiece,
                  { width: 67, height: 77, top: 33, left: 233 },
                ]}
              />
            )}
            {!item.openIndex.includes(14) && (
              <Image
                source={require("@Assets/PuzzlePieces/2-7.png")}
                style={[
                  styles.puzzlePiece,
                  { width: 62, height: 46, top: 48, left: 277 },
                ]}
              />
            )}
            {/* Row 3 */}
            {!item.openIndex.includes(15) && (
              <Image
                source={require("@Assets/PuzzlePieces/3-1.png")}
                style={[
                  styles.puzzlePiece,
                  { width: 49, height: 80, top: 77, left: 0 },
                ]}
              />
            )}
            {!item.openIndex.includes(16) && (
              <Image
                source={require("@Assets/PuzzlePieces/3-2.png")}
                style={[
                  styles.puzzlePiece,
                  { width: 77, height: 46, top: 95, left: 34 },
                ]}
              />
            )}
            {!item.openIndex.includes(17) && (
              <Image
                source={require("@Assets/PuzzlePieces/3-3.png")}
                style={[
                  styles.puzzlePiece,
                  { width: 47, height: 79, top: 80, left: 97 },
                ]}
              />
            )}
            {!item.openIndex.includes(18) && (
              <Image
                source={require("@Assets/PuzzlePieces/3-2.png")}
                style={[
                  styles.puzzlePiece,
                  { width: 77, height: 46, top: 96, left: 131 },
                ]}
              />
            )}
            {!item.openIndex.includes(19) && (
              <Image
                source={require("@Assets/PuzzlePieces/3-3.png")}
                style={[
                  styles.puzzlePiece,
                  { width: 47, height: 79, top: 80, left: 195 },
                ]}
              />
            )}
            {!item.openIndex.includes(20) && (
              <Image
                source={require("@Assets/PuzzlePieces/3-5.png")}
                style={[
                  styles.puzzlePiece,
                  { width: 77, height: 46, top: 96, left: 228 },
                ]}
              />
            )}
            {!item.openIndex.includes(21) && (
              <Image
                source={require("@Assets/PuzzlePieces/3-7.png")}
                style={[
                  styles.puzzlePiece,
                  { width: 46, height: 75, top: 82, left: 292 },
                ]}
              />
            )}

            {/* Row 4 */}
            {!item.openIndex.includes(22) && (
              <Image
                source={require("@Assets/PuzzlePieces/4-1.png")}
                style={[
                  styles.puzzlePiece,
                  { width: 62, height: 46, top: 143, left: 1 },
                ]}
              />
            )}
            {!item.openIndex.includes(23) && (
              <Image
                source={require("@Assets/PuzzlePieces/4-2.png")}
                style={[
                  styles.puzzlePiece,
                  { width: 66, height: 76, top: 129, left: 40 },
                ]}
              />
            )}
            {!item.openIndex.includes(24) && (
              <Image
                source={require("@Assets/PuzzlePieces/4-3.png")}
                style={[
                  styles.puzzlePiece,
                  { width: 78, height: 47, top: 144, left: 83 },
                ]}
              />
            )}
            {!item.openIndex.includes(25) && (
              <Image
                source={require("@Assets/PuzzlePieces/4-2.png")}
                style={[
                  styles.puzzlePiece,
                  { width: 66, height: 76, top: 130, left: 137 },
                ]}
              />
            )}
            {!item.openIndex.includes(26) && (
              <Image
                source={require("@Assets/PuzzlePieces/4-3.png")}
                style={[
                  styles.puzzlePiece,
                  { width: 78, height: 47, top: 144, left: 179 },
                ]}
              />
            )}
            {!item.openIndex.includes(27) && (
              <Image
                source={require("@Assets/PuzzlePieces/4-2.png")}
                style={[
                  styles.puzzlePiece,
                  { width: 66, height: 76, top: 130, left: 232 },
                ]}
              />
            )}
            {!item.openIndex.includes(28) && (
              <Image
                source={require("@Assets/PuzzlePieces/4-7.png")}
                style={[
                  styles.puzzlePiece,
                  { width: 62, height: 46, top: 145, left: 275 },
                ]}
              />
            )}

            {/* Row 5 */}
            {!item.openIndex.includes(29) && (
              <Image
                source={require("@Assets/PuzzlePieces/5-1.png")}
                style={[
                  styles.puzzlePiece,
                  { width: 49, height: 64, top: 174, left: 0 },
                ]}
              />
            )}
            {!item.openIndex.includes(30) && (
              <Image
                source={require("@Assets/PuzzlePieces/5-2.png")}
                style={[
                  styles.puzzlePiece,
                  { width: 78, height: 47, top: 191, left: 34 },
                ]}
              />
            )}
            {!item.openIndex.includes(31) && (
              <Image
                source={require("@Assets/PuzzlePieces/5-3.png")}
                style={[
                  styles.puzzlePiece,
                  { width: 46, height: 61, top: 178, left: 99 },
                ]}
              />
            )}
            {!item.openIndex.includes(32) && (
              <Image
                source={require("@Assets/PuzzlePieces/5-6.png")}
                style={[
                  styles.puzzlePiece,
                  { width: 79, height: 47, top: 192, left: 131 },
                ]}
              />
            )}
            {!item.openIndex.includes(33) && (
              <Image
                source={require("@Assets/PuzzlePieces/5-3.png")}
                style={[
                  styles.puzzlePiece,
                  { width: 46, height: 61, top: 178, left: 195 },
                ]}
              />
            )}
            {!item.openIndex.includes(34) && (
              <Image
                source={require("@Assets/PuzzlePieces/5-6.png")}
                style={[
                  styles.puzzlePiece,
                  { width: 79, height: 47, top: 192, left: 226 },
                ]}
              />
            )}
            {!item.openIndex.includes(35) && (
              <Image
                source={require("@Assets/PuzzlePieces/5-7.png")}
                style={[
                  styles.puzzlePiece,
                  { width: 46, height: 61, top: 178, left: 291 },
                ]}
              />
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    alignItems: "center",
    width: "100%",
    backgroundColor: "#F3F1E7",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    gap: 5,
  },
  container: {
    flex: 1,
    alignItems: "flex-start",
    paddingBottom: 20,
    gap: 20,
    paddingTop: 60,
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
  colorPickerContainaer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  colorPicker: {
    maxWidth: "80%",
    objectFit: "contain",
  },
  btnWrapper: {
    display: "flex",
    flexDirection: "row",
    gap: 18,
  },
  menuContainer: {},
  menu: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  puzzleContainer: {
    width: 350,
    height: 250,
    marginTop: 120,
  },
  puzzleImage: {
    height: 225,
    width: 325,
    objectFit: "cover",
    position: "absolute",
    zIndex: -1,
    left: "50%",
    top: "50%",
    transform: [
      { translateX: -162.5 }, // (325 / 2) = -162.5
      { translateY: -112.5 }, // (225 / 2) = -112.5
    ],
  },
  puzzleBorder: {
    height: "100%",
    width: "100%",
    resizeMode: "stretch",
    zIndex: 3,
  },
  puzzlePieces: {
    zIndex: 2,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    position: "absolute",
    top: 20,
    left: 35,
    transform: [{ scale: 0.85 }],
  },
  puzzlePiece: {
    position: "absolute",
    objectFit: "contain",
    tintColor: Colors.dark?.colorPrimary,
  },
});
