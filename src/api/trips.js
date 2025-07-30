// src/api/trips.js
import axios from "axios";
import config from "../config";

const api = axios.create({
  baseURL: config.API_BASE_URL, 
});

export const getTrips = async () => {
  return api.get("/api/trips");
};

export const getTrip = async (id) => {
  return api.get(`/api/trips/${id}`);
};

export const createTrip = async (data) => {
  return api.post("/api/trips", data);
};

export const updateTrip = async (id, data) => {
  return api.put(`/api/trips/${id}`, data);
};

export const deleteTrip = async (id) => {
  return api.delete(`/api/trips/${id}`);
};
