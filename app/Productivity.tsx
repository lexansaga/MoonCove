import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { FontAwesome } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import Button from "@Components/Button";
import FloatingGlitter from "@Components/FloatingGlitters";
import { useRouter } from "expo-router";

const Productivity: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const router = useRouter();
  // Sample markings with emoji icons for productivity
  const markedDates = {
    "2023-02-08": {
      marked: true,
      dotColor: "transparent",
      customStyles: {
        container: { backgroundColor: Colors.status.good },
        text: { color: "#333" },
        emoji: "😊",
      },
    },
    "2023-02-09": {
      marked: true,
      dotColor: "transparent",
      customStyles: {
        container: { backgroundColor: Colors.status.excellent },
        text: { color: "#333" },
        emoji: "😄",
      },
    },
    "2023-02-10": {
      marked: true,
      dotColor: "transparent",
      customStyles: {
        container: { backgroundColor: Colors.status.worst },
        text: { color: "#333" },
        emoji: "😫",
      },
    },
  };

  // Handle date selection
  const onDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
    console.log("Selected Date: ", day.dateString);
    router.push("/Session");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.calendarContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Productivity</Text>
        </View>
        <Calendar
          current={"2023-02-01"}
          onDayPress={onDayPress}
          markedDates={{
            ...markedDates,
            [selectedDate]: {
              selected: true,
              selectedColor: Colors.highlight,
            },
          }}
          theme={{
            backgroundColor: Colors.dark.colorPrimary,
            calendarBackground: Colors.dark.colorPrimary,
            textSectionTitleColor: "#FFF",
            selectedDayBackgroundColor: Colors.highlight,
            selectedDayTextColor: "#FFF",
            dayTextColor: "#FFF",
            todayTextColor: Colors.highlight,
            monthTextColor: "#FFF",
            textDayFontFamily: "HazelnutMilktea-Bold",
            textMonthFontFamily: "HazelnutMilktea-Bold",
            textDayHeaderFontFamily: "HazelnutMilktea-Bold",
          }}
          markingType={"custom"}
        />

        <FloatingGlitter />
        <FloatingGlitter />
        <FloatingGlitter />
        <FloatingGlitter />
        <FloatingGlitter />
        <FloatingGlitter />
        <FloatingGlitter />
        <FloatingGlitter />
      </View>

      {/* Legend for Productivity Status */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendColor,
              { backgroundColor: Colors.status.worst },
            ]}
          />
          <Text style={styles.legendText}>Worst</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendColor, { backgroundColor: Colors.status.bad }]}
          />
          <Text style={styles.legendText}>Bad</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendColor,
              { backgroundColor: Colors.status.good },
            ]}
          />
          <Text style={styles.legendText}>Good</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendColor,
              { backgroundColor: Colors.status.excellent },
            ]}
          />
          <Text style={styles.legendText}>Excellent</Text>
        </View>
      </View>

      {/* Back Button */}
      <View style={styles.buttonWrapper}>
        <Button title="BACK" href="/HomeScreen" variant="Secondary" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FDFCF8",

    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: "#FFF",
    fontFamily: "HazelnutMilktea-Bold",
  },
  calendarContainer: {
    width: "100%",
    backgroundColor: Colors.dark.colorPrimary,
    borderRadius: 30,
    borderTopStartRadius: 0,
    borderTopEndRadius: 0,
    paddingBottom: 30,
    paddingHorizontal: 20,
    marginBottom: 20,
    paddingTop: 80,
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginVertical: 20,
    flexWrap: "wrap",
    gap: 4,
  },
  legendItem: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 5,
  },
  legendText: {
    color: "#333",
    fontFamily: "HazelnutMilktea-Bold",
    fontSize: 20,
  },
  buttonWrapper: {
    marginTop: 20,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Productivity;
