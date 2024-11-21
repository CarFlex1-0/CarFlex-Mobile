import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    console.log("🚀 Making request to:", config.url);
    console.log("📦 Request data:", config.data);

    const token = await AsyncStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("🔑 Token found and added to headers");
    }
    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("✅ Response received:", response.status);
    console.log("📦 Response data:", response.data);
    return response;
  },
  (error) => {
    console.error("❌ Response error:", error);
    console.error("📦 Error details:", error.response?.data);
    console.error("🌐 Error status:", error.response?.status);
    return Promise.reject(error);
  }
);

export default axiosInstance;
