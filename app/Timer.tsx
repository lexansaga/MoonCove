import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { Colors } from "@/constants/Colors";
import Button from "@Components/Button"; // Assuming Button component is located here
import { globalStyles } from "@/constants/GlobalStyles";
import { Link } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import FloatingGlitter from "@Components/FloatingGlitters";
import { Audio } from "expo-av";

const Timer: React.FC = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  // Load and configure the sound on component mount
  useEffect(() => {
    const loadSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require("@Music/bgm.mp3"),
          { shouldPlay: true, isLooping: true }
        );
        soundRef.current = sound;
      } catch (error) {
        console.error("Error loading sound from URI:", error);
      }
    };
    loadSound();

    return () => {
      // Unload sound when component unmounts
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  // Start the timer and play music
  const startTimer = async () => {
    setIsRunning(true);
    timerRef.current = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);

    // Play sound when starting the timer
    try {
      if (soundRef.current) {
        await soundRef.current.replayAsync();
      }
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  // Stop and reset the timer and stop music
  const stopTimer = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRunning(false);
    setTime(0);

    // Stop and reset sound when timer stops
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.setPositionAsync(0);
    }
  };

  // Format time in HH:MM:SS
  const formatTime = (timeInSeconds: number) => {
    const hours = String(Math.floor(timeInSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((timeInSeconds % 3600) / 60)).padStart(
      2,
      "0"
    );
    const seconds = String(timeInSeconds % 60).padStart(2, "0");
    return `${hours} : ${minutes} : ${seconds}`;
  };

  // Toggle focus mode
  const toggleFocusMode = () => {
    setIsFocusMode(!isFocusMode);
  };

  return (
    <TouchableWithoutFeedback>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} activeOpacity={0.7}>
          <FontAwesome5
            name="chevron-left"
            size={18}
            color={Colors.default.colorSecondary}
          />
          <Link href={"/HomeScreen"} style={globalStyles.overlink}></Link>
        </TouchableOpacity>
        <Text style={styles.title}>TIMER</Text>

        <View style={styles.timerContainer}>
          <View style={styles.timerCircle}>
            <Text style={styles.timeText}>{formatTime(time)}</Text>
          </View>
          <Image
            source={require("@Assets/globe.gif")}
            style={styles.floatingGlobe}
          />
          <Image
            source={require("@Assets/moon.png")}
            style={styles.floatingMoon}
          />
        </View>

        <View style={styles.buttonContainer}>
          {!isFocusMode ? (
            <>
              <Button
                title="START"
                variant="Primary"
                onPress={startTimer}
                customStyles={{
                  backgroundColor: Colors.default.colorGreen,
                }}
              />
              <Button
                title="FOCUS MODE"
                onPress={toggleFocusMode}
                customStyles={{
                  backgroundColor: Colors.default.colorGrey,
                  textColor: "white !important",
                }}
              />
              <Button
                title="STOP"
                onPress={stopTimer}
                customStyles={{
                  backgroundColor: Colors.default.colorRed,
                }}
              />
            </>
          ) : (
            <>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={toggleFocusMode}
                style={styles.lockButton}
              >
                <Image
                  source={require("@Assets/lock.png")}
                  style={styles.lockButton}
                />
              </TouchableOpacity>
            </>
          )}
        </View>

        <FloatingGlitter />
        <FloatingGlitter />
        <FloatingGlitter />
        <FloatingGlitter />
        <FloatingGlitter />
        <FloatingGlitter />
        <FloatingGlitter />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.colorPrimary,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 45,
    left: 15,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: Colors.default.colorSecondary,
    aspectRatio: 1,
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  title: {
    fontSize: 32,
    color: "#fff",
    fontFamily: "HazelnutMilktea-Bold",
    marginBottom: 20,
  },
  timerContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  floatingGlobe: {
    width: 35,
    height: 35,
    resizeMode: "contain",
    alignSelf: "flex-end",
  },
  floatingMoon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    position: "absolute",
    top: "50%",
    transform: [{ translateY: -30 }],
    right: -35,
  },
  timerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#FFC107",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FFC107",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 50,
  },
  timeText: {
    fontSize: 36,
    color: "white",
    fontFamily: "HazelnutMilktea-Bold",
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 60,
    gap: 10,
  },
  lockButton: {
    tintColor: "#fff",
    width: 50,
    height: 50,
    resizeMode: "contain",
    aspectRatio: 1,
  },
});

export default Timer;
