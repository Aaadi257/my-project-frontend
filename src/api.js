import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "/api",
  timeout: 60000, // 60s — accommodates Render free tier cold-start delay
  headers: {
    "Content-Type": "application/json",
  },
});

// Global response interceptor — log every error for easy debugging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
      console.error("[API] Request timed out. The backend may be cold-starting (Render free tier). Please retry in ~30s.");
    } else {
      console.error("[API] Response error:", error.response?.status, error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);

export default api;