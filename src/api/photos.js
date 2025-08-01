import axios from "axios";
import config from "../config";

const api = axios.create({
  baseURL: config.API_BASE_URL,
});


export const createPhotoGallery = async (data) => {
  return api.post("/api/photos", data);
};

// DELETE a photo gallery by ID
export const deletePhotoGallery = async (id) => {
  return api.delete(`/api/photos/${id}`);
};
