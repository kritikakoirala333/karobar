import axios from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
  // baseURL: `${import.meta.env.BASE_URL}/api`, // ✅ replace with your actual base URL
   baseURL: "https://invoicer-backend.azure.com.np/api", 
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor for authentication
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("login_token"); // ✅ or wherever you store it
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
