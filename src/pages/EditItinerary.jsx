// src/pages/EditItinerary.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTrip, updateTrip } from "../api/trips"; // uses your Basic-auth axios client
import imageCompression from "browser-image-compression";
import "./styles/EditItinerary.css";

const EditItinerary = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    subTitle: "",
    maxElevation: "",
    duration: "",
    distance: "",
    difficulty: "",
    startPoint: "",
    endPoint: "",
    category: "",
    destinations: [],
    travel_description: "",
    highlights: "",
    images: [],
    what_to_expect: [],
    days: [],
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errors, setErrors] = useState({}); // { field: message }

  // ---------- Utils ----------
  const base64KB = (b64 = "") => Math.ceil((b64.length * 3) / 4 / 1024);

  const validate = (draft) => {
    const e = {};
    if (!draft.title?.trim()) e.title = "Title is required";
    if (!draft.category?.trim()) e.category = "Category is required";
    return e;
  };

  // ---------- Initial fetch ----------
  useEffect(() => {
    let mounted = true;
    const fetchTrip = async () => {
      try {
        setFetching(true);
        const { data } = await getTrip(id);

        // Normalize API variants (handles whatToExpect vs what_to_expect; days highlights array vs string)
        const normalized = {
          title: data?.title ?? "",
          subTitle: data?.subTitle ?? "",
          maxElevation: data?.maxElevation?.toString?.() ?? "",
          duration: data?.duration?.toString?.() ?? "",
          distance: data?.distance?.toString?.() ?? "",
          difficulty: data?.difficulty ?? "",
          startPoint: data?.startPoint ?? "",
          endPoint: data?.endPoint ?? "",
          category: data?.category ?? "",
          destinations: Array.isArray(data?.destinations)
            ? data.destinations
            : data?.destinations
            ? String(data.destinations)
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            : [],
          travel_description: data?.travel_description ?? "",
          highlights: data?.highlights ?? "",
          images: Array.isArray(data?.images) ? data.images.filter(Boolean) : [],
          what_to_expect: Array.isArray(data?.what_to_expect)
            ? data.what_to_expect.map((x) => ({
                expect_title: x?.expect_title ?? x?.title ?? "",
                expect_description:
                  x?.expect_description ?? x?.description ?? "",
              }))
            : Array.isArray(data?.whatToExpect)
            ? data.whatToExpect.map((x) => ({
                expect_title: x?.expect_title ?? x?.title ?? "",
                expect_description:
                  x?.expect_description ?? x?.description ?? "",
              }))
            : [],
          days: Array.isArray(data?.days)
            ? data.days.map((d) => ({
                day:
                  typeof d?.day === "string"
                    ? parseInt(d.day, 10) || 0
                    : Number.isFinite(d?.day)
                    ? d.day
                    : 0,
                description: d?.description ?? "",
                distance: d?.distance ?? "",
                duration: d?.duration ?? "",
                // Store as comma string for editing; API might expect array
                highlights: Array.isArray(d?.highlights)
                  ? d.highlights.join(", ")
                  : d?.highlights ?? "",
              }))
            : [],
        };

        if (mounted) setForm((prev) => ({ ...prev, ...normalized }));
      } catch (err) {
        console.error("Failed to fetch itinerary:", err);
        const status = err?.response?.status;
        if (status === 401) {
          // Not authenticated (Basic header missing/invalid)
          navigate("/login");
          return;
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

  // ---------- Handlers ----------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Destinations editor (store array; edit as comma string)
  const destinationsString = useMemo(
    () => (Array.isArray(form.destinations) ? form.destinations.join(", ") : ""),
    [form.destinations]
  );
  const handleDestinationsChange = (e) => {
    const arr = String(e.target.value)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setForm((prev) => ({ ...prev, destinations: arr }));
  };

  // Images
  const MAX_TOTAL_KB = 6000; // 6MB combined
  const handleBase64ImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    let totalKB = (form.images || []).reduce((sum, img) => sum + base64KB(img), 0);

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
        const kbSize = base64KB(base64);

        if (totalKB + kbSize > MAX_TOTAL_KB) {
          alert("Cannot upload — total image size will exceed 6MB.");
          return;
        }

        totalKB += kbSize;
        setForm((prev) => ({ ...prev, images: [...(prev.images || []), base64] }));
      };
      reader.readAsDataURL(fileToProcess);
    }

    // allow re-selecting the same file
    e.target.value = "";
  };

  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index),
    }));
  };

  // What to expect
  const handleExpectChange = (index, field, value) => {
    setForm((prev) => {
      const curr = Array.isArray(prev.what_to_expect) ? [...prev.what_to_expect] : [];
      const item = curr[index] ?? { expect_title: "", expect_description: "" };
      curr[index] = { ...item, [field]: value };
      return { ...prev, what_to_expect: curr };
    });
  };

  const addExpect = () => {
    setForm((prev) => ({
      ...prev,
      what_to_expect: [
        ...(Array.isArray(prev.what_to_expect) ? prev.what_to_expect : []),
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

  // Days
  const handleDayChange = (index, field, value) => {
    setForm((prev) => {
      const curr = Array.isArray(prev.days) ? [...prev.days] : [];
      const item =
        curr[index] ?? { day: "", description: "", distance: "", duration: "", highlights: "" };
      curr[index] = { ...item, [field]: value };
      return { ...prev, days: curr };
    });
  };

  const addDay = () => {
    setForm((prev) => ({
      ...prev,
      days: [
        ...(Array.isArray(prev.days) ? prev.days : []),
        { day: "", description: "", distance: "", duration: "", highlights: "" },
      ],
    }));
  };

  const removeDay = (index) => {
    setForm((prev) => ({
      ...prev,
      days: (prev.days || []).filter((_, i) => i !== index),
    }));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const fieldErrors = validate(form);
    if (Object.keys(fieldErrors).length) {
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const payload = {
        ...form,
        images: Array.isArray(form.images) ? form.images.filter(Boolean) : [],
        what_to_expect: (Array.isArray(form.what_to_expect) ? form.what_to_expect : []).map(
          (x) => ({
            // adapt if backend expects {expect_title, expect_description}
            expect_title: x.expect_title ?? x.title ?? "",
            expect_description: x.expect_description ?? x.description ?? "",
          })
        ),
        days: (Array.isArray(form.days) ? form.days : []).map((d) => ({
          day: typeof d.day === "string" ? parseInt(d.day, 10) || 0 : d.day || 0,
          description: d.description ?? "",
          distance: d.distance ?? "",
          duration: d.duration ?? "",
          // backend usually expects array
          highlights: Array.isArray(d.highlights)
            ? d.highlights
            : d.highlights
            ? String(d.highlights)
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            : [],
        })),
        maxElevation: form.maxElevation?.toString?.() ?? "",
        distance: form.distance?.toString?.() ?? "",
        duration: form.duration?.toString?.() ?? "",
      };

      await updateTrip(id, payload);
      navigate("/itineraries");
    } catch (error) {
      console.error("Update failed:", error);
      const status = error?.response?.status;
      if (status === 401) {
        // Basic auth missing/invalid
        navigate("/login");
        return;
      }
      setErrors({ submit: "Failed to update itinerary" });
    } finally {
      setLoading(false);
    }
  };

  // ---------- UI ----------
  if (fetching) {
    return (
      <div className="create-itinerary">
        <div className="card">
          <p style={{ padding: 16 }}>Loading itinerary…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="create-itinerary">
      <div className="create-header">
        <h1 className="create-title">Edit Itinerary</h1>
        <button onClick={() => navigate("/itineraries")} className="btn btn-secondary">
          Cancel
        </button>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="create-form">
          {errors.submit && <div className="alert alert-error">{errors.submit}</div>}

          {/* Category */}
          <div className="form-group">
            <label className="form-label" htmlFor="category">
              Category
            </label>
            <select
              name="category"
              id="category"
              value={form.category}
              onChange={handleSelectChange}
              className={`form-input ${errors.category ? "error" : ""}`}
            >
              <option value="">Select a category</option>
              <option value="Adventure & Trekking">Adventure & Trekking</option>
              <option value="Cultural & Heritage Tours">Cultural & Heritage Tours</option>
              <option value="Leisure & Offbeat Escapes">Leisure & Offbeat Escapes</option>
              <option value="Spiritual & Wellness Retreats">Spiritual & Wellness Retreats</option>
            </select>
            {errors.category && <p className="form-error">{errors.category}</p>}
          </div>

          {/* Basic fields */}
          {[
            "title",
            "subTitle",
            "maxElevation",
            "duration",
            "distance",
            "difficulty",
            "startPoint",
            "endPoint",
          ].map((key) => (
            <div key={key} className="form-group">
              <label htmlFor={key} className="form-label">
                {key.replace(/_/g, " ")}
              </label>
              <input
                type="text"
                id={key}
                name={key}
                value={form[key]}
                onChange={handleChange}
                className={`form-input ${errors[key] ? "error" : ""}`}
              />
              {errors[key] && <p className="form-error">{errors[key]}</p>}
            </div>
          ))}

          {/* Destinations */}
          <div className="form-group">
            <label htmlFor="destinations" className="form-label">
              Destinations (comma-separated)
            </label>
            <input
              type="text"
              id="destinations"
              name="destinations"
              value={destinationsString}
              onChange={handleDestinationsChange}
              className="form-input"
            />
          </div>

          {/* Textareas */}
          {["travel_description", "highlights"].map((key) => (
            <div key={key} className="form-group">
              <label htmlFor={key} className="form-label">
                {key.replace(/_/g, " ")}
              </label>
              <textarea
                id={key}
                name={key}
                rows={3}
                value={form[key]}
                onChange={handleChange}
                className={`form-input ${errors[key] ? "error" : ""}`}
              />
              {errors[key] && <p className="form-error">{errors[key]}</p>}
            </div>
          ))}

          {/* Images */}
          <div className="form-group">
            <label className="form-label">Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              className="form-input"
              onChange={handleBase64ImageUpload}
            />
            {Array.isArray(form.images) && form.images.length > 0 && (
              <div
                style={{
                  marginTop: 16,
                  display: "grid",
                  gap: 12,
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                }}
              >
                {form.images.map((img, index) => {
                  if (!img || img.length < 100) return null;
                  const sizeKB = base64KB(img);
                  return (
                    <div
                      key={index}
                      style={{
                        padding: 8,
                        border: "1px solid #e5e7eb",
                        borderRadius: 6,
                      }}
                    >
                      <img
                        src={img}
                        alt={`img-${index}`}
                        style={{
                          width: "100%",
                          height: 160,
                          objectFit: "cover",
                          borderRadius: 6,
                          marginBottom: 8,
                        }}
                      />
                      <p style={{ margin: 0, fontSize: 13 }}>
                        <strong>Image {index + 1}</strong> — {sizeKB} KB
                      </p>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="btn btn-danger"
                        style={{ marginTop: 8 }}
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* What to Expect */}
          <div className="form-group">
            <label className="form-label">What to Expect</label>
            {Array.isArray(form.what_to_expect) &&
              form.what_to_expect.map((item, index) => (
                <div
                  key={index}
                  className="form-group"
                  style={{
                    border: "1px solid #e5e7eb",
                    padding: "12px",
                    marginBottom: "12px",
                    borderRadius: "6px",
                  }}
                >
                  <input
                    type="text"
                    placeholder="Title"
                    className="form-input"
                    value={item.expect_title ?? ""}
                    onChange={(e) =>
                      handleExpectChange(index, "expect_title", e.target.value)
                    }
                  />
                  <textarea
                    rows={2}
                    placeholder="Description"
                    className="form-input"
                    value={item.expect_description ?? ""}
                    onChange={(e) =>
                      handleExpectChange(
                        index,
                        "expect_description",
                        e.target.value
                      )
                    }
                  />
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => removeExpect(index)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

            <button type="button" className="btn btn-secondary" onClick={addExpect}>
              + Add More
            </button>
          </div>

          {/* Days */}
          <div className="form-group">
            <label className="form-label">Day-wise Plan</label>
            {Array.isArray(form.days) &&
              form.days.map((item, index) => (
                <div
                  key={index}
                  className="form-group"
                  style={{
                    border: "1px solid #e5e7eb",
                    padding: "12px",
                    marginBottom: "12px",
                    borderRadius: "6px",
                  }}
                >
                  <input
                    type="number"
                    placeholder="Day Number"
                    className="form-input"
                    value={item.day}
                    onChange={(e) => handleDayChange(index, "day", e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    className="form-input"
                    value={item.description}
                    onChange={(e) => handleDayChange(index, "description", e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Distance"
                    className="form-input"
                    value={item.distance}
                    onChange={(e) => handleDayChange(index, "distance", e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Duration"
                    className="form-input"
                    value={item.duration}
                    onChange={(e) => handleDayChange(index, "duration", e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Highlights (comma-separated)"
                    className="form-input"
                    value={item.highlights}
                    onChange={(e) => handleDayChange(index, "highlights", e.target.value)}
                  />
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => removeDay(index)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            <button type="button" className="btn btn-secondary" onClick={addDay}>
              + Add Day
            </button>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate("/itineraries")}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-success">
              {loading ? "Updating..." : "Update Itinerary"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItinerary;
