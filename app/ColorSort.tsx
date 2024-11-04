import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  Text,
  Image,
  ToastAndroid,
  Animated,
  Alert,
} from "react-native";
import tinycolor from "tinycolor2";
import Button from "@Components/Button";
import { Audio } from "expo-av";
import useSettings from "@/store/Settings.store";

export default function ColorSort() {
  const [colorGrid, setColorGrid] = useState(
    generateColors().map((item) => ({
      ...item,
      animatedValue: new Animated.Value(1), // Ensure initialization here
    }))
  );
  const [isSorted, setIsSorted] = useState(false);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [level, setLevel] = useState(1);
  const [cheatMode, setCheatMode] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);
  const [timeLeft, setTimeLeft] = useState(60); // Timer in seconds
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Access the volume state from the settings store
  const volume = useSettings((state) => state.volume);

  useEffect(() => {
    // Load and play sound on component mount
    const loadSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          {
            uri: "https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg",
          },
          { shouldPlay: volume, isLooping: true }
        );
        soundRef.current = sound;
      } catch (error) {
        console.error("Error loading sound from URI:", error);
      }
    };
    loadSound();

    // Start the timer countdown
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          Alert.alert("Time's up!", "Moving to the next level.");
          setIsSorted(true); // Show the Next Level button when time runs out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      // Unload sound when component unmounts and clear the timer
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [volume]);

  // Stop sound if volume is off
  useEffect(() => {
    if (soundRef.current) {
      if (volume) {
        soundRef.current.playAsync();
      } else {
        soundRef.current.stopAsync();
      }
    }
  }, [volume]);

  // Generate colors for the grid
  function generateColors() {
    const baseColor = tinycolor.random().toHexString();
    const colors = [];
    for (let i = -5; i <= 5; i++) {
      if (i !== 0) {
        const newColor =
          i > 0
            ? tinycolor(baseColor)
                .lighten(i * 5)
                .toHexString()
            : tinycolor(baseColor)
                .darken(Math.abs(i) * 5)
                .toHexString();
        colors.push({ color: newColor, originalIndex: colors.length });
      }
    }
    return colors.sort(() => Math.random() - 0.5);
  }

  // Handle color press for swapping
  const handleColorPress = (index: number) => {
    if (selectedIndices.length === 0) {
      setSelectedIndices([index]);
    } else if (selectedIndices.length === 1) {
      const [firstIndex] = selectedIndices;
      const newColorGrid = [...colorGrid];
      [newColorGrid[firstIndex], newColorGrid[index]] = [
        newColorGrid[index],
        newColorGrid[firstIndex],
      ];

      // Animate the swap effect
      Animated.sequence([
        Animated.timing(newColorGrid[firstIndex].animatedValue, {
          toValue: 0.5,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(newColorGrid[firstIndex].animatedValue, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(newColorGrid[index].animatedValue, {
          toValue: 0.5,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(newColorGrid[index].animatedValue, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      setColorGrid(newColorGrid);
      setSelectedIndices([]);
      checkIfSorted(newColorGrid);
    }
  };

  // Check if the grid is sorted
  const checkIfSorted = (grid: any) => {
    let sorted = true;
    const GRID_COLUMNS = 2; // Define grid columns

    for (let col = 0; col < GRID_COLUMNS; col++) {
      for (let row = 1; row < grid.length / GRID_COLUMNS; row++) {
        const currentIndex = row * GRID_COLUMNS + col;
        const previousIndex = (row - 1) * GRID_COLUMNS + col;

        if (currentIndex < grid.length) {
          const currentBrightness = tinycolor(
            grid[currentIndex].color
          ).getBrightness();
          const previousBrightness = tinycolor(
            grid[previousIndex].color
          ).getBrightness();

          if (previousBrightness > currentBrightness) {
            sorted = false;
            break;
          }
        }
      }
      if (!sorted) break;
    }

    setIsSorted(sorted);
    if (sorted) {
      clearInterval(timerRef.current!);
      ToastAndroid.showWithGravity(
        "Colors are sorted correctly!",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <Text
        style={styles.title}
        onLongPress={() => {
          setCheatMode(!cheatMode);
          ToastAndroid.showWithGravity(
            `Cheat mode ${cheatMode ? "Deactivated" : "Activated"}!`,
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM
          );
        }}
      >
        Level {level}
      </Text>
      <Text style={styles.timer}>Time Left: {timeLeft}s</Text>
      <View style={styles.container}>
        <View style={styles.colorGrid}>
          {colorGrid.map((item, index) => {
            const isDarkColor = tinycolor(item.color).isDark();
            return (
              <Animated.View
                key={index}
                style={[
                  styles.colorBox,
                  { backgroundColor: item.color, opacity: item.animatedValue },
                ]}
              >
                <TouchableOpacity
                  onPress={() => handleColorPress(index)}
                  activeOpacity={0.8}
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {cheatMode && (
                    <Text
                      style={[
                        styles.colorIndexText,
                        { color: isDarkColor ? "#FFF" : "#000" },
                      ]}
                    >
                      {item.originalIndex}
                    </Text>
                  )}
                  {selectedIndices.includes(index) && (
                    <Image
                      source={require("@Assets/glitters-left.png")}
                      style={styles.selectedColorImage}
                    />
                  )}
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
        <View style={styles.btnWrapper}>
          {isSorted && (
            <Button
              title="Next Level"
              onPress={() => {
                setColorGrid(
                  generateColors().map((item) => ({
                    ...item,
                    animatedValue: new Animated.Value(1),
                  }))
                );
                setIsSorted(false);
                setLevel(level + 1);
                setTimeLeft(60); // Reset timer for the next level
                timerRef.current = setInterval(() => {
                  setTimeLeft((prev) => {
                    if (prev <= 1) {
                      clearInterval(timerRef.current!);
                      Alert.alert("Time's up!", "Moving to the next level.");
                      setIsSorted(true);
                      return 0;
                    }
                    return prev - 1;
                  });
                }, 1000);
              }}
            />
          )}
        </View>
      </View>

      <View style={styles.overlayContainer} pointerEvents="none">
        <Image
          source={require("@Assets/shooting-star.png")}
          style={styles.floatingRight}
        />
        <Image
          source={require("@Assets/planet.png")}
          style={styles.floatingLeft}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FDE1D4",
    padding: 20,
    borderRadius: 25,
    paddingBottom: 35,
  },
  title: {
    fontSize: 32,
    color: "#333",
    marginBottom: 20,
    fontFamily: "HazelnutMilktea-Bold",
  },
  timer: {
    fontSize: 18,
    color: "#000",
    marginBottom: 10,
    fontFamily: "HazelnutMilktea-Bold",
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "80%",
  },
  colorBox: {
    width: "50%",
    height: 60,
    borderRadius: 50,
    position: "relative",
  },
  colorIndexText: {
    fontWeight: "bold",
    fontSize: 12,
    position: "absolute",
    top: 15,
    left: 15,
  },
  selectedColorImage: {
    height: "50%",
    resizeMode: "contain",
    tintColor: "#FFF",
  },
  btnWrapper: {
    marginTop: 20,
    display: "flex",
    justifyContent: "center",
    gap: 8,
  },
  floatingLeft: {
    position: "absolute",
    bottom: 0,
    left: 0,
    transform: [{ translateX: -50 }, { translateY: 200 }],
    width: "80%",
    resizeMode: "contain",
    pointerEvents: "none",
  },
  floatingRight: {
    position: "absolute",
    top: 0,
    right: 0,
    transform: [{ translateX: 50 }, { translateY: -50 }],
    width: "80%",
    resizeMode: "contain",
    pointerEvents: "none",
  },
  overlayContainer: {
    flex: 1,
    height: "100%",
    width: "100%",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
