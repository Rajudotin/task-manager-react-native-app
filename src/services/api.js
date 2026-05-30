import axios from "axios";

const API = axios.create({
  baseURL: "https://task-manager-react-native-app.onrender.com/api",
});

export default API;
