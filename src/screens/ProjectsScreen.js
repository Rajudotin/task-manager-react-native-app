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

const ProjectsScreen = ({ navigation }) => {
  const [projects, setProjects] = useState([]);

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await API.get("/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProjects(response.data);
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  const createProject = async () => {
    if (!title) {
      alert("Project title required");

      return;
    }

    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("token");

      await API.post(
        "/projects",
        {
          title,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setTitle("");

      setDescription("");

      await fetchProjects();

      setLoading(false);
    } catch (error) {
      setLoading(false);

      console.log(error.response?.data);

      alert("Failed to create project");
    }
  };

  const deleteProject = async (id) => {
    try {
      const token = await AsyncStorage.getItem("token");

      await API.delete(`/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchProjects();
    } catch (error) {
      console.log(error.response?.data);

      alert("Delete failed");
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");

    navigation.replace("Login");
  };

  const renderProject = ({ item }) => (
    <TouchableOpacity
      style={styles.projectCard}
      onPress={() =>
        navigation.navigate("Tasks", {
          projectId: item.id,
        })
      }
    >
      <Text style={styles.projectTitle}>{item.title}</Text>

      <Text style={styles.projectDescription}>{item.description}</Text>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteProject(item.id)}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Projects</Text>

        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="Project Title"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        placeholder="Description"
        style={styles.input}
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity style={styles.button} onPress={createProject}>
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Add Project</Text>
        )}
      </TouchableOpacity>

      <FlatList
        data={projects}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProject}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No Projects Found</Text>
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

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
  },

  logoutText: {
    color: "red",
    fontWeight: "bold",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "#fafafa",
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

  projectCard: {
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
  },

  projectTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },

  projectDescription: {
    color: "#555",
    marginBottom: 10,
  },

  deleteButton: {
    alignSelf: "flex-start",
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

export default ProjectsScreen;
