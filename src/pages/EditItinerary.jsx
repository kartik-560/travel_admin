import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getTrip, updateTrip, getCategories, createCategory } from "../api/trips";
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
} from "lucide-react";

const INITIAL_CATEGORIES = [
  "Adventure & Trekking",
  "Cultural & Heritage Tours",
  "Leisure & Offbeat Escapes",
  "Spiritual & Wellness Retreats",
];

const EditItinerary = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
    category: "Adventure & Trekking",
    status: "PUBLISHED",
    destinations: [],
    travel_description: "",
    highlights: "",
    images: [],
    what_to_expect: [],
    days: [],
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    let mounted = true;
    const fetchTrip = async () => {
      try {
        setFetching(true);
        const { data } = await getTrip(id);

        const normalized = {
          title: data?.title ?? "",
          subTitle: data?.subTitle ?? "",
          maxElevation: data?.maxElevation?.toString?.() ?? "",
          duration: data?.duration?.toString?.() ?? "",
          distance: data?.distance?.toString?.() ?? "",
          difficulty: data?.difficulty ?? "Moderate",
          startPoint: data?.startPoint ?? "",
          endPoint: data?.endPoint ?? "",
          category: data?.category ?? "Adventure & Trekking",
          status: data?.status || "PUBLISHED",
          destinations: Array.isArray(data?.destinations)
            ? data.destinations
            : data?.destinations
            ? String(data.destinations).split(",").map((s) => s.trim()).filter(Boolean)
            : [],
          travel_description: data?.travel_description ?? "",
          highlights: Array.isArray(data?.highlights)
            ? data.highlights.join(", ")
            : data?.highlights ?? "",
          images: Array.isArray(data?.images) ? data.images.filter(Boolean) : [],
          what_to_expect: Array.isArray(data?.what_to_expect)
            ? data.what_to_expect.map((x) => ({
                expect_title: x?.expect_title ?? x?.title ?? "",
                expect_description: x?.expect_description ?? x?.description ?? "",
              }))
            : Array.isArray(data?.whatToExpect)
            ? data.whatToExpect.map((x) => ({
                expect_title: x?.expect_title ?? x?.title ?? "",
                expect_description: x?.expect_description ?? x?.description ?? "",
              }))
            : [],
          days: Array.isArray(data?.days)
            ? data.days.map((d, i) => ({
                day: d?.day || i + 1,
                description: d?.description ?? "",
                distance: d?.distance ?? "",
                duration: d?.duration ?? "",
                highlights: Array.isArray(d?.highlights)
                  ? d.highlights.join(", ")
                  : d?.highlights ?? "",
              }))
            : [],
        };

        if (mounted) setForm((prev) => ({ ...prev, ...normalized }));
      } catch (err) {
        console.error("Failed to fetch itinerary:", err);
        if (err?.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        if (mounted) setFetching(false);
      }
    };

    if (id) fetchTrip();
    return () => {
      mounted = false;
    };
  }, [id, navigate]);

  useEffect(() => {
    getCategories()
      .then((res) => {
        const names = (res.data || []).map((c) => c.name);
        if (names.length > 0) {
          setCategories((prev) => {
            const combined = new Set([...names, ...prev]);
            return Array.from(combined);
          });
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
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleExpectChange = (index, field, value) => {
    setForm((prev) => {
      const curr = [...(prev.what_to_expect || [])];
      curr[index] = { ...curr[index], [field]: value };
      return { ...prev, what_to_expect: curr };
    });
  };

  const addExpect = () => {
    setForm((prev) => ({
      ...prev,
      what_to_expect: [
        ...(prev.what_to_expect || []),
        { expect_title: "", expect_description: "" },
      ],
    }));
  };

  const removeExpect = (index) => {
    setForm((prev) => ({
      ...prev,
      what_to_expect: (prev.what_to_expect || []).filter((_, i) => i !== index),
    }));
  };

  const handleDayChange = (index, field, value) => {
    setForm((prev) => {
      const curr = [...(prev.days || [])];
      curr[index] = { ...curr[index], [field]: value };
      return { ...prev, days: curr };
    });
  };

  const addDay = () => {
    setForm((prev) => ({
      ...prev,
      days: [
        ...(prev.days || []),
        {
          day: (prev.days || []).length + 1,
          description: "",
          distance: "",
          duration: "",
          highlights: "",
        },
      ],
    }));
  };

  const removeDay = (index) => {
    setForm((prev) => ({
      ...prev,
      days: (prev.days || [])
        .filter((_, i) => i !== index)
        .map((d, i) => ({ ...d, day: i + 1 })),
    }));
  };

  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index),
    }));
  };

  const MAX_TOTAL_KB = 6000;

  const handleBase64ImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    let totalKB = (form.images || []).reduce((sum, img) => {
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
          images: [...(prevForm.images || []), base64],
        }));
      };

      reader.readAsDataURL(fileToProcess);
    }
  };

  const parseList = (val) => {
    if (Array.isArray(val)) return val;
    if (!val) return [];
    return Array.from(
      new Set(
        String(val)
          .split(/\r?\n|,/)
          .map((s) => s.trim().replace(/^"(.*)"$/, "$1"))
          .filter(Boolean)
      )
    );
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title?.trim()) newErrors.title = "Title is required";
    if (!form.duration?.trim()) newErrors.duration = "Duration is required";
    if (!form.travel_description?.trim())
      newErrors.travel_description = "Travel description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const payload = {
        ...form,
        images: (form.images || []).filter(Boolean),
        destinations: parseList(form.destinations),
        highlights: parseList(form.highlights),
        what_to_expect: (form.what_to_expect || []).map((x) => ({
          expect_title: x.expect_title ?? "",
          expect_description: x.expect_description ?? "",
        })),
        days: (form.days || []).map((d) => ({
          day: typeof d.day === "string" ? parseInt(d.day, 10) || 0 : d.day || 0,
          description: d.description ?? "",
          distance: d.distance ?? "",
          duration: d.duration ?? "",
          highlights: parseList(d.highlights),
        })),
        maxElevation: form.maxElevation?.toString?.() ?? "",
        distance: form.distance?.toString?.() ?? "",
        duration: form.duration?.toString?.() ?? "",
      };

      await updateTrip(id, payload);
      navigate("/itineraries");
    } catch (error) {
      console.error("Update failed:", error);
      setErrors({ submit: "Failed to update itinerary. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto">
        <div className="h-10 bg-slate-200 rounded-xl animate-pulse" />
        <div className="h-56 bg-slate-200 rounded-2xl animate-pulse" />
        <div className="h-56 bg-slate-200 rounded-2xl animate-pulse" />
      </div>
    );
  }

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
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Edit Itinerary
            </h2>
            <p className="text-[11px] text-slate-500">
              Editing: <span className="font-semibold text-slate-700">{form.title}</span>
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
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-semibold shadow-md shadow-orange-500/20 transition-all disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>Update Itinerary</span>
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
        {/* Card 1: Overview */}
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
                placeholder="Trip Title"
                className={`w-full px-3 py-1.5 rounded-lg border ${
                  errors.title ? "border-red-500 ring-2 ring-red-500/10" : "border-slate-200"
                } text-xs focus:outline-none focus:border-orange-500 transition-all`}
              />
              {errors.title && <span className="text-[10px] text-red-500 mt-0.5 block">{errors.title}</span>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Subtitle
              </label>
              <input
                type="text"
                name="subTitle"
                value={form.subTitle}
                onChange={handleChange}
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
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Route */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Route & Destinations</h3>
              <p className="text-[11px] text-slate-400">Starting point, ending point, and stopovers</p>
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
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Destinations (comma or newline separated)
              </label>
              <input
                type="text"
                name="destinations"
                value={Array.isArray(form.destinations) ? form.destinations.join(", ") : form.destinations}
                onChange={handleChange}
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
              <p className="text-[11px] text-slate-400">Comprehensive overview of the trip</p>
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
                Highlights (comma or newline separated)
              </label>
              <textarea
                name="highlights"
                rows={2}
                value={form.highlights}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Card 4: Images */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                <Image className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Trip Gallery Photos</h3>
                <p className="text-[11px] text-slate-400">{(form.images || []).length} photos attached</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-slate-300 rounded-2xl hover:border-orange-500 hover:bg-orange-50/20 cursor-pointer transition-all group">
              <Upload className="w-6 h-6 text-slate-400 group-hover:text-orange-500 mb-1.5 transition-colors" />
              <span className="text-xs font-semibold text-slate-700 group-hover:text-orange-600">
                Upload new photos to this trip
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

            {(form.images || []).length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5 pt-1">
                {form.images.map((img, index) => (
                  <div
                    key={index}
                    className="relative aspect-video rounded-lg overflow-hidden bg-slate-100 border border-slate-200 group"
                  >
                    <img src={img} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 rounded-md bg-red-600 text-white shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                      title="Remove image"
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
                <p className="text-[11px] text-slate-400">Trip expectations and preparations</p>
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
            {(form.what_to_expect || []).map((item, index) => (
              <div
                key={index}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700">Expectation #{index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeExpect(index)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  <div>
                    <input
                      type="text"
                      placeholder="Title"
                      value={item.expect_title}
                      onChange={(e) => handleExpectChange(index, "expect_title", e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      placeholder="Description"
                      value={item.expect_description}
                      onChange={(e) => handleExpectChange(index, "expect_description", e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-orange-500"
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
                <p className="text-[11px] text-slate-400">{(form.days || []).length} days structured</p>
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
            {(form.days || []).map((dayItem, index) => (
              <div
                key={index}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5 relative"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-orange-500 text-white flex items-center justify-center font-bold text-[11px]">
                      {dayItem.day}
                    </span>
                    <span className="text-xs font-bold text-slate-900">Day {dayItem.day}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDay(index)}
                    className="text-slate-400 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                      Distance
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 120 km"
                      value={dayItem.distance}
                      onChange={(e) => handleDayChange(index, "distance", e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                      Duration
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 4-5 hours"
                      value={dayItem.duration}
                      onChange={(e) => handleDayChange(index, "duration", e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                      Highlights
                    </label>
                    <input
                      type="text"
                      placeholder="Highlights"
                      value={dayItem.highlights}
                      onChange={(e) => handleDayChange(index, "highlights", e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                    Day Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Day Description"
                    value={dayItem.description}
                    onChange={(e) => handleDayChange(index, "description", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
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
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-semibold shadow-md shadow-orange-500/20 transition-all disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>Update Itinerary</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditItinerary;
