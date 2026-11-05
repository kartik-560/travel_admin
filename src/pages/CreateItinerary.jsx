import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createTrip, getCategories, createCategory } from "../api/trips";
import imageCompression from "browser-image-compression";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Upload,
  Calendar,
  Sparkles,
  MapPin,
  Mountain,
  Compass,
  AlertCircle,
  Loader2,
  Image,
  Eye,
  EyeOff,
  Check,
} from "lucide-react";

const INITIAL_CATEGORIES = [
  "Adventure & Trekking",
  "Cultural & Heritage Tours",
  "Leisure & Offbeat Escapes",
  "Spiritual & Wellness Retreats",
];

const CreateItinerary = () => {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [newCatOpen, setNewCatOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [creatingCat, setCreatingCat] = useState(false);

  const [form, setForm] = useState({
    title: "",
    subTitle: "",
    maxElevation: "",
    duration: "",
    distance: "",
    difficulty: "Moderate",
    startPoint: "",
    endPoint: "",
    travel_description: "",
    destinations: "",
    highlights: "",
    images: [],
    category: "Adventure & Trekking",
    status: "PUBLISHED",
    what_to_expect: [{ expect_title: "", expect_description: "" }],
    days: [
      { day: 1, description: "", distance: "", duration: "", highlights: "" },
    ],
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    getCategories()
      .then((res) => {
        const names = (res.data || []).map((c) => c.name);
        if (names.length > 0) {
          setCategories(names);
          if (!names.includes(form.category)) {
            setForm((prev) => ({ ...prev, category: names[0] }));
          }
        }
      })
      .catch((err) => console.error("Error loading categories:", err));
  }, []);

  const handleAddCategory = async (e) => {
    e?.preventDefault();
    if (!newCatName.trim()) return;
    try {
      setCreatingCat(true);
      const res = await createCategory({ name: newCatName.trim() });
      const addedName = res.data?.name || newCatName.trim();
      setCategories((prev) => (prev.includes(addedName) ? prev : [...prev, addedName]));
      setForm((prev) => ({ ...prev, category: addedName }));
      setNewCatName("");
      setNewCatOpen(false);
    } catch (err) {
      console.error("Failed to add category:", err);
      alert("Failed to add category.");
    } finally {
      setCreatingCat(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleExpectChange = (index, field, value) => {
    const updated = [...form.what_to_expect];
    updated[index][field] = value;
    setForm((prev) => ({ ...prev, what_to_expect: updated }));
  };

  const addExpect = () => {
    setForm((prev) => ({
      ...prev,
      what_to_expect: [
        ...prev.what_to_expect,
        { expect_title: "", expect_description: "" },
      ],
    }));
  };

  const removeExpect = (index) => {
    const updated = form.what_to_expect.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, what_to_expect: updated }));
  };

  const handleDayChange = (index, field, value) => {
    const updated = [...form.days];
    updated[index][field] = value;
    setForm((prev) => ({ ...prev, days: updated }));
  };

  const addDay = () => {
    setForm((prev) => ({
      ...prev,
      days: [
        ...prev.days,
        {
          day: prev.days.length + 1,
          description: "",
          distance: "",
          duration: "",
          highlights: "",
        },
      ],
    }));
  };

  const removeDay = (index) => {
    if (form.days.length <= 1) return;
    const updated = form.days
      .filter((_, i) => i !== index)
      .map((d, i) => ({ ...d, day: i + 1 }));
    setForm((prev) => ({ ...prev, days: updated }));
  };

  const removeImage = (index) => {
    const updated = form.images.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, images: updated }));
  };

  const MAX_TOTAL_KB = 6000;

  const handleBase64ImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    let totalKB = form.images.reduce((sum, img) => {
      return sum + Math.ceil((img.length * 3) / 4 / 1024);
    }, 0);

    for (let file of files) {
      if (!file.type.startsWith("image/")) {
        alert("Only image files are allowed.");
        continue;
      }

      let fileToProcess = file;

      if (file.size > 1 * 1024 * 1024) {
        try {
          fileToProcess = await imageCompression(file, {
            maxSizeMB: 0.35,
            maxWidthOrHeight: 1280,
            useWebWorker: true,
          });
        } catch (err) {
          console.error("Compression failed:", err);
          continue;
        }
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        const kbSize = Math.ceil((base64.length * 3) / 4 / 1024);

        if (totalKB + kbSize > MAX_TOTAL_KB) {
          alert("Cannot upload — total image size will exceed 6MB limit.");
          return;
        }

        totalKB += kbSize;

        setForm((prevForm) => ({
          ...prevForm,
          images: [...prevForm.images, base64],
        }));
      };

      reader.readAsDataURL(fileToProcess);
    }
  };

  const parseList = (str = "") =>
    Array.from(
      new Set(
        str
          .split(/\r?\n|,/)
          .map((s) => s.trim().replace(/^"(.*)"$/, "$1"))
          .filter(Boolean)
      )
    );

  const validateForm = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.duration.trim()) newErrors.duration = "Duration is required";
    if (!form.travel_description.trim())
      newErrors.travel_description = "Travel description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setLoading(true);
    try {
      await createTrip({
        ...form,
        what_to_expect: form.what_to_expect,
        destinations: parseList(form.destinations),
        highlights: parseList(form.highlights),
        images: form.images.filter(Boolean),
        days: form.days.map((d) => ({
          ...d,
          highlights: parseList(d.highlights),
        })),
      });
      navigate("/itineraries");
    } catch (error) {
      console.error("Error creating itinerary:", error);
      setErrors({ submit: "Failed to create itinerary. Please verify backend connection." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 pb-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Link
            to="/itineraries"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
              Create New Itinerary
            </h2>
            <p className="text-[11px] text-slate-400">
              Configure route, highlights, expectations & day-by-day itinerary.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate("/itineraries")}
            className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>Save Itinerary</span>
          </button>
        </div>
      </div>

      {errors.submit && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{errors.submit}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Card 1: Primary Overview */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
            <div className="p-1.5 rounded-lg bg-orange-50 text-orange-600">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Trip Overview</h3>
              <p className="text-[11px] text-slate-400">Essential identifiers and classification</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="md:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Trip Title *
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Leh-Ladakh Bike Expedition"
                className={`w-full px-3 py-1.5 rounded-lg border ${
                  errors.title ? "border-red-500 ring-2 ring-red-500/10" : "border-slate-200"
                } text-xs focus:outline-none focus:border-orange-500 transition-all`}
              />
              {errors.title && <span className="text-[10px] text-red-500 mt-0.5 block">{errors.title}</span>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Subtitle / Catchphrase
              </label>
              <input
                type="text"
                name="subTitle"
                value={form.subTitle}
                onChange={handleChange}
                placeholder="e.g. 9 Days of High-Altitude Himalayan Thrills"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-slate-700">
                  Tour Category *
                </label>
                <button
                  type="button"
                  onClick={() => setNewCatOpen((p) => !p)}
                  className="text-[10px] font-bold text-orange-600 hover:text-orange-700 flex items-center gap-0.5"
                >
                  <Plus className="w-3 h-3" />
                  {newCatOpen ? "Cancel" : "Add New"}
                </button>
              </div>

              {newCatOpen && (
                <div className="flex items-center gap-1.5 mb-2">
                  <input
                    type="text"
                    placeholder="New category name..."
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="flex-1 px-2.5 py-1 text-xs rounded-lg border border-orange-300 focus:outline-none focus:border-orange-500 bg-orange-50/20"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCategory();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    disabled={creatingCat || !newCatName.trim()}
                    className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50"
                  >
                    {creatingCat ? "Saving..." : "Add"}
                  </button>
                </div>
              )}

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-orange-500 transition-all bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Website Visibility Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, status: "PUBLISHED" }))}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    form.status === "PUBLISHED"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500"
                      : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Live on Web</span>
                </button>
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, status: "HIDDEN" }))}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    form.status === "HIDDEN"
                      ? "border-amber-500 bg-amber-50 text-amber-700 ring-1 ring-amber-500"
                      : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  <EyeOff className="w-3.5 h-3.5 text-amber-600" />
                  <span>Hidden (Draft)</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Difficulty Level
              </label>
              <select
                name="difficulty"
                value={form.difficulty}
                onChange={handleChange}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-orange-500 transition-all bg-white"
              >
                <option value="Easy">Easy</option>
                <option value="Easy to Moderate">Easy to Moderate</option>
                <option value="Moderate">Moderate</option>
                <option value="Moderate-Challenging">Moderate-Challenging</option>
                <option value="Difficult">Difficult</option>
                <option value="Extreme">Extreme</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Duration *
              </label>
              <input
                type="text"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                placeholder="e.g. 9 Days / 8 Nights"
                className={`w-full px-3 py-1.5 rounded-lg border ${
                  errors.duration ? "border-red-500 ring-2 ring-red-500/10" : "border-slate-200"
                } text-xs focus:outline-none focus:border-orange-500 transition-all`}
              />
              {errors.duration && <span className="text-[10px] text-red-500 mt-0.5 block">{errors.duration}</span>}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Total Distance
              </label>
              <input
                type="text"
                name="distance"
                value={form.distance}
                onChange={handleChange}
                placeholder="e.g. ~1200 km"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Max Elevation
              </label>
              <input
                type="text"
                name="maxElevation"
                value={form.maxElevation}
                onChange={handleChange}
                placeholder="e.g. 18,380 ft (Khardung La)"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Route & Logistics */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Route & Locations</h3>
              <p className="text-[11px] text-slate-400">Starting point, ending point, and key stopovers</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Start Point
              </label>
              <input
                type="text"
                name="startPoint"
                value={form.startPoint}
                onChange={handleChange}
                placeholder="e.g. Manali"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                End Point
              </label>
              <input
                type="text"
                name="endPoint"
                value={form.endPoint}
                onChange={handleChange}
                placeholder="e.g. Srinagar"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Destinations (comma separated)
              </label>
              <input
                type="text"
                name="destinations"
                value={form.destinations}
                onChange={handleChange}
                placeholder="e.g. Manali, Jispa, Sarchu, Leh, Nubra Valley, Pangong Tso"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Description & Highlights */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Experience Description & Highlights</h3>
              <p className="text-[11px] text-slate-400">Rich details about the travel experience</p>
            </div>
          </div>

          <div className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Full Travel Description *
              </label>
              <textarea
                name="travel_description"
                rows={4}
                value={form.travel_description}
                onChange={handleChange}
                placeholder="Describe the adventure, terrain, cultural immersion..."
                className={`w-full px-3 py-2 rounded-xl border ${
                  errors.travel_description ? "border-red-500 ring-2 ring-red-500/10" : "border-slate-200"
                } text-xs focus:outline-none focus:border-orange-500 transition-all`}
              />
              {errors.travel_description && (
                <span className="text-[10px] text-red-500 mt-0.5 block">{errors.travel_description}</span>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Key Highlights (comma or newline separated)
              </label>
              <textarea
                name="highlights"
                rows={2}
                value={form.highlights}
                onChange={handleChange}
                placeholder="e.g. Khardung La Pass, Camp under Milky Way at Pangong..."
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Card 4: Photo Gallery */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                <Image className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Trip Gallery Photos</h3>
                <p className="text-[11px] text-slate-400">Auto-compressed images ({form.images.length} uploaded)</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-slate-300 rounded-2xl hover:border-orange-500 hover:bg-orange-50/20 cursor-pointer transition-all group">
              <Upload className="w-6 h-6 text-slate-400 group-hover:text-orange-500 mb-1 transition-colors" />
              <span className="text-xs font-semibold text-slate-700 group-hover:text-orange-600">
                Click to browse or drop images
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">
                JPEG, PNG, WEBP (Images over 1MB are automatically compressed)
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleBase64ImageUpload}
                className="hidden"
              />
            </label>

            {form.images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 pt-1">
                {form.images.map((img, index) => (
                  <div
                    key={index}
                    className="relative aspect-video rounded-lg overflow-hidden bg-slate-100 border border-slate-200 group"
                  >
                    <img src={img} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 rounded bg-red-600 text-white shadow opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-slate-950/70 text-white text-[9px] font-bold">
                        Cover
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Card 5: What To Expect */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                <Mountain className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">What To Expect</h3>
                <p className="text-[11px] text-slate-400">Trip features and preparations</p>
              </div>
            </div>
            <button
              type="button"
              onClick={addExpect}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-600 text-xs font-semibold transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>Add</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {form.what_to_expect.map((item, index) => (
              <div
                key={index}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700">Item #{index + 1}</span>
                  {form.what_to_expect.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExpect(index)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Title"
                    value={item.expect_title}
                    onChange={(e) => handleExpectChange(index, "expect_title", e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-orange-500"
                  />
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      placeholder="Description"
                      value={item.expect_description}
                      onChange={(e) => handleExpectChange(index, "expect_description", e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 6: Day-by-Day */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-teal-50 text-teal-600">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Day-by-Day Itinerary</h3>
                <p className="text-[11px] text-slate-400">Detailed daily breakdown ({form.days.length} days)</p>
              </div>
            </div>
            <button
              type="button"
              onClick={addDay}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-600 text-xs font-semibold transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>Add Day</span>
            </button>
          </div>

          <div className="space-y-3">
            {form.days.map((dayItem, index) => (
              <div
                key={index}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5 relative"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded bg-orange-500 text-white flex items-center justify-center font-bold text-[10px]">
                      {dayItem.day}
                    </span>
                    <span className="text-xs font-bold text-slate-800">Day {dayItem.day}</span>
                  </div>
                  {form.days.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDay(index)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Distance (e.g. 140 km)"
                    value={dayItem.distance}
                    onChange={(e) => handleDayChange(index, "distance", e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-orange-500"
                  />
                  <input
                    type="text"
                    placeholder="Duration (e.g. 5-6 hours)"
                    value={dayItem.duration}
                    onChange={(e) => handleDayChange(index, "duration", e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-orange-500"
                  />
                  <input
                    type="text"
                    placeholder="Highlights"
                    value={dayItem.highlights}
                    onChange={(e) => handleDayChange(index, "highlights", e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>

                <textarea
                  rows={2}
                  placeholder="Day Description"
                  value={dayItem.description}
                  onChange={(e) => handleDayChange(index, "description", e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-orange-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={() => navigate("/itineraries")}
            className="px-4 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>Save Itinerary</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateItinerary;
