// src/api/trips.js
import axios from "axios";
import config from "../config";

const api = axios.create({
  baseURL: config.API_BASE_URL, // Already includes /api
});

export const getTrips = async () => {
  return api.get("/trips");
};

export const getTrip = async (id) => {
  return api.get(`/trips/${id}`);
};

export const createTrip = async (data) => {
  return api.post("/trips", data);
};

export const updateTrip = async (id, data) => {
  return api.put(`/trips/${id}`, data);
};

export const deleteTrip = async (id) => {
  return api.delete(`/trips/${id}`);
};
