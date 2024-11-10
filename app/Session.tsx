import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  PanResponder,
  Image,
  RefreshControl,
} from "react-native";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import FloatingGlitter from "@Components/FloatingGlitters";
import { VictoryPie } from "victory-native";
import { Link, useLocalSearchParams } from "expo-router";
import { globalStyles } from "@/constants/GlobalStyles";
import Tasks from "@Components/Tasks";
import { get, ref, push, update } from "firebase/database";
import { database } from "@/firebase/Firebase";
import useUser from "@/store/User.store";
import useProductivity from "@/store/Productivity.store";

interface DataPoint {
  x: string;
  y: number;
  color: string;
}

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
  tasks: { [key: string]: Task }; // Updated to reflect the new structure
}

const Session: React.FC = () => {
  const { selectedDate } = useLocalSearchParams();
  const [activeSlice, setActiveSlice] = useState<DataPoint | null>(null);
  const [touchX, setTouchX] = useState<number>(0);
  const [touchY, setTouchY] = useState<number>(0);
  const [showTasks, setShowTasks] = useState(false);
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [selectedSession, setSelectedSession] = useState<SessionData | null>(
    null
  );
  const [refreshing, setRefreshing] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const user = useUser();

  useEffect(() => {
    // Fetch user sessions from Firebase
    const fetchSessions = async () => {
      try {
        const userRef = ref(
          database,
          `Sessions/${user.id}/${selectedDate}/sessions`
        );
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const sessionsArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setSessions(sessionsArray);
          console.log(sessions);
        }
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };

    fetchSessions();
  }, []);

  const categorizeTasks = (tasks: { [key: string]: Task }) => {
    let worst = 0;
    let bad = 0;
    let good = 0;
    let excellent = 0;

    Object.values(tasks).forEach((task) => {
      if (!task.date_created || !task.date_finish) {
        bad += 1;
      } else {
        const startDate = new Date(task.date_created).getTime();
        const endDate = new Date(task.date_finish).getTime();
        const durationHours = (endDate - startDate) / (1000 * 60 * 60);
        console.log(task);
        if (durationHours <= 1) {
          excellent += 1;
        } else if (durationHours <= 3) {
          good += 1;
        } else if (durationHours <= 5) {
          bad += 1;
        } else {
          worst += 1;
        }
      }
    });

    return [
      {
        x: "Worst",
        y: bad === 0 && good === 0 && excellent === 0 ? 1 : worst,
        color: "#FF6B6B",
      },
      { x: "Bad", y: bad, color: "#FFA07A" },
      { x: "Good", y: good, color: "#B2D8B2" },
      { x: "Excellent", y: excellent, color: "#4CAF50" },
    ];
  };

  const data = categorizeTasks(
    sessions.reduce((acc, session) => ({ ...acc, ...session.tasks }), {})
  );
  const total = data.reduce((sum, slice) => sum + slice.y, 0);

  // PanResponder to track touch movement
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event) => {
        setTouchX(event.nativeEvent.pageX);
        setTouchY(event.nativeEvent.pageY);
      },
      onPanResponderRelease: () => setActiveSlice(null), // Hide tooltip on release
    })
  ).current;

  const toggleTasks = (session?: SessionData) => {
    if (session) {
      setSelectedSession(session);
    }
    if (showTasks) {
      Animated.timing(slideAnim, {
        toValue: 500,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowTasks(false);
        setSelectedSession(null);
      });
    } else {
      setShowTasks(true);
      Animated.timing(slideAnim, {
        toValue: 0, // Adjust based on screen size or task height
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleSessionSave = async (newSession: SessionData) => {
    // Add the new session to the sessions list
    setSessions((prevSessions) => [...prevSessions, newSession]);
    // Close the tasks component
    toggleTasks();
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Fetch the latest sessions from Firebase
    try {
      const userRef = ref(
        database,
        `Sessions/${user.id}/${selectedDate}/sessions`
      );
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const sessionsArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setSessions(sessionsArray);
        console.log("Sessions refreshed:", sessionsArray);
      }
    } catch (error) {
      console.error("Error refreshing sessions:", error);
    }
    setRefreshing(false);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <TouchableOpacity style={styles.backButton} activeOpacity={0.7}>
        <FontAwesome5
          name="chevron-left"
          size={18}
          color={Colors.default.colorSecondary}
        />
        <Link href={"/HomeScreen"} style={globalStyles.overlink}></Link>
      </TouchableOpacity>

      <View style={styles.productivityContainer} {...panResponder.panHandlers}>
        {data && (
          <View style={styles.pieChartContainer}>
            <VictoryPie
              data={data}
              colorScale={data.map((slice) => slice.color)}
              innerRadius={0}
              labelRadius={({ innerRadius }: any) => (innerRadius ?? 0) + 20}
              style={{
                labels: { fill: "white", fontSize: 12, fontWeight: "bold" },
                data: {
                  fillOpacity: ({ datum }) =>
                    activeSlice && activeSlice.x === datum.x ? 0.7 : 1,
                },
              }}
              labels={() => ""} // Hide default labels
              events={[
                {
                  target: "data",
                  eventHandlers: {
                    onPressIn: () => [
                      {
                        target: "data",
                        mutation: (props) => {
                          setActiveSlice(props.datum as DataPoint);
                          return {};
                        },
                      },
                    ],
                  },
                },
              ]}
            />
            <Image
              source={require("@Assets/person.png")}
              style={styles.personImage}
            />
          </View>
        )}
        <Text style={styles.productivityText}>Your Productivity</Text>

        <FloatingGlitter top={20} left={20} />
        <FloatingGlitter top={20} right={30} bottom={0} />
      </View>

      {activeSlice && (
        <View style={[styles.tooltip, { top: touchY - 50, left: touchX - 60 }]}>
          <Text style={styles.tooltipText}>
            {activeSlice.x}: {((activeSlice.y / total) * 100).toFixed(1)}%
          </Text>
        </View>
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.sessionContainer}
      >
        <TouchableOpacity
          style={[styles.sessionButton, styles.addSessionButton]}
          onPress={() => toggleTasks({} as SessionData)}
          activeOpacity={0.8}
        >
          <AntDesign name="pluscircleo" size={60} color={"#fff"} />
          <Text style={[styles.sessionButtonText, styles.addSessionButtonText]}>
            Add Session
          </Text>
        </TouchableOpacity>
        {sessions.map((session) => (
          <TouchableOpacity
            style={styles.sessionButton}
            key={session.id}
            activeOpacity={0.7}
            onPress={() => toggleTasks(session)}
          >
            <Image
              source={require("@Assets/open-book.png")}
              alt="Session"
              style={styles.sessionImage}
            />
            <Text style={styles.sessionButtonText}>{session.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {showTasks && selectedSession && (
        <Animated.View
          style={[
            styles.tasksContainer,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Tasks
            onClose={toggleTasks}
            sessionData={selectedSession}
            selectedDate={selectedDate}
            onSessionSave={handleSessionSave}
          />
        </Animated.View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F7F3E8",
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
  productivityContainer: {
    backgroundColor: Colors.dark.colorPrimary,
    borderRadius: 30,
    width: "100%",
    paddingVertical: 40,
    alignItems: "center",
    marginBottom: 20,
  },
  pieChartContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  personImage: {
    position: "absolute",
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  productivityText: {
    fontSize: 24,
    color: "#FFF",
    fontFamily: "HazelnutMilktea-Bold",
  },
  tooltip: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    padding: 8,
    borderRadius: 5,
    zIndex: 10,
  },
  tooltipText: {
    color: "#FFF",
    fontSize: 12,
  },
  sessionContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 12,
    gap: 8,
  },
  sessionButton: {
    width: 120,
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: Colors.default.colorPrimary,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    aspectRatio: 1,
    flexDirection: "column",
  },
  sessionImage: {
    width: "90%",
    height: 60,
    resizeMode: "contain",
  },
  addSessionButton: {
    backgroundColor: Colors.default.colorPrimary,
  },
  sessionButtonText: {
    fontSize: 14,
    color: Colors.default.colorPrimary,
    fontFamily: "HazelnutMilktea-Bold",
    marginTop: 8,
  },
  addSessionButtonText: {
    color: "#fff",
  },
  tasksContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
});

export default Session;
