import React, { useRef, useState } from "react";
import {
  Button,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
const { width, height } = Dimensions.get("window");

const Tasks = () => {
  interface TasksInterface {
    task: string;
    id: number;
  }

  const inputRef = useRef(null);
  const [taskText, setTaskText] = useState("");
  const [tasks, setTasks] = useState<TasksInterface[]>([]);

  const addTask = () => {
    setTasks((prevState) => {
      return [...prevState, { task: taskText, id: Date.now() }];
    });
  };

  const handleDelete = (id: number) => {
    return setTasks((prevState) => prevState.filter((task) => task.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.taskText}>Tasks</Text>
      <TextInput
        onChangeText={setTaskText}
        ref={inputRef}
        style={styles.textInput}
      />
      <TouchableOpacity style={styles.btnContainer} onPress={addTask}>
        <Text>Add Task</Text>
      </TouchableOpacity>
      <View style={styles.flatContainer}>
        <FlatList
          style={{ width: "100%" }}
          data={tasks}
          renderItem={({ item }) => {
            return (
              <View style={styles.taskItem}>
                <Text style={styles.tasksText}>{item.task}</Text>
                <Button title="delete" onPress={() => handleDelete(item.id)} />
              </View>
            );
          }}
        />
      </View>
    </View>
  );
};

export default Tasks;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: width * 0.05, // 5% of screen width
    paddingTop: height * 0.05, // 5% of screen height
    backgroundColor: "#f9f9f9",
    alignItems: "center",
  },
  taskText: {
    fontSize: width * 0.07, // scales with screen width
    fontWeight: "800",
    color: "#333",
    marginBottom: height * 0.02,
  },
  textInput: {
    width: "100%",
    borderWidth: 1.5,
    borderColor: "#ccc",
    borderRadius: 12,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.04,
    fontSize: width * 0.045,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  btnContainer: {
    width: "60%",
    backgroundColor: "#ff6b81",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    paddingVertical: height * 0.015,
    marginTop: height * 0.02,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  flatContainer: {
    width: "100%",
    marginTop: height * 0.03,
    flex: 1,
  },
  taskItem: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.04,
    borderRadius: 12,
    marginVertical: height * 0.008,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  tasksText: {
    fontSize: width * 0.045,
    fontWeight: "600",
    color: "#333",
  },
});
