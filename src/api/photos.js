import axios from "axios";
import config from "../config";

const api = axios.create({
  baseURL: config.API_BASE_URL,
});



// CREATE a new photo gallery
export const createPhotoGallery = async (data) => {
  return api.post("/api/photos", data);
};

// DELETE a photo gallery by ID
export const deletePhotoGallery = async (id) => {
   const token = sessionStorage.getItem("basicToken");
  if (!token) throw new Error("Not authenticated");
  return api.delete(`/api/photos/${id}`, {
      headers: { Authorization: token },
  });
};

// ✅ GET a photo gallery by ID
export const getPhotoGalleryById = async (id) => {
  return api.get(`/api/photos/${id}`);
};

// ✅ UPDATE a photo gallery by ID
export const updatePhotoGallery = async (id, data) => {
  return api.put(`/api/photos/${id}`, data);
};

export const getAllPhotoGalleries = async () => {
  return api.get("/api/photos");
};
