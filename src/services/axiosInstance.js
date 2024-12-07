import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";

// Debug logging
console.log("🔍 Environment Check:");
console.log("API_URL:", API_URL);
console.log("Type of API_URL:", typeof API_URL);

// Create an Axios instance with hardcoded URL for testing
const axiosInstance = axios.create({
  // Try both the env variable and hardcoded URL to test
  baseURL: API_URL || "http://192.168.1.74:5000/api",
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    // Enhanced request logging
    console.log("🔍 Request Details:");
    console.log("🚀 URL:", config.url);
    console.log("Full URL:", config.baseURL + config.url);
    console.log("Method:", config.method);
    console.log("🔑 Headers:", config.headers);
    console.log("🔍 Data:", config.data);

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
    console.error("🔍 Detailed Error Information:");
    if (error.code === "ECONNABORTED") {
      console.error("Request timeout - Server took too long to respond");
    } else if (!error.response) {
      console.error("Network Error Details:");
      console.error("Message:", error.message);
      console.error("Is server running on port 5000?");
      console.error("Is firewall blocking the connection?");
    }

    // Try to ping the server
    fetch(API_URL)
      .then((res) => console.log("Server reachable via fetch"))
      .catch((err) => console.log("Server not reachable via fetch:", err));

    return Promise.reject(error);
  }
);

// Test the connection immediately
axios
  .get(`${API_URL}/health-check`)
  .then(() => console.log("✅ Server is reachable"))
  .catch((error) =>
    console.log("❌ Server connection test failed:", error.message)
  );

export default axiosInstance;
