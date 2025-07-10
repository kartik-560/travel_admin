import axios from "axios";
import config from "../config";

const api = axios.create({
  baseURL: config.API_BASE_URL + "/itineraries",
});

export const getItineraries = () => api.get("/");
export const getItinerary = (id) => api.get(`/${id}`);
export const createItinerary = (data) => api.post("/", data);
export const updateItinerary = (id, data) => api.put(`/${id}`, data);
export const deleteItinerary = (id) => api.delete(`/${id}`);
