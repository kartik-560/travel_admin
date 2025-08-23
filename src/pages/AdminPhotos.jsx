import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/AdminPhotos.css";
import { deletePhotoGallery } from "../api/photos.js";

import { getAllPhotoGalleries } from "../api/photos.js";
const AdminPhotos = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await getAllPhotoGalleries(); // 👈 use correct function
        setPhotos(res.data);
      } catch (err) {
        console.error("Error fetching photos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

   if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const handleDelete = async (photoId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this gallery?"
    );
    if (!confirmed) return;

    try {
      await deletePhotoGallery(photoId);

      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
      console.log(`Gallery ${photoId} deleted`);
      alert("Gallery deleted successfully!");
    } catch (err) {
      console.error("Error deleting photo gallery:", err);
      alert("Failed to delete gallery.");
    }
  };

  return (
    <div className="admin-container">
      <h2 className="admin-title">Admin Photo Manager</h2>

      {loading ? (
        <p className="admin-loading">Loading photos...</p>
      ) : (
        <div className="photo-grid">
          {photos.map((photo) =>
            (photo.images || []).map((img, i) => (
              <div key={`${photo.id}-${i}`} className="photo-card">
                <img src={img} alt={`Photo ${i + 1}`} className="photo-image" />
                <div className="photo-actions">
                  <button
                    className="edit-btn"
                    onClick={() => navigate(`/photo/edit/${photo.id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(photo.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPhotos;
