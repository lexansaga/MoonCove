import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  Platform,
  Alert,
} from "react-native";
import { Colors } from "@/constants/Colors";
import Button from "@Components/Button"; // Assuming Button component is located here
import { globalStyles } from "@/constants/GlobalStyles";
import { Link } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import FloatingGlitter from "@Components/FloatingGlitters";
import { Audio } from "expo-av";
import ModalComponent from "@Components/Modal";
import { Picker } from "@react-native-picker/picker";
import * as TaskManager from "expo-task-manager";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BACKGROUND_FETCH_TASK = "background-fetch";

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async ({ data, error }) => {
  if (error) {
    console.error(error);
    return;
  }

  try {
    const timerState = await AsyncStorage.getItem("timerState");
    if (timerState) {
      const { time, isRunning } = JSON.parse(timerState);
      if (isRunning && time > 0) {
        const newTime = time - 1;
        await AsyncStorage.setItem(
          "timerState",
          JSON.stringify({ time: newTime, isRunning })
        );

        if (newTime === 0) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: "Time's up!",
              body: "Your timer has ended.",
            },
            trigger: null, // Show immediately
          });
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const Timer: React.FC = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedHours, setSelectedHours] = useState<number>(0);
  const [selectedMinutes, setSelectedMinutes] = useState<number>(0);
  const [selectedSeconds, setSelectedSeconds] = useState<number>(0);
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

    // Request permissions for push notifications
    const requestPermissions = async () => {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    };
    requestPermissions();

    // Load timer state from AsyncStorage
    const loadTimerState = async () => {
      const timerState = await AsyncStorage.getItem("timerState");
      if (timerState) {
        const { time, isRunning } = JSON.parse(timerState);
        setTime(time);
        setIsRunning(isRunning);
      }
    };
    loadTimerState();

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
    const emptyHours =
      selectedHours === 0 && selectedMinutes === 0 && selectedSeconds === 0;
    timerRef.current = setInterval(() => {
      if (emptyHours) {
        setTime((prevTime) => prevTime + 1);
      } else {
        setTime((prevTime) => {
          console.log(prevTime);
          if (prevTime === 0) {
            stopTimer();
            showNotification();
          }
          return prevTime - 1;
        });
      }
    }, 1000);

    // Play sound when starting the timer
    try {
      if (soundRef.current) {
        await soundRef.current.replayAsync();
      }
    } catch (error) {
      console.error("Error playing sound:", error);
    }

    // Save timer state to AsyncStorage
    await AsyncStorage.setItem(
      "timerState",
      JSON.stringify({ time, isRunning: true })
    );
  };

  // Pause the timer
  const pauseTimer = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRunning(false);

    // Save timer state to AsyncStorage
    await AsyncStorage.setItem(
      "timerState",
      JSON.stringify({ time, isRunning: false })
    );
  };

  // Stop and reset the timer and stop music
  const stopTimer = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRunning(false);
    setTime(0);
    handleClearPress();

    // Stop and reset sound when timer stops
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.setPositionAsync(0);
    }

    // Save timer state to AsyncStorage
    await AsyncStorage.setItem(
      "timerState",
      JSON.stringify({ time: 0, isRunning: false })
    );
  };

  // Show notification when the timer ends
  const showNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Time's up!",
        body: "Your timer has ended.",
      },
      trigger: null, // Show immediately
    });
  };

  // Format time in HH:MM:SS
  const formatTime = (timeInSeconds: number) => {
    const hours = String(Math.floor(timeInSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((timeInSeconds % 3600) / 60)).padStart(
      2,
      "0"
    );
    const seconds = String(timeInSeconds % 60).padStart(2, "0");
    return `${hours}h : ${minutes}m : ${seconds}s`;
  };

  // Toggle focus mode
  const toggleFocusMode = () => {
    setIsFocusMode(!isFocusMode);
  };

  const handleMenuPress = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleCheckPress = async () => {
    const totalSeconds =
      selectedHours * 3600 + selectedMinutes * 60 + selectedSeconds;
    setTime(totalSeconds);
    handleCloseModal();

    // Save timer state to AsyncStorage
    await AsyncStorage.setItem(
      "timerState",
      JSON.stringify({ time: totalSeconds, isRunning })
    );
  };

  const handleClearPress = async () => {
    setSelectedHours(0);
    setSelectedMinutes(0);
    setSelectedSeconds(0);

    // Save timer state to AsyncStorage
    await AsyncStorage.setItem(
      "timerState",
      JSON.stringify({ time: 0, isRunning: false })
    );
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
        <TouchableOpacity
          style={styles.clockButton}
          activeOpacity={0.7}
          onPress={handleMenuPress}
        >
          <FontAwesome5
            name="clock"
            size={18}
            color={Colors.default.colorSecondary}
          />
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
                title={isRunning ? "PAUSE" : "START"}
                variant="Primary"
                onPress={isRunning ? pauseTimer : startTimer}
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

        {/* Modal for Timer Selection */}
        <ModalComponent
          visible={isModalVisible}
          title="Set Time"
          content={
            <View style={styles.timerContent}>
              <View style={styles.timerContainer}>
                <Text style={styles.timerTitle}>Hours</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={selectedHours}
                    style={styles.picker}
                    onValueChange={(itemValue) => setSelectedHours(itemValue)}
                  >
                    {[...Array(24).keys()].map((value) => (
                      <Picker.Item
                        key={value}
                        label={value.toString().padStart(2, "0")}
                        value={value}
                      />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.timerContainer}>
                <Text style={styles.timerTitle}>Minutes</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={selectedMinutes}
                    style={styles.picker}
                    onValueChange={(itemValue) => setSelectedMinutes(itemValue)}
                  >
                    {[...Array(60).keys()].map((value) => (
                      <Picker.Item
                        key={value}
                        label={value.toString().padStart(2, "0")}
                        value={value}
                      />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.timerContainer}>
                <Text style={styles.timerTitle}>Seconds</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={selectedSeconds}
                    style={styles.picker}
                    onValueChange={(itemValue) => setSelectedSeconds(itemValue)}
                  >
                    {[...Array(60).keys()].map((value) => (
                      <Picker.Item
                        key={value}
                        label={value.toString().padStart(2, "0")}
                        value={value}
                      />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.iconContainer}>
                <TouchableOpacity onPress={handleClearPress}>
                  <FontAwesome5 name="trash" size={25} color="black" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleCheckPress}
                  style={styles.checkButton}
                >
                  <FontAwesome5
                    name="check"
                    size={25}
                    color={Colors.default.colorTextBrown}
                  />
                </TouchableOpacity>
              </View>
            </View>
          }
          onClose={handleCloseModal}
        />
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
  clockButton: {
    position: "absolute",
    top: 45,
    right: 15,
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
    width: "100%",
  },
  floatingGlobe: {
    width: 35,
    height: 35,
    resizeMode: "contain",
    alignSelf: "flex-end",
    right: 20,
  },
  floatingMoon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    position: "absolute",
    top: "50%",
    transform: [{ translateY: -150 }],
    right: 25,
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
    fontSize: 26,
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
  timerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  timerTitle: {
    fontFamily: "HazelnutMilktea-Bold",
    fontSize: 14,
    position: "relative",
    left: 10,
  },
  pickerContainer: {
    borderRadius: 50,
    borderWidth: 2,
    width: "100%",
    borderColor: Colors.default.colorTextBrown,
  },
  picker: {
    width: "100%",
    overflow: "hidden",
    color: "#000",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 10,
  },
  checkButton: {
    width: 50,
    height: 50,
    borderColor: Colors.default.colorTextBrown,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Timer;
