import axios from "axios";
import config from "../config";

const API_BASE_URL = (config?.API_BASE_URL || "").replace(/\/+$/, "");

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

api.interceptors.request.use((cfg) => {
  const token = sessionStorage.getItem("basicToken");
  if (token) {
    cfg.headers = cfg.headers || {};
    cfg.headers.Authorization = token;
  }
  return cfg;
});

export const getAnalyticsStats = () => api.get("/api/analytics/stats");
export const clearAnalyticsStats = () => api.delete("/api/analytics/clear");

