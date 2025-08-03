/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import imageCompression from "browser-image-compression";
import "./styles/PhotoGallary.css";
import { updatePhotoGallery } from "../api/photos.js";
import { getPhotoGalleryById } from "../api/photos.js";

const EditPhotoGallery = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
const navigate = useNavigate();

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await getPhotoGalleryById(id); 
        const gallery = res.data;

        console.log("Fetched gallery:", gallery);
        console.log("URL param id:", id);

        setTitle(gallery.title);
        setImages(gallery.images || []);
        setPreviews(gallery.images || []);
      } catch (err) {
        console.error("Fetch error:", err);
        alert("Gallery not found or fetch failed");
      }
    };

    fetchGallery();
  }, [id]);

  // Add new compressed images
  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);

    for (let file of selectedFiles) {
      if (!file.type.startsWith("image/")) {
        alert("Only image files are allowed.");
        continue;
      }

      try {
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        });

        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result;
          setImages((prev) => [...prev, base64]);
          setPreviews((prev) => [...prev, base64]);
        };
        reader.readAsDataURL(compressedFile);
      } catch (err) {
        console.error("Compression error:", err);
      }
    }
  };

 
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      alert("At least one image is required.");
      return;
    }

    try {
      setLoading(true);

      const payload = { title, images };
      const res = await updatePhotoGallery(id, payload); 
      alert("Gallery updated!");
      // console.log(res.data);
       navigate("/adminPhotos");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Update failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <form onSubmit={handleUpdate} className="upload-form">
        <input
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-input"
        />

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="file-input"
        />

        <div className="image-preview-list">
          {previews.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`preview-${idx}`}
              className="image-preview"
            />
          ))}
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Updating..." : "Update Gallery"}
        </button>
      </form>
    </div>
  );
};

export default EditPhotoGallery;
