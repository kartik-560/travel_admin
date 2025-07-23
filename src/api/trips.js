// src/api/trips.js
import axios from "axios";
import config from "../config";

const api = axios.create({
  baseURL: config.API_BASE_URL + "/trips",
});

export const getTrips = async () => {
  return api.get("/");
};

export const getTrip = async (id) => {
  return api.get(`/${id}`);
};

export const createTrip = async (data) => {
  return api.post("/", data);
};

export const updateTrip = async (id, data) => {
  return api.put(`/${id}`, data);
};

export const deleteTrip = async (id) => {
  return api.delete(`/${id}`);
};
