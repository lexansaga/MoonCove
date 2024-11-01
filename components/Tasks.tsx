import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import Button from "./Button";
import ModalComponent from "@Components/Modal";

interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
}

interface TasksProps {
  onClose: () => void;
}

const Tasks: React.FC<TasksProps> = ({ onClose }) => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Task 1", completed: true },
    { id: 2, title: "Task 2", completed: true },
    { id: 3, title: "Task 3", completed: true },
    { id: 4, title: "Task 4", completed: false },
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("Add Title");
  const [tempTitle, setTempTitle] = useState(title);

  const completedTasksCount = tasks.filter((task) => task.completed).length;
  const progressPercentage = (completedTasksCount / tasks.length) * 100;

  const toggleTaskCompletion = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: tasks.length + 1,
        title: newTaskTitle,
        completed: false,
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle("");
    }
  };

  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    setIsModalVisible(true);
  };

  const saveTaskDetails = () => {
    if (selectedTask) {
      setTasks(
        tasks.map((task) => (task.id === selectedTask.id ? selectedTask : task))
      );
      setIsModalVisible(false);
    }
  };

  const handleSave = () => {
    setTitle(tempTitle);
    setIsEditing(false);
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
          value={tempTitle}
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
        {tasks.map((task) => (
          <TouchableOpacity
            key={task.id}
            style={styles.taskContainer}
            onPress={() => toggleTaskCompletion(task.id)}
            onLongPress={() => openEditModal(task)}
          >
            <FontAwesome
              name={task.completed ? "check-square-o" : "square-o"}
              size={24}
              color={task.completed ? Colors.default.colorTextBrown : "#000"}
              style={styles.checkboxIcon}
            />
            <Text
              style={[
                styles.taskText,
                task.completed && styles.taskTextCompleted,
              ]}
            >
              {task.title}
            </Text>
          </TouchableOpacity>
        ))}

        <View style={styles.addTaskContainer}>
          <FontAwesome
            name="plus"
            size={20}
            color={Colors.default.colorTextBrown}
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
    borderColor: Colors?.default.colorTextBrown,
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
  taskContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
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
