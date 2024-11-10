import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
} from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import Button from "@Components/Button";
import FloatingGlitter from "@Components/FloatingGlitters";
import { Link, useRouter } from "expo-router";
import { globalStyles } from "@/constants/GlobalStyles";
import { ref, onValue } from "firebase/database";
import { authentication, database } from "@/firebase/Firebase";
import useUser from "@/store/User.store";

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  date_created?: string;
  date_finish?: string;
}

interface SessionData {
  id: string;
  title: string;
  tasks: { [key: string]: Task };
}

const Productivity: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);
  const [markedDates, setMarkedDates] = useState<any>({});
  const user = useUser();

  const currentUserId = authentication.currentUser?.uid;
  const router = useRouter();

  useEffect(() => {
    const fetchSessions = async () => {
      if (!currentUserId) {
        Alert.alert("Error", "User ID is missing.");
        return;
      }

      try {
        // Fetch sessions data from Firebase
        const userSessionsRef = ref(database, `Sessions/${currentUserId}/`);
        onValue(userSessionsRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const newMarkedDates: any = {};
            Object.keys(data).forEach((date) => {
              const dateData = data[date];
              const sessions = dateData.sessions
                ? Object.values(dateData.sessions)
                : [];

              if (!Array.isArray(sessions)) {
                console.error(
                  `Unexpected data format for sessions on date ${date}:`,
                  sessions
                );
                return;
              }

              let totalTasks = 0;
              let completedTasks = 0;

              sessions.forEach((session: SessionData) => {
                totalTasks += Object.values(session.tasks).length;
                completedTasks += Object.values(session.tasks).filter(
                  (task: Task) => task.status === "completed"
                ).length;
              });

              let statusColor = Colors.status.worst;
              let emoji = "😫";

              if (totalTasks > 0) {
                const completionRate = (completedTasks / totalTasks) * 100;
                if (completionRate === 100) {
                  statusColor = Colors.status.excellent;
                  emoji = "😄";
                } else if (completionRate > 50) {
                  statusColor = Colors.status.good;
                  emoji = "😊";
                } else if (completionRate > 0) {
                  statusColor = Colors.status.bad;
                  emoji = "😟";
                }
              }

              newMarkedDates[date] = {
                marked: true,
                dotColor: "transparent",
                customStyles: {
                  container: { backgroundColor: statusColor },
                  text: { color: "#333" },
                  emoji,
                },
              };
            });

            if (
              JSON.stringify(newMarkedDates) !== JSON.stringify(markedDates)
            ) {
              setMarkedDates(newMarkedDates);
            }
          }
        });
      } catch (error) {
        console.error("Error processing snapshot data:", error);
        Alert.alert(
          "Error",
          "Failed to fetch or process data. Please try again."
        );
      }
    };

    fetchSessions();
  }, [currentUserId]);

  // Handle date selection
  const onDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
    console.log("Selected Date: ", day.dateString);

    router.push({
      pathname: "/Session",
      params: { selectedDate: day.dateString },
    });
  };

  // Refresh control function
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <TouchableOpacity style={styles.backButton} activeOpacity={0.7}>
        <FontAwesome6
          name="chevron-left"
          size={18}
          color={Colors.default.colorSecondary}
        />
        <Link href={"/HomeScreen"} style={globalStyles.overlink}></Link>
      </TouchableOpacity>
      <View style={styles.calendarContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Productivity</Text>
        </View>
        <Calendar
          current={new Date().toISOString().split("T")[0]}
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
});

export default Productivity;
