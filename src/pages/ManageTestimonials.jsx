import React, { useEffect, useState } from "react";
import imageCompression from "browser-image-compression";
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  updateTestimonialStatus,
  deleteTestimonial,
} from "../api/testimonials";
import { getCategories } from "../api/trips";
import {
  MessageSquareQuote,
  Plus,
  Edit3,
  Trash2,
  Check,
  X,
  Star,
  MapPin,
  Tag,
  Search,
  AlertCircle,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Loader2,
  Sparkles,
  Upload,
  Link as LinkIcon,
  Layers,
} from "lucide-react";

const FALLBACK_CATEGORIES = [
  "Adventure & Trekking",
  "Cultural & Heritage Tours",
  "Leisure & Offbeat Escapes",
  "Spiritual & Wellness Retreats",
];

const emptyForm = {
  name: "",
  role: "Traveler",
  category: "Adventure & Trekking",
  text: "",
  location: "",
  rating: 5,
  tag: "",
  status: "PUBLISHED",
  order: 0,
};

const ManageTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  // Modal State (Create / Edit)
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [imageList, setImageList] = useState([]);
  const [manualUrl, setManualUrl] = useState("");
  const [uploadingImages, setUploadingImages] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState("");

  // Delete Modal
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch Testimonials
  const fetchList = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await getTestimonials({ all: true });
      const items = res?.data?.testimonials || [];
      setTestimonials(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error("Failed to fetch testimonials:", err);
      setErrorMsg(
        err?.response?.data?.error ||
          "Failed to load testimonials. Check backend connection."
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch Dynamic Categories from Backend
  const fetchCategoriesList = async () => {
    try {
      const res = await getCategories();
      const list = Array.isArray(res.data) ? res.data.map((c) => c.name) : [];
      if (list.length > 0) {
        setCategories(list);
      } else {
        setCategories(FALLBACK_CATEGORIES);
      }
    } catch (err) {
      console.error("Failed to load categories:", err);
      setCategories(FALLBACK_CATEGORIES);
    }
  };

  useEffect(() => {
    fetchList();
    fetchCategoriesList();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      ...emptyForm,
      category: categories[0] || "Adventure & Trekking",
    });
    setImageList([]);
    setManualUrl("");
    setIsCustomCategory(false);
    setCustomCategoryName("");
    setModalOpen(true);
    setErrorMsg("");
  };

  const handleOpenEdit = (t) => {
    setEditingId(t.id);
    const existingCategory = t.category || "Adventure & Trekking";
    const inList = categories.includes(existingCategory);

    setFormData({
      name: t.name || "",
      role: t.role || "Traveler",
      category: inList ? existingCategory : "__custom__",
      text: t.text || "",
      location: t.location || "",
      rating: t.rating || 5,
      tag: t.tag || "",
      status: t.status || "PUBLISHED",
      order: t.order || 0,
    });

    if (!inList) {
      setIsCustomCategory(true);
      setCustomCategoryName(existingCategory);
    } else {
      setIsCustomCategory(false);
      setCustomCategoryName("");
    }

    const imgs = Array.isArray(t.images)
      ? t.images
      : Array.isArray(t.image)
      ? t.image
      : [];
    setImageList(imgs);
    setManualUrl("");
    setModalOpen(true);
    setErrorMsg("");
  };

  // Image Upload via File Input with Compression
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploadingImages(true);
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        alert(`${file.name} is not an image file.`);
        continue;
      }

      try {
        const compressed = await imageCompression(file, {
          maxSizeMB: 0.6,
          maxWidthOrHeight: 1280,
          useWebWorker: true,
        });

        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            setImageList((prev) => [...prev, reader.result]);
          }
        };
        reader.readAsDataURL(compressed);
      } catch (err) {
        console.error("Image compression error:", err);
      }
    }
    setUploadingImages(false);
    e.target.value = "";
  };

  // Add Image by URL or Path
  const handleAddManualUrl = () => {
    const trimmed = manualUrl.trim();
    if (!trimmed) return;
    setImageList((prev) => [...prev, trimmed]);
    setManualUrl("");
  };

  // Remove Image
  const handleRemoveImage = (index) => {
    setImageList((prev) => prev.filter((_, i) => i !== index));
  };

  // Set as Cover Photo (Move to Index 0)
  const handleMakeCover = (index) => {
    if (index === 0) return;
    setImageList((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(index, 1);
      return [item, ...copy];
    });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.text.trim() || !formData.location.trim()) {
      setErrorMsg("Name, Location, and Testimonial story text are required.");
      return;
    }

    const selectedCategory = isCustomCategory
      ? customCategoryName.trim() || "Adventure & Trekking"
      : formData.category;

    try {
      setSaving(true);
      setErrorMsg("");

      const payload = {
        name: formData.name.trim(),
        role: formData.role.trim() || "Traveler",
        category: selectedCategory,
        images: imageList,
        text: formData.text.trim(),
        location: formData.location.trim(),
        rating: Number(formData.rating) || 5,
        tag: formData.tag.trim() || null,
        status: formData.status,
        order: Number(formData.order) || 0,
      };

      if (editingId) {
        await updateTestimonial(editingId, payload);
        setSuccessMsg("Testimonial updated successfully!");
      } else {
        await createTestimonial(payload);
        setSuccessMsg("New testimonial created successfully!");
      }

      setModalOpen(false);
      setFormData(emptyForm);
      setImageList([]);
      setEditingId(null);
      await fetchList();
      setTimeout(() => setSuccessMsg(""), 3500);
    } catch (err) {
      console.error("Failed to save testimonial:", err);
      setErrorMsg(err?.response?.data?.error || "Failed to save testimonial.");
    } finally {
      setSaving(false);
    }
  };

  // Toggle Status
  const handleToggleStatus = async (t) => {
    const nextStatus = t.status === "PUBLISHED" ? "HIDDEN" : "PUBLISHED";
    try {
      await updateTestimonialStatus(t.id, nextStatus);
      setTestimonials((prev) =>
        prev.map((item) => (item.id === t.id ? { ...item, status: nextStatus } : item))
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      setErrorMsg("Failed to update status.");
    }
  };

  // Delete Testimonial
  const handleDeleteConfirm = async () => {
    if (!deleteModal) return;
    try {
      setDeleting(true);
      await deleteTestimonial(deleteModal.id);
      setDeleteModal(null);
      setSuccessMsg("Testimonial deleted successfully.");
      await fetchList();
      setTimeout(() => setSuccessMsg(""), 3500);
    } catch (err) {
      console.error("Failed to delete testimonial:", err);
      setErrorMsg(err?.response?.data?.error || "Failed to delete testimonial.");
    } finally {
      setDeleting(false);
    }
  };

  // Filtered List - strictly based on the 4 system categories
  const filtered = testimonials.filter((t) => {
    const matchesCategory =
      filterCategory === "All" || (t.category || "") === filterCategory;
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      t.name?.toLowerCase().includes(q) ||
      t.text?.toLowerCase().includes(q) ||
      t.location?.toLowerCase().includes(q) ||
      t.role?.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const totalCount = testimonials.length;
  const publishedCount = testimonials.filter((t) => t.status === "PUBLISHED").length;
  const hiddenCount = testimonials.filter((t) => t.status === "HIDDEN").length;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
              <MessageSquareQuote className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Manage Testimonials
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Add, upload photos, and organize traveler stories linked to your dynamic categories.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs sm:text-sm shadow-md shadow-orange-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      {/* Messages */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
          <button
            onClick={() => setErrorMsg("")}
            className="ml-auto text-rose-500 hover:text-rose-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs sm:text-sm flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
          <button
            onClick={() => setSuccessMsg("")}
            className="ml-auto text-emerald-500 hover:text-emerald-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Stats Counter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Total Testimonials
          </p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{totalCount}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs">
          <p className="text-xs font-medium text-emerald-600 uppercase tracking-wider">
            Published (Live)
          </p>
          <p className="text-2xl font-bold text-emerald-700 mt-1">{publishedCount}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Hidden / Draft
          </p>
          <p className="text-2xl font-bold text-slate-600 mt-1">{hiddenCount}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, story, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
        </div>

        {/* Dynamic Category Filter Pills */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-slate-500 font-medium shrink-0 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>Category:</span>
          </span>
          {["All", ...categories].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                filterCategory === cat
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content List */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-2" />
          <p className="text-sm text-slate-500 font-medium">Loading testimonials...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-3">
          <MessageSquareQuote className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">No Testimonials Found</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            {searchTerm || filterCategory !== "All"
              ? "No testimonials matched your active filters. Try clearing the search."
              : "Get started by adding your first traveler testimonial."}
          </p>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 text-white font-semibold text-xs shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add First Testimonial</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((t) => {
            const imgs = Array.isArray(t.images)
              ? t.images
              : Array.isArray(t.image)
              ? t.image
              : [];
            const primaryImage = imgs.length > 0 ? imgs[0] : null;

            return (
              <div
                key={t.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Photo Header */}
                  <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                    {primaryImage ? (
                      <img
                        src={primaryImage}
                        alt={t.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                        <ImageIcon className="w-8 h-8 mb-1" />
                        <span className="text-xs">No photo uploaded</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Status Pill */}
                    <div className="absolute top-3 left-3">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(t)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-xs backdrop-blur-md cursor-pointer transition-colors ${
                          t.status === "PUBLISHED"
                            ? "bg-emerald-500/90 hover:bg-emerald-600 text-white"
                            : "bg-slate-700/90 hover:bg-slate-800 text-slate-200"
                        }`}
                        title="Click to toggle Published/Hidden"
                      >
                        {t.status === "PUBLISHED" ? (
                          <>
                            <Eye className="w-3 h-3" />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            <span>Hidden</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Category & Rating */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold">
                        {t.category || "General"}
                      </span>
                    </div>

                    {/* Traveler Info on Photo */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-base leading-tight">{t.name}</h3>
                          <p className="text-xs text-orange-300 font-medium">{t.role}</p>
                        </div>
                        <div className="flex items-center gap-0.5 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-md">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-bold">{t.rating || 5}.0</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Body Text */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                      <span className="truncate">{t.location}</span>
                      {t.tag && (
                        <span className="ml-auto text-[10px] px-2 py-0.5 rounded-md bg-orange-50 text-orange-700 border border-orange-100 font-semibold truncate">
                          {t.tag}
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-4 italic leading-relaxed">
                      &ldquo;{t.text}&rdquo;
                    </p>

                    {imgs.length > 1 && (
                      <p className="text-[11px] text-slate-400">
                        +{imgs.length - 1} additional photo(s)
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400">Order: #{t.order || 0}</div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(t)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 transition-colors cursor-pointer"
                      title="Edit Testimonial"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteModal(t)}
                      className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete Testimonial"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ============================================================== */}
      {/* CREATE / EDIT MODAL WITH PHOTO UPLOAD & DYNAMIC CATEGORY       */}
      {/* ============================================================== */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 my-8 space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-orange-100 text-orange-600">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingId ? "Edit Testimonial" : "Add New Testimonial"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Traveler Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Seranne, Rahul Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Role / Subtitle
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Solo Backpacker, Road Tripper"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>

              {/* DYNAMIC CATEGORY SELECTOR */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                    <span>Category (Loaded from Backend) *</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      {categories.length} loaded
                    </span>
                  </label>

                  <select
                    value={isCustomCategory ? "__custom__" : formData.category}
                    onChange={(e) => {
                      if (e.target.value === "__custom__") {
                        setIsCustomCategory(true);
                      } else {
                        setIsCustomCategory(false);
                        setFormData({ ...formData, category: e.target.value });
                      }
                    }}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                    <option value="__custom__">+ Custom Category...</option>
                  </select>

                  {isCustomCategory && (
                    <input
                      type="text"
                      required
                      placeholder="Type custom category name..."
                      value={customCategoryName}
                      onChange={(e) => setCustomCategoryName(e.target.value)}
                      className="w-full mt-2 px-3 py-2 text-xs sm:text-sm rounded-xl border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Trip Location *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Spiti Valley, Himachal Pradesh"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Rating */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Rating (Stars)
                  </label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white"
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>
                        {r} Star{r > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tag / Badge */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Highlight Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. High Mountain Trek"
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white"
                  >
                    <option value="PUBLISHED">Published (Visible)</option>
                    <option value="HIDDEN">Hidden (Draft)</option>
                  </select>
                </div>
              </div>

              {/* ============================================================== */}
              {/* PHOTO UPLOAD & MANAGEMENT SECTION                              */}
              {/* ============================================================== */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-700">
                    Testimonial Photos ({imageList.length})
                  </label>
                  <span className="text-[11px] text-slate-400">
                    First photo is used as cover. Multiple photos allowed.
                  </span>
                </div>

                {/* Upload Zone */}
                <div className="border-2 border-dashed border-slate-300 hover:border-orange-500 rounded-2xl p-5 text-center transition-colors bg-slate-50/60 hover:bg-orange-50/20">
                  <input
                    type="file"
                    id="testimonial-file-upload"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="testimonial-file-upload"
                    className="cursor-pointer flex flex-col items-center justify-center gap-1.5"
                  >
                    {uploadingImages ? (
                      <Loader2 className="w-7 h-7 text-orange-500 animate-spin" />
                    ) : (
                      <Upload className="w-7 h-7 text-slate-400 group-hover:text-orange-500" />
                    )}
                    <span className="text-xs sm:text-sm font-semibold text-slate-700">
                      {uploadingImages
                        ? "Compressing and uploading..."
                        : "Click to upload photos from your device"}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Supports JPG, PNG, WebP (auto-compressed for ultra-fast loading)
                    </span>
                  </label>
                </div>

                {/* Or Add by URL/Path */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Or paste image URL / asset path (e.g. /assest/...)"
                      value={manualUrl}
                      onChange={(e) => setManualUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddManualUrl();
                        }
                      }}
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddManualUrl}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer shrink-0"
                  >
                    Add URL
                  </button>
                </div>

                {/* Uploaded Images Preview Grid */}
                {imageList.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-2">
                    {imageList.map((img, idx) => (
                      <div
                        key={idx}
                        className="group relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 aspect-video shadow-xs"
                      >
                        <img
                          src={img}
                          alt={`Uploaded preview ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                          {idx !== 0 && (
                            <button
                              type="button"
                              onClick={() => handleMakeCover(idx)}
                              className="px-1.5 py-0.5 rounded bg-white text-slate-900 text-[10px] font-bold shadow-xs hover:bg-orange-50"
                              title="Set as Cover Photo"
                            >
                              Cover
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="p-1 rounded-full bg-rose-600 text-white hover:bg-rose-700 shadow-xs"
                            title="Remove photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {idx === 0 && (
                          <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-orange-500 text-white text-[9px] font-bold shadow-xs">
                            Cover
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Story / Text */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Traveler Story / Quote *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Enter the authentic words shared by the traveler..."
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 leading-relaxed"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving || uploadingImages}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingId ? "Save Changes" : "Create Testimonial"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* DELETE CONFIRMATION MODAL                                      */}
      {/* ============================================================== */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Delete Testimonial?</h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Are you sure you want to delete the testimonial from{" "}
                <strong className="text-slate-800">{deleteModal.name}</strong>? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModal(null)}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteConfirm}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm shadow-md"
              >
                {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTestimonials;
