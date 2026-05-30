import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import API from "../services/api";

const TasksScreen = ({ route }) => {
  const { projectId } = route.params;

  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await API.get(`/tasks/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks(response.data);
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  const createTask = async () => {
    if (!title) {
      alert("Task title required");

      return;
    }

    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("token");

      await API.post(
        "/tasks",
        {
          project_id: projectId,
          title,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setTitle("");

      await fetchTasks();

      setLoading(false);
    } catch (error) {
      setLoading(false);

      console.log(error.response?.data);

      alert("Failed to create task");
    }
  };

  const toggleTaskStatus = async (id, currentStatus) => {
    try {
      const token = await AsyncStorage.getItem("token");

      await API.put(
        `/tasks/${id}`,
        {
          status: !currentStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchTasks();
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  const deleteTask = async (id) => {
    try {
      const token = await AsyncStorage.getItem("token");

      await API.delete(`/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchTasks();
    } catch (error) {
      console.log(error.response?.data);

      alert("Delete failed");
    }
  };

  const renderTask = ({ item }) => (
    <View style={styles.taskCard}>
      <Text style={[styles.taskTitle, item.status && styles.completedTask]}>
        {item.title}
      </Text>

      <Text style={styles.statusText}>
        Status:
        {item.status ? " Completed" : " Pending"}
      </Text>

      <View style={styles.actionRow}>
        <TouchableOpacity
          onPress={() => toggleTaskStatus(item.id, item.status)}
        >
          <Text style={styles.completeText}>Toggle Status</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => deleteTask(item.id)}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tasks</Text>

      <TextInput
        placeholder="Task Title"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />

      <TouchableOpacity style={styles.button} onPress={createTask}>
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Add Task</Text>
        )}
      </TouchableOpacity>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTask}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No Tasks Found</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fafafa",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },

  button: {
    backgroundColor: "#2563eb",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },

  taskCard: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 3,
  },

  taskTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },

  completedTask: {
    textDecorationLine: "line-through",
    color: "gray",
  },

  statusText: {
    color: "#555",
    marginBottom: 12,
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  completeText: {
    color: "green",
    fontWeight: "bold",
  },

  deleteText: {
    color: "red",
    fontWeight: "bold",
  },

  emptyText: {
    textAlign: "center",
    marginTop: 50,
    color: "gray",
    fontSize: 16,
  },
});

export default TasksScreen;
