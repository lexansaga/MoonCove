import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  PanResponder,
  Image,
} from "react-native";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import FloatingGlitter from "@Components/FloatingGlitters";
import { VictoryPie } from "victory-native";
import { Link } from "expo-router";
import { globalStyles } from "@/constants/GlobalStyles";
import Tasks from "@Components/Tasks";

interface DataPoint {
  x: string;
  y: number;
  color: string;
}

const Session: React.FC = () => {
  const [activeSlice, setActiveSlice] = useState<DataPoint | null>(null);
  const [touchX, setTouchX] = useState<number>(0);
  const [touchY, setTouchY] = useState<number>(0);
  const [showTasks, setShowTasks] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const data: DataPoint[] = [
    { x: "Worst", y: 30, color: "#FF6B6B" },
    { x: "Bad", y: 20, color: "#FFA07A" },
    { x: "Good", y: 25, color: "#B2D8B2" },
    { x: "Excellent", y: 25, color: "#4CAF50" },
  ];

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

  const toggleTasks = () => {
    if (showTasks) {
      Animated.timing(slideAnim, {
        toValue: 500,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowTasks(false));
    } else {
      setShowTasks(true);
      Animated.timing(slideAnim, {
        toValue: 0, // Adjust based on screen size or task height
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} activeOpacity={0.7}>
        <FontAwesome5
          name="chevron-left"
          size={18}
          color={Colors.default.colorSecondary}
        />
        <Link href={"/HomeScreen"} style={globalStyles.overlink}></Link>
      </TouchableOpacity>

      <View style={styles.productivityContainer} {...panResponder.panHandlers}>
        <View style={styles.pieChartContainer}>
          <VictoryPie
            data={data}
            colorScale={data.map((slice) => slice.color)}
            innerRadius={0}
            labelRadius={({ innerRadius }) => (innerRadius ?? 0) + 20}
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
          onPress={toggleTasks}
        >
          <AntDesign name="pluscircleo" size={60} color={"#fff"} />
          <Text style={[styles.sessionButtonText, styles.addSessionButtonText]}>
            Add Session
          </Text>
        </TouchableOpacity>
        {[...Array(5)].map((_, index) => (
          <TouchableOpacity
            style={styles.sessionButton}
            key={index}
            activeOpacity={0.7}
          >
            <Image
              source={require("@Assets/open-book.png")}
              alt="Session"
              style={styles.sessionImage}
            />
            <Text style={styles.sessionButtonText}>Session {index + 1}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {showTasks && (
        <Animated.View
          style={[
            styles.tasksContainer,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Tasks onClose={toggleTasks} />
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
