import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAllPhotoGalleries, deletePhotoGallery } from "../api/photos.js";
import {
  Images,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  X,
  Maximize2,
  Layers,
} from "lucide-react";

const AdminPhotos = () => {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();

  const fetchGalleries = async () => {
    try {
      setLoading(true);
      const res = await getAllPhotoGalleries();
      setGalleries(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching photos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleries();
  }, []);

  const handleDelete = async (photoId) => {
    try {
      setDeleting(true);
      await deletePhotoGallery(photoId);
      setGalleries((prev) => prev.filter((p) => p.id !== photoId));
      setDeleteConfirm(null);
    } catch (err) {
      console.error("Error deleting photo gallery:", err);
      alert("Failed to delete gallery.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-slate-200 rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-52 bg-slate-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const totalImages = galleries.reduce(
    (acc, g) => acc + (g.images?.length || 0),
    0
  );

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Photo Galleries
          </h2>
          <p className="text-[11px] text-slate-500">
            Manage your curated travel albums ({galleries.length} albums, {totalImages} total photos).
          </p>
        </div>
        <Link
          to="/image/upload"
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-md shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Upload Gallery</span>
        </Link>
      </div>

      {/* Galleries Grid */}
      {galleries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {galleries.map((gallery) => {
            const images = gallery.images || [];
            const primaryImage = images[0];

            return (
              <div
                key={gallery.id}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col group"
              >
                {/* Main Preview with mosaic / badge */}
                <div className="relative h-40 w-full bg-slate-100 overflow-hidden">
                  {primaryImage ? (
                    <img
                      src={primaryImage}
                      alt={gallery.title || "Gallery photo"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                      onClick={() => setPreviewImage(primaryImage)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <Images className="w-7 h-7 opacity-40" />
                    </div>
                  )}

                  {/* Top overlay badges */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-950/70 backdrop-blur-md text-white text-[10px] font-bold">
                    <Layers className="w-3 h-3 text-amber-400" />
                    <span>{images.length} {images.length === 1 ? "photo" : "photos"}</span>
                  </div>

                  {primaryImage && (
                    <button
                      onClick={() => setPreviewImage(primaryImage)}
                      className="absolute bottom-2.5 right-2.5 p-1.5 rounded-lg bg-slate-950/60 hover:bg-slate-950/90 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Enlarge Photo"
                    >
                      <Maximize2 className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Gallery Info & Thumbnails */}
                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                      {gallery.title || "Untitled Gallery Album"}
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Uploaded on{" "}
                      {gallery.uploadedAt
                        ? new Date(gallery.uploadedAt).toLocaleDateString()
                        : "Recent"}
                    </p>

                    {/* Secondary Thumbnails */}
                    {images.length > 1 && (
                      <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-slate-100 overflow-x-auto pb-0.5">
                        {images.slice(1, 5).map((thumb, idx) => (
                          <div
                            key={idx}
                            onClick={() => setPreviewImage(thumb)}
                            className="w-9 h-9 rounded-md overflow-hidden border border-slate-200 shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                          >
                            <img
                              src={thumb}
                              alt={`Thumbnail ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                        {images.length > 5 && (
                          <div className="w-9 h-9 rounded-md bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center text-[10px] font-bold text-slate-500">
                            +{images.length - 5}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-1.5 flex items-center gap-1.5 border-t border-slate-100">
                    <button
                      onClick={() => navigate(`/photo/edit/${gallery.id}`)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-slate-100 hover:bg-orange-50 text-slate-700 hover:text-orange-600 text-xs font-semibold transition-colors"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Manage Album</span>
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(gallery.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete album"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-3">
          <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto">
            <Images className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">No Photo Albums Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Upload high resolution destination photos and customer adventure moments.
          </p>
          <Link
            to="/image/upload"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-orange-500 text-white text-xs font-semibold hover:bg-orange-600 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Upload New Gallery
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="text-center space-y-1">
              <h4 className="text-base font-bold text-slate-900">Delete Photo Gallery?</h4>
              <p className="text-xs text-slate-500">
                Are you sure you want to remove this album and all its images?
              </p>
            </div>
            <div className="flex gap-2.5 pt-1.5">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
                className="flex-1 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleting}
                className="flex-1 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors shadow-md shadow-red-500/25"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Photo Enlarge Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl">
            <img
              src={previewImage}
              alt="Enlarged view"
              className="w-full h-full max-h-[85vh] object-contain"
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/70 text-white hover:bg-slate-950 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPhotos;
