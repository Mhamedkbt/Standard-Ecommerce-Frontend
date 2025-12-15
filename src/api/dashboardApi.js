// src/api/dashboardApi.js
import axios from "axios";

export const getDashboardStats = async () => {
  const res = await axios.get("/api/dashboard", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });
  return res.data;
};
