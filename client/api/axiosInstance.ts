import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api",
  withCredentials: true,
  timeout: 10000,
});

export default axiosInstance;
