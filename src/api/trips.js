import axios from "axios";
import config from "../config";

// =============================
// Setup Basic Auth
// =============================
const API_BASE_URL = (config?.API_BASE_URL || "").replace(/\/+$/, "");

// store the token in memory + sessionStorage
let _basicToken = sessionStorage.getItem("basicToken") || null;

export function setBasicAuth(username, password) {
  const encoded = btoa(`${username}:${password}`);
  _basicToken = `Basic ${encoded}`;
  sessionStorage.setItem("basicToken", _basicToken);
}

export function clearBasicAuth() {
  _basicToken = null;
  sessionStorage.removeItem("basicToken");
}

// =============================
// Axios instance
// =============================
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

api.interceptors.request.use((cfg) => {
  if (_basicToken) {
    cfg.headers = cfg.headers || {};
    cfg.headers.Authorization = _basicToken; // "Basic base64string"
  }
  return cfg;
});

// =============================
// Trips API
// =============================
export const getTrips = () => api.get("/api/trips");
export const getTrip = (id) => api.get(`/api/trips/${id}`);
export const createTrip = (data) => api.post("/api/trips", data);
export const updateTrip = (id, data) => api.put(`/api/trips/${id}`, data);
export const deleteTrip = (id) => api.delete(`/api/trips/${id}`);
