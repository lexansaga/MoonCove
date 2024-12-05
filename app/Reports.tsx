import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import { VictoryChart, VictoryBar, VictoryAxis } from "victory-native";
import { Colors } from "@/constants/Colors";
import { ref, get } from "firebase/database";
import { database } from "@/firebase/Firebase";
import useUser from "@/store/User.store";
import Button from "@Components/Button";
import { Link } from "expo-router";
import FloatingGlitter from "@Components/FloatingGlitters";
import { Feather } from "@expo/vector-icons";

interface Session {
  progress?: number;
  [key: string]: any;
}

interface Sessions {
  [date: string]: {
    sessions: {
      [sessionId: string]: Session;
    };
  };
}

const Reports: React.FC = () => {
  const currentUser = useUser();
  const [graphData, setGraphData] = useState<
    { x: string; y: number }[] // X-axis is the date, Y-axis is progress
  >([]);
  const [view, setView] = useState<"yearly" | "monthly" | "weekly">("yearly");
  const [refreshing, setRefreshing] = useState(false);

  const generateEmptyData = (data: { x: string; y: number }[]) => {
    const maxItems = 5;

    if (data.length < maxItems) {
      const missingItems = maxItems - data.length;
      const leftPadding = Math.floor(missingItems / 2);
      const rightPadding = missingItems - leftPadding;

      const leftBlanks = Array(leftPadding).fill({ x: "", y: 0 });
      const rightBlanks = Array(rightPadding).fill({ x: "", y: 0 });

      return [...leftBlanks, ...data, ...rightBlanks];
    }

    return data;
  };

  const processData = (sessions: Sessions): { x: string; y: number }[] => {
    const data: Record<string, number> = {};

    Object.keys(sessions).forEach((date) => {
      const dailySessions = sessions[date]?.sessions || {};
      const totalProgress = Object.values(dailySessions).reduce(
        (sum, session: Session) => sum + (session.progress || 0),
        0
      );

      const averageProgress =
        Object.keys(dailySessions).length > 0
          ? totalProgress / Object.keys(dailySessions).length
          : 0;

      const formattedX =
        view === "yearly"
          ? new Date(date).getFullYear().toString()
          : view === "monthly"
          ? new Date(date).toLocaleString("default", { month: "long" }) // Month name
          : `Week ${Math.ceil(new Date(date).getDate() / 7)}`; // Weekly format

      data[formattedX] = Math.min(100, Math.max(0, averageProgress)); // Clamp progress between 0 and 100
    });

    const sortedData = Object.entries(data)
      .map(([x, y]) => ({ x, y }))
      .sort((a, b) => (view === "yearly" ? a.x.localeCompare(b.x) : 0)); // Sort by year if yearly

    return generateEmptyData(sortedData);
  };

  const fetchData = async (): Promise<void> => {
    if (!currentUser?.id) {
      console.error("User ID not found.");
      return;
    }

    const sessionRef = ref(database, `Sessions/${currentUser.id}`);
    const snapshot = await get(sessionRef);

    if (snapshot.exists()) {
      const sessions: Sessions = snapshot.val();
      const formattedData = processData(sessions);
      setGraphData(formattedData);
    } else {
      console.error("No data found for the given user.");
      setGraphData(generateEmptyData([]));
    }
  };

  useEffect(() => {
    fetchData();
  }, [view, currentUser?.id]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData().finally(() => setRefreshing(false));
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Link href="/HomeScreen">
            <Feather
              name="home"
              size={24}
              color="#fff"
              style={styles.homeIcon}
            />
          </Link>

          <Text style={styles.headerText}>Progress Reports</Text>
        </View>

        {/* Bar Chart */}
        {graphData.length > 0 ? (
          <VictoryChart domainPadding={{ x: 20, y: [0, 10] }}>
            {/* X-Axis */}
            <VictoryAxis
              tickFormat={(t) => t} // Display dynamic ticks
              label={
                view === "yearly"
                  ? "Years"
                  : view === "monthly"
                  ? "Months"
                  : "Weeks"
              }
              style={{
                axis: { stroke: "transparent" }, // Remove axis line
                axisLabel: { padding: 30, fontSize: 14, fill: "white" },
                tickLabels: { fontSize: 12, fill: "white" },
              }}
            />

            {/* Y-Axis */}
            <VictoryAxis
              dependentAxis
              domain={[0, 100]} // Clamp Y-axis between 0 and 100
              label="Progress (%)"
              style={{
                axis: { stroke: "transparent" }, // Remove axis line
                axisLabel: { padding: 40, fontSize: 14, fill: "white" },
                tickLabels: { fontSize: 12, fill: "white" },
              }}
            />

            {/* Bar Chart */}
            <VictoryBar
              data={graphData}
              style={{
                data: {
                  fill: "white", // Bar color
                  width: 15, // Bar width
                },
              }}
            />
          </VictoryChart>
        ) : (
          <Text style={styles.noDataText}>No data available</Text>
        )}

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Yearly"
            variant="Primary"
            onPress={() => setView("yearly")}
            customStyles={{
              backgroundColor:
                view === "yearly"
                  ? Colors.default.colorGreen
                  : Colors.default.colorGrey,
            }}
          />
          <Button
            title="Monthly"
            variant="Primary"
            onPress={() => setView("monthly")}
            customStyles={{
              backgroundColor:
                view === "monthly"
                  ? Colors.default.colorGreen
                  : Colors.default.colorGrey,
            }}
          />
          <Button
            title="Weekly"
            variant="Primary"
            onPress={() => setView("weekly")}
            customStyles={{
              backgroundColor:
                view === "weekly"
                  ? Colors.default.colorGreen
                  : Colors.default.colorGrey,
            }}
          />
        </View>

        <FloatingGlitter />
        <FloatingGlitter />
        <FloatingGlitter />
        <FloatingGlitter />
        <FloatingGlitter />
        <FloatingGlitter />
        <FloatingGlitter />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: Colors.dark.background,
    paddingTop: 50,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    width: "100%",
    color: Colors.dark.text,
    marginBottom: 20,
    textAlign: "center",
  },
  header: {
    position: "relative",
    alignItems: "flex-start",
    marginBottom: 20,
    marginLeft: 10,
  },
  homeIcon: {
    marginLeft: 10,
    tintColor: "white",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    color: "white",
  },
});

export default Reports;
