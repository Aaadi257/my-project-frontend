import axios from "axios";

const api = axios.create({
  baseURL: "https://my-project-backend-gnqn.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;