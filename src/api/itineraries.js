import axios from "axios";
import config from "../config";

const api = axios.create({
  baseURL: config.API_BASE_URL + "/itineraries",
});

export const getItineraries = async () => {
  return api.get("/");
};

export const getItinerary = async (id) => {
  return api.get(`/${id}`);
};

export const createItinerary = async (data) => {
  return api.post("/", data);
};

export const updateItinerary = async (id, data) => {
  return api.put(`/${id}`, data);
};

export const deleteItinerary = async (id) => {
  return api.delete(`/${id}`);
};
