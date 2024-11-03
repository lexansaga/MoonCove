import Button from "@Components/Button";
import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  Text,
  Image,
  ToastAndroid,
  Animated,
} from "react-native";
import tinycolor from "tinycolor2";

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
  const GRID_COLUMNS = 2; // Number of columns for the grid

  // Generate 10 colors around a random base color with an Animated.Value for animations
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

  const checkIfSorted = (grid: any) => {
    let sorted = true;
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
            `Cheat mode ${cheatMode === true ? "Activated" : "Deactivated"}!`,
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM
          );
        }}
      >
        Level {level.toString()}
      </Text>
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
                  {cheatMode === true && (
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
          {/* {!isSorted && (
            <Button title="Check" onPress={() => checkIfSorted(colorGrid)} />
          )} */}
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
              }}
            />
          )}
        </View>
      </View>

      <View
        style={{
          flex: 1,
          height: "100%",
          width: "100%",
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        }}
        pointerEvents="none"
      >
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
});
