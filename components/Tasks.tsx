import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import Button from "./Button";
import ModalComponent from "@Components/Modal";
import { ref, push, update } from "firebase/database";
import { authentication, database } from "@/firebase/Firebase";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: "completed" | "in-progress";
  date_created: string;
  date_finish?: string;
}

interface SessionData {
  id: string;
  title: string;
  tasks: Task[];
}

interface TasksProps {
  onClose: () => void;
  sessionData?: SessionData; // Prop to accept session data
  userId: string;
  selectedDate: string;
}

const Tasks: React.FC<TasksProps> = ({
  onClose,
  sessionData,
  selectedDate,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(sessionData?.title || "Add Title");
  const [tempTitle, setTempTitle] = useState(title);
  const currentUserID = authentication.currentUser?.uid;

  useEffect(() => {
    // Load tasks from sessionData if available
    if (sessionData) {
      setTasks(sessionData.tasks || []); // Ensure tasks is an array
      setTitle(sessionData.title);
      setTempTitle(sessionData.title);
    }
  }, [sessionData]);

  const completedTasksCount = tasks.filter(
    (task) => task.status === "completed"
  ).length;
  const progressPercentage =
    tasks.length > 0 ? (completedTasksCount / tasks.length) * 100 : 0;

  const toggleTaskStatus = async (id: string) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        const newStatus =
          task.status === "completed" ? "in-progress" : "completed";
        return {
          ...task,
          status: newStatus,
          date_finish:
            newStatus === "completed" ? new Date().toISOString() : "",
        };
      }
      return task;
    });
    setTasks(updatedTasks);

    // Save progress to Firebase
    try {
      const sessionRef = ref(
        database,
        `Sessions/${currentUserID}/${selectedDate}/sessions/${sessionData?.id}/`
      );
      await update(sessionRef, { tasks: updatedTasks });
      console.log("Task status updated in Firebase.");
    } catch (error) {
      console.error("Error updating task status:", error);
      Alert.alert("Error", "Failed to update task status. Please try again.");
    }
  };

  const addTask = async () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: `task-${Date.now()}`,
        title: newTaskTitle,
        status: "in-progress",
        date_created: new Date().toISOString(),
      };
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      setNewTaskTitle("");

      // Save new task to Firebase
      try {
        if (!sessionData?.id) {
          // Push a new session with a unique key if it doesn't exist
          const newSessionRef = push(
            ref(database, `Sessions/${currentUserID}/${selectedDate}/sessions`)
          );
          const newSessionKey = newSessionRef.key;
          if (newSessionKey) {
            await update(newSessionRef, {
              id: newSessionKey,
              title: title,
              tasks: updatedTasks,
            });
            console.log("New session with task added to Firebase.");
          }
        } else {
          // Update the existing session
          const sessionRef = ref(
            database,
            `Sessions/${currentUserID}/${selectedDate}/sessions/${sessionData.id}`
          );
          await update(sessionRef, {
            tasks: updatedTasks,
          });
          console.log("New task added to existing session in Firebase.");
        }
      } catch (error) {
        console.error("Error adding new task:", error);
        Alert.alert("Error", "Failed to add new task. Please try again.");
      }
    }
  };

  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    setIsModalVisible(true);
  };

  const saveTaskDetails = async () => {
    if (selectedTask) {
      const updatedTasks = tasks.map((task) =>
        task.id === selectedTask.id ? selectedTask : task
      );
      setTasks(updatedTasks);
      setIsModalVisible(false);

      // Save edited task to Firebase
      try {
        const sessionRef = ref(
          database,
          `Sessions/${currentUserID}/${selectedDate}/sessions/${sessionData?.id}`
        );
        await update(sessionRef, { tasks: updatedTasks });
        console.log("Task details updated in Firebase.");
      } catch (error) {
        console.error("Error updating task details:", error);
        Alert.alert(
          "Error",
          "Failed to update task details. Please try again."
        );
      }
    }
  };

  const handleSave = async () => {
    setTitle(tempTitle);
    setIsEditing(false);

    // Save edited session title to Firebase
    try {
      const sessionRef = ref(
        database,
        `Sessions/${currentUserID}/${selectedDate}/sessions/${sessionData?.id}`
      );
      await update(sessionRef, { title: tempTitle });
      console.log("Session title updated in Firebase.");
    } catch (error) {
      console.error("Error updating session title:", error);
      Alert.alert("Error", "Failed to update session title. Please try again.");
    }
  };

  const handleEdit = () => {
    setTempTitle(title); // Backup the title before editing
    setIsEditing(true);
  };

  const handleCancel = () => {
    setTempTitle(title); // Revert any changes to the title
    setIsEditing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.title}
          value={tempTitle || "Add Task Name"}
          onChangeText={setTempTitle}
          editable={isEditing}
        />
        <TouchableOpacity onPress={onClose}>
          <FontAwesome
            name="close"
            size={24}
            color={Colors.default.colorTextBrown}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${progressPercentage}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {progressPercentage.toFixed(0)}%
        </Text>
      </View>

      <ScrollView>
        {tasks.length === 0 ? (
          <>
            {!isEditing && (
              <>
                <Text
                  style={[
                    styles.noTasksText,
                    {
                      fontSize: 20,
                    },
                  ]}
                >
                  No tasks available.
                </Text>
                <Text style={styles.noTasksText}>
                  Add a new task to get started!
                </Text>
              </>
            )}
          </>
        ) : (
          tasks.map((task) => (
            <TouchableOpacity
              key={task.id}
              style={styles.taskContainer}
              onPress={() => toggleTaskStatus(task.id)}
              onLongPress={() => openEditModal(task)}
            >
              <FontAwesome
                name={
                  task.status === "completed" ? "check-square-o" : "square-o"
                }
                size={24}
                color={
                  task.status === "completed"
                    ? Colors.default.colorTextBrown
                    : "#000"
                }
                style={styles.checkboxIcon}
              />
              <Text
                style={[
                  styles.taskText,
                  task.status === "completed" && styles.taskTextCompleted,
                ]}
              >
                {task.title}
              </Text>
            </TouchableOpacity>
          ))
        )}

        {isEditing && (
          <View style={styles.addTaskContainer}>
            <FontAwesome
              name="plus"
              size={20}
              color={Colors.default.colorTextBrown}
              onPress={addTask}
            />
            <TextInput
              style={styles.addTaskInput}
              placeholder="Add Task"
              placeholderTextColor="#aaa"
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
              onSubmitEditing={addTask}
            />
          </View>
        )}

        <View style={styles.taskFooter}>
          <View style={styles.buttonWrapper}>
            {isEditing ? (
              <>
                <Button
                  title="Save"
                  customStyles={{
                    backgroundColor: Colors.default.colorGreen,
                    textColor: "white",
                  }}
                  onPress={handleSave}
                />
                <Button
                  title="Cancel"
                  customStyles={{
                    backgroundColor: Colors.default.colorRed,
                    textColor: "white",
                  }}
                  onPress={handleCancel}
                />
              </>
            ) : (
              <Button
                title="Edit Session"
                customStyles={{
                  backgroundColor: Colors.default.colorBlue,
                  textColor: "white",
                }}
                onPress={handleEdit}
              />
            )}
          </View>

          <Image
            source={require("@Assets/astronaut.png")}
            style={styles.astronautImage}
          />
        </View>
      </ScrollView>

      {/* Edit Task Modal using ModalComponent */}
      <ModalComponent
        visible={isModalVisible}
        title="Edit Task"
        onClose={() => setIsModalVisible(false)}
        content={
          <View>
            <TextInput
              style={styles.modalInput}
              placeholder="Title"
              value={selectedTask?.title}
              onChangeText={(text) =>
                setSelectedTask((prev) =>
                  prev ? { ...prev, title: text } : prev
                )
              }
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Description"
              value={selectedTask?.description || ""}
              onChangeText={(text) =>
                setSelectedTask((prev) =>
                  prev ? { ...prev, description: text } : prev
                )
              }
              multiline
            />
            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                customStyles={{
                  backgroundColor: Colors.default.colorRed,
                  textColor: "white",
                }}
                onPress={() => setIsModalVisible(false)}
              />
              <Button
                title="Save"
                customStyles={{
                  backgroundColor: Colors.default.colorGreen,
                  textColor: "white",
                }}
                onPress={saveTaskDetails}
              />
            </View>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FDF5E6",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    color: Colors.default.colorTextBrown,
    fontFamily: "HazelnutMilktea-Bold",
    flex: 1,
    marginRight: 10,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    maxWidth: 180,
  },
  progressBarBackground: {
    flex: 1,
    height: 15,
    backgroundColor: "transparent",
    borderRadius: 20,
    marginRight: 10,
    overflow: "hidden",
    padding: 1,
    borderWidth: 1,
    borderColor: Colors.default.colorTextBrown,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: Colors.default.colorTextBrown,
    borderRadius: 20,
  },
  progressText: {
    color: Colors.default.colorTextBrown,
    fontWeight: "500",
    fontFamily: "HazelnutMilktea-Bold",
  },
  noTasksText: {
    color: Colors.default.colorTextBrown,
    fontWeight: "500",
    fontFamily: "HazelnutMilktea-Bold",
  },
  taskContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
    width: "100%",
  },
  checkboxIcon: {
    marginRight: 10,
  },
  taskText: {
    fontSize: 18,
    color: Colors.default.colorTextBrown,
    fontFamily: "HazelnutMilktea-Bold",
  },
  taskTextCompleted: {
    textDecorationLine: "line-through",
    color: "#aaa",
  },
  dateText: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
    fontFamily: "HazelnutMilktea-Regular",
  },
  addTaskContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  addTaskInput: {
    fontSize: 18,
    color: Colors.default.colorTextBrown,
    marginLeft: 10,
    flex: 1,
    fontFamily: "HazelnutMilktea-Bold",
    borderBottomWidth: 1,
    borderColor: Colors.default.colorTextBrown,
  },
  taskFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  buttonWrapper: {
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 12,
    flex: 1,
    paddingBottom: 20,
  },
  astronautImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    alignSelf: "flex-end",
    marginTop: 20,
  },
  modalInput: {
    height: 40,
    borderColor: Colors.default.colorTextBrown,
    borderBottomWidth: 2,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: Colors.default.colorPrimary,
    fontWeight: "500",
    fontFamily: "HazelnutMilktea-Bold",
    fontSize: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
    gap: 8,
  },
});

export default Tasks;
