import React, { useState, useEffect, useRef } from "react";
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
import { ref, push, update, onValue, get, remove } from "firebase/database";
import { authentication, database } from "@/firebase/Firebase";
import * as Notifications from "expo-notifications";
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
  tasks: { [key: string]: Task };
}

interface PuzzleItem {
  id: string;
  image: string;
  openIndex: number[];
  status: string;
}

interface TasksProps {
  onClose: () => void;
  sessionData?: SessionData; // Prop to accept session data
  userId: string;
  selectedDate: string;
  onSessionSave: (newSession: SessionData) => void; // Prop to handle session save
}

const Tasks: React.FC<TasksProps> = ({
  onClose,
  sessionData,
  selectedDate,
  onSessionSave,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(sessionData?.title || "");
  const [tempTitle, setTempTitle] = useState(title);
  const currentUserID = authentication.currentUser?.uid;

  useEffect(() => {
    // Load tasks from sessionData if available
    if (sessionData) {
      const tasksArray = Object.values(sessionData.tasks || {});
      setTasks(tasksArray);
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

    // Save progress to Firebase immediately
    try {
      const sessionRef = ref(
        database,
        `Sessions/${currentUserID}/${selectedDate}/sessions/${sessionData?.id}/`
      );
      const tasksObject = updatedTasks.reduce((acc, task) => {
        acc[task.id] = task;
        return acc;
      }, {} as { [key: string]: Task });
      await update(sessionRef, { tasks: tasksObject });
      console.log("Task status updated in Firebase.");
    } catch (error) {
      console.error("Error updating task status:", error);
      Alert.alert("Error", "Failed to update task status. Please try again.");
    }
  };

  const addTask = () => {
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
    }
  };

  const deleteTask = async (taskId: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);

    // Save the updated tasks to Firebase
    try {
      const sessionRef = ref(
        database,
        `Sessions/${currentUserID}/${selectedDate}/sessions/${sessionData?.id}/`
      );
      const tasksObject = updatedTasks.reduce((acc, task) => {
        acc[task.id] = task;
        return acc;
      }, {} as { [key: string]: Task });
      await update(sessionRef, { tasks: tasksObject });
      console.log("Task deleted and updated in Firebase.");
    } catch (error) {
      console.error("Error deleting task:", error);
      Alert.alert("Error", "Failed to delete task. Please try again.");
    }
    setIsModalVisible(false);
  };

  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    setIsModalVisible(true);
  };

  const saveTaskDetails = () => {
    if (selectedTask) {
      const updatedTasks = tasks.map((task) =>
        task.id === selectedTask.id ? selectedTask : task
      );
      setTasks(updatedTasks);
      setIsModalVisible(false);
    }
  };

  const handleSave = async () => {
    setTitle(tempTitle);
    if (!tempTitle || tempTitle === "") {
      Alert.alert("Error", "Title cannot be empty. Please enter a title.");
      return;
    }
    setIsEditing(false);

    // Save edited session title and tasks to Firebase
    try {
      const newSession: SessionData = {
        id: sessionData?.id || "",
        title: tempTitle,
        tasks: tasks.reduce((acc, task) => {
          acc[task.id] = task;
          return acc;
        }, {} as { [key: string]: Task }),
      };

      if (!sessionData?.id) {
        // Push a new session with a unique key if it doesn't exist
        const newSessionRef = push(
          ref(database, `Sessions/${currentUserID}/${selectedDate}/sessions`)
        );
        const newSessionKey = newSessionRef.key;
        if (newSessionKey) {
          newSession.id = newSessionKey;
          await update(newSessionRef, newSession);
          console.log("New session with tasks added to Firebase.");
        }
      } else {
        // Update the existing session
        const sessionRef = ref(
          database,
          `Sessions/${currentUserID}/${selectedDate}/sessions/${sessionData.id}`
        );
        await update(sessionRef, newSession);
        console.log("Session title and tasks updated in Firebase.");
      }

      // Call the onSessionSave function to update the sessions list
      onSessionSave(newSession);
    } catch (error) {
      console.error("Error updating session title and tasks:", error);
      Alert.alert(
        "Error",
        "Failed to update session title and tasks. Please try again."
      );
    }
  };
  const previousProgress = useRef(progressPercentage);
  useEffect(() => {
    async function updateGalleryOpenPuzzle() {
      console.log(progressPercentage);

      // Check if the session is 100% complete and update the Gallery item
      if (progressPercentage === 100) {
        // Trigger a System UI Notification
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Congratulations!",
            body: `The session "${title}" is now 100% complete!`,
            sound: true,
            sticky: false, // Non-persistent notification
            priority: Notifications.AndroidNotificationPriority.HIGH,
          },
          trigger: null, // Show the notification immediately
        });

        // Perform the gallery update
        await updateGalleryItem();
      }

      // Update progress in Firebase if a session exists
      if (sessionData && sessionData?.id) {
        const sessionRef = ref(
          database,
          `Sessions/${currentUserID}/${selectedDate}/sessions/${sessionData?.id}`
        );
        await update(sessionRef, {
          progress: progressPercentage,
        });
      }
    }

    // Only update if the progress percentage has changed
    if (progressPercentage !== previousProgress.current) {
      updateGalleryOpenPuzzle();
      previousProgress.current = progressPercentage;
    }
  }, [progressPercentage, currentUserID, selectedDate, sessionData]);

  // const updateGalleryItem = async () => {
  //   console.log("Updating Gallery item...");
  //   const itemsRef = ref(database, `Gallery/${currentUserID}/Items`);
  //   onValue(itemsRef, (snapshot) => {
  //     const data = snapshot.val();
  //     if (data) {
  //       const items = Object.values(data) as PuzzleItem[];
  //       const inProgressItem = items.find(
  //         (item) => item.status === "in-progress"
  //       );
  //       if (inProgressItem) {
  //         const maxIndex = 35;
  //         let randomIndex: number;
  //         do {
  //           randomIndex = Math.floor(Math.random() * maxIndex) + 1;
  //         } while (inProgressItem.openIndex.includes(randomIndex));

  //         const updatedOpenIndex = [...inProgressItem.openIndex, randomIndex];
  //         const itemRef = ref(
  //           database,
  //           `Gallery/${currentUserID}/Items/${inProgressItem.id}`
  //         );
  //         update(itemRef, { openIndex: updatedOpenIndex });
  //         console.log("Gallery item updated with new openIndex.");
  //       }
  //     }
  //   });
  // };

  const updateGalleryItem = async () => {
    console.log("Updating Gallery item...");
    const currentUserID = authentication.currentUser?.uid;
    if (!currentUserID) {
      console.error("User is not authenticated.");
      return;
    }

    const itemsRef = ref(database, `Gallery/${currentUserID}/Items`);
    const snapshot = await get(itemsRef);
    const data = snapshot.val();

    if (data) {
      const items = Object.values(data) as PuzzleItem[];
      const inProgressItem = items.find(
        (item) => item.status === "in-progress"
      );

      if (inProgressItem) {
        const maxIndex = 35;
        const maxOpenIndex = 35;

        if (inProgressItem.openIndex.length < maxOpenIndex) {
          let randomIndex: number;
          do {
            randomIndex = Math.floor(Math.random() * maxIndex) + 1;
          } while (inProgressItem.openIndex.includes(randomIndex));

          const updatedOpenIndex = [...inProgressItem.openIndex, randomIndex];
          const itemRef = ref(
            database,
            `Gallery/${currentUserID}/Items/${inProgressItem.id}`
          );
          await update(itemRef, { openIndex: updatedOpenIndex });
          console.log("Gallery item updated with new openIndex.");
        } else {
          console.log("Gallery item openIndex is already full.");
        }
      }
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

  const handleDelete = async () => {
    async function triggerDelete() {
      try {
        // Reference to the specific session in the database
        const sessionRef = ref(
          database,
          `Sessions/${currentUserID}/${selectedDate}/sessions/${sessionData?.id}`
        );

        // Remove the session from the database
        await remove(sessionRef);

        onClose();
        console.log("Session deleted successfully");
      } catch (error) {
        console.error("Error deleting session:", error);
      }
    }
    Alert.alert(
      "Delete Session",
      "Are you sure you want to delete this session?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            triggerDelete();
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.title}
          value={tempTitle}
          onChangeText={setTempTitle}
          editable={isEditing}
          placeholder="Add Task Name"
          placeholderTextColor={Colors.default.colorTextBrown}
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
              <View
                style={{
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <Button
                  title="Edit Session"
                  customStyles={{
                    backgroundColor: Colors.default.colorBlue,
                    textColor: "white",
                  }}
                  onPress={handleEdit}
                />
                <Button
                  title="Delete Session"
                  customStyles={{
                    backgroundColor: Colors.default.colorRed,
                    textColor: "white",
                  }}
                  onPress={handleDelete}
                />
              </View>
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
            <TouchableOpacity
              style={{
                position: "absolute",
                top: -45,
                right: 0,
              }}
              onPress={() => deleteTask(selectedTask?.id || "")}
            >
              <FontAwesome
                name="trash-o"
                size={24}
                color={Colors.default.colorTextBrown}
              />
            </TouchableOpacity>

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
