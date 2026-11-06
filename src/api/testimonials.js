import axios from "axios";
import config from "../config";

const API_BASE_URL = (config?.API_BASE_URL || "").replace(/\/+$/, "");

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

api.interceptors.request.use((cfg) => {
  const token = sessionStorage.getItem("basicToken");
  if (token) {
    cfg.headers = cfg.headers || {};
    cfg.headers.Authorization = token;
  }
  return cfg;
});

// Testimonials API
export const getTestimonials = (params = { all: true }) =>
  api.get("/api/testimonials", { params });

export const getTestimonial = (id) =>
  api.get(`/api/testimonials/${id}`);

export const createTestimonial = (data) =>
  api.post("/api/testimonials", data);

export const updateTestimonial = (id, data) =>
  api.put(`/api/testimonials/${id}`, data);

export const updateTestimonialStatus = (id, status) =>
  api.patch(`/api/testimonials/${id}/status`, { status });

export const deleteTestimonial = (id) =>
  api.delete(`/api/testimonials/${id}`);

