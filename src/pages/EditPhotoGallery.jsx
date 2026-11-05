import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import imageCompression from "browser-image-compression";
import { getPhotoGalleryById, updatePhotoGallery } from "../api/photos.js";
import {
  ArrowLeft,
  Upload,
  Trash2,
  Save,
  Loader2,
  Images,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const EditPhotoGallery = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [compressing, setCompressing] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setFetching(true);
        const res = await getPhotoGalleryById(id);
        const gallery = res.data;

        setTitle(gallery.title || "");
        setImages(gallery.images || []);
      } catch (err) {
        console.error("Fetch error:", err);
        setMessage({ type: "error", text: "Failed to load gallery details." });
      } finally {
        setFetching(false);
      }
    };

    if (id) fetchGallery();
  }, [id]);

  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (!selectedFiles.length) return;

    setCompressing(true);

    for (let file of selectedFiles) {
      if (!file.type.startsWith("image/")) {
        alert("Only image files are allowed.");
        continue;
      }

      try {
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1280,
          useWebWorker: true,
        });

        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result;
          setImages((prev) => [...prev, base64]);
        };
        reader.readAsDataURL(compressedFile);
      } catch (err) {
        console.error("Compression error:", err);
      }
    }

    setCompressing(false);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      alert("A gallery must have at least one image.");
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      await updatePhotoGallery(id, {
        title: title.trim() || "Untitled Album",
        images,
      });

      setMessage({ type: "success", text: "Gallery updated successfully!" });
      setTimeout(() => {
        navigate("/adminPhotos");
      }, 1000);
    } catch (error) {
      console.error("Update failed:", error);
      setMessage({ type: "error", text: "Failed to update gallery." });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="space-y-4 max-w-3xl mx-auto">
        <div className="h-10 bg-slate-200 rounded-xl animate-pulse" />
        <div className="h-48 bg-slate-200 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-3xl mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Link
            to="/adminPhotos"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Edit Photo Gallery
            </h2>
            <p className="text-[11px] text-slate-500">
              Update title, add new photos, or remove existing images from this collection.
            </p>
          </div>
        </div>
      </div>

      {message && (
        <div
          className={`p-3 rounded-xl flex items-center gap-2 text-xs font-semibold ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleUpdate} className="space-y-4">
        {/* Album Info */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
            <div className="p-1.5 rounded-lg bg-orange-50 text-orange-600">
              <Images className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Album Information</h3>
              <p className="text-[11px] text-slate-400">Edit the display title of the gallery</p>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Album Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Album title"
              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-orange-500 transition-all"
            />
          </div>
        </div>

        {/* Photos Management */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                <Upload className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Manage Photos</h3>
                <p className="text-[11px] text-slate-400">{images.length} photos currently in album</p>
              </div>
            </div>
            {compressing && (
              <span className="text-xs text-orange-500 font-semibold flex items-center gap-1.5 animate-pulse">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Compressing...
              </span>
            )}
          </div>

          {/* Add more photos button */}
          <label className="flex flex-col items-center justify-center p-5 sm:p-6 border-2 border-dashed border-slate-300 rounded-2xl hover:border-orange-500 hover:bg-orange-50/20 cursor-pointer transition-all group">
            <Upload className="w-7 h-7 text-slate-400 group-hover:text-orange-500 mb-2 transition-colors" />
            <span className="text-xs font-semibold text-slate-700 group-hover:text-orange-600">
              Click to add more photos to this album
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">
              Images will be automatically optimized
            </span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {/* Current Photos Grid */}
          {images.length > 0 && (
            <div className="space-y-2 pt-1">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Gallery Photos ({images.length})
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group shadow-sm"
                  >
                    <img src={img} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1.5 right-1.5 p-1 rounded-md bg-red-600 text-white shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                      title="Remove from album"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-slate-950/70 text-white text-[9px] font-mono">
                      #{index + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-2.5 pt-1">
          <Link
            to="/adminPhotos"
            className="px-4 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading || images.length === 0}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-semibold shadow-md shadow-orange-500/20 transition-all disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPhotoGallery;
