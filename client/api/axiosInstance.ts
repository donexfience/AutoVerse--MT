import axios from "axios";
import { getUserId } from "../utils/generateUserId";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api",
  headers: {
    "x-user-id": getUserId(),
  },
  withCredentials: true,
 timeout: 60000
});

export default axiosInstance;
