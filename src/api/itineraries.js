import axios from "axios";
import config from "../config";
import { mockApi } from "../services/mockApi";

const api = axios.create({
  baseURL: config.API_BASE_URL + "/itineraries",
});

// Check if we should use mock API (when backend is not available)
const USE_MOCK_API = true; // Set to false when backend is ready

export const getItineraries = async () => {
  if (USE_MOCK_API) {
    return mockApi.getItineraries();
  }
  return api.get("/");
};

export const getItinerary = async (id) => {
  if (USE_MOCK_API) {
    return mockApi.getItinerary(id);
  }
  return api.get(`/${id}`);
};

export const createItinerary = async (data) => {
  if (USE_MOCK_API) {
    return mockApi.createItinerary(data);
  }
  return api.post("/", data);
};

export const updateItinerary = async (id, data) => {
  if (USE_MOCK_API) {
    return mockApi.updateItinerary(id, data);
  }
  return api.put(`/${id}`, data);
};

export const deleteItinerary = async (id) => {
  if (USE_MOCK_API) {
    return mockApi.deleteItinerary(id);
  }
  return api.delete(`/${id}`);
};