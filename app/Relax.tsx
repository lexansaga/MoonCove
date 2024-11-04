import Button from "@Components/Button";
import ModalComponent from "@Components/Modal";
import { Link, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  RefreshControl,
  Text,
} from "react-native";
import { FontAwesome, FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { Colors } from "@/constants/Colors";
import { globalStyles } from "@/constants/GlobalStyles";
import useSettings from "@/store/Settings.store";

export default function Relax() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTimeModalVisible, setIsTimeModalVisible] = useState(false);
  const [selectedHours, setSelectedHours] = useState<number>(0);
  const [selectedMinutes, setSelectedMinutes] = useState<number>(0);
  const [selectedSeconds, setSelectedSeconds] = useState<number>(0);

  // Accessing states and functions from useSettings store
  const timer = useSettings((state) => state.timer);
  const setTimer = useSettings((state) => state.setProductivityTimer);
  const volume = useSettings((state) => state.volume);
  const toggleVolume = useSettings((state) => state.toggleVolume);

  useEffect(() => {
    console.log(volume);
    console.log(timer);
  }, [volume]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const handleMenuPress = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleSelectTimePress = () => {
    setIsTimeModalVisible(true);
  };

  const handleCloseTimeModal = () => {
    setIsTimeModalVisible(false);
  };

  const handleCheckPress = () => {
    const timeString = `${selectedHours
      .toString()
      .padStart(2, "0")} -- ${selectedMinutes
      .toString()
      .padStart(2, "0")} -- ${selectedSeconds.toString().padStart(2, "0")}`;
    setTimer(timeString);
    handleCloseModal();
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollViewContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} activeOpacity={0.7}>
          <FontAwesome6
            name="chevron-left"
            size={18}
            color={Colors.default.colorTextBrown}
          />
          <Link href={"/HomeScreen"} style={globalStyles.overlink}></Link>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.colorPickerContainaer}
          activeOpacity={0.8}
        >
          <Image
            source={require("@Assets/color-picker.png")}
            style={styles.colorPicker}
          />
        </TouchableOpacity>
        <View style={styles.btnWrapper}>
          <Button
            title={"Start"}
            customStyles={{
              backgroundColor: "#F4511E",
              color: "white",
              width: 180,
            }}
            onPress={() => {
              router.push("/ColorSort");
            }}
          />
          <TouchableOpacity
            style={styles.menuContainer}
            onPress={handleMenuPress}
          >
            <Image source={require("@Assets/menu.png")} style={styles.menu} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal for Timer Selection */}
      <ModalComponent
        visible={isModalVisible}
        title="Set Time"
        content={
          <View style={styles.timerContent}>
            <TouchableOpacity
              style={styles.timerSelectButton}
              onPress={handleSelectTimePress}
            >
              <Text style={styles.timerText}>
                {`${selectedHours
                  .toString()
                  .padStart(2, "0")} -- ${selectedMinutes
                  .toString()
                  .padStart(2, "0")} -- ${selectedSeconds
                  .toString()
                  .padStart(2, "0")}`}
              </Text>
            </TouchableOpacity>
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={toggleVolume}>
                {volume ? (
                  <MaterialIcons name="volume-up" size={40} color="black" />
                ) : (
                  <MaterialIcons name="volume-off" size={40} color="black" />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCheckPress}
                style={styles.checkButton}
              >
                <FontAwesome6
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

      {/* Modal for Time Selection */}
      <ModalComponent
        visible={isTimeModalVisible}
        title="Select Timer"
        content={
          <View style={styles.timerPickersContainer}>
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
          </View>
        }
        onClose={handleCloseTimeModal}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#F3F1E7",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  backButton: {
    position: "absolute",
    top: 45,
    left: -15,
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
  timerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  timerText: {
    fontSize: 20,
    fontFamily: "HazelnutMilktea-Bold",
  },
  timerSelectButton: {
    borderRadius: 20,
    paddingHorizontal: 20,
    borderWidth: 2,
    paddingVertical: 10,
    borderColor: Colors.default.colorTextBrown,
    marginBottom: 20,
  },
  timerSelectText: {
    fontSize: 16,
    color: "#333",
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
  timerPickersContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 8,
  },
  picker: {
    width: "100%",
    overflow: "hidden",
    color: "#000",
  },
  timerContainer: {
    flexDirection: "column",
    gap: 8,
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
    borderColor: Colors.default.colorTextBrown,
  },
});
