import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTrip, updateTrip } from "../api/trips";
import imageCompression from "browser-image-compression";
import "./styles/EditItinerary.css";
const EditItinerary = () => {
  const { id } = useParams();
  // console.log("Fetched ID:", id);
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
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const { data } = await getTrip(id);

        const normalized = {
          // defaults for anything missing
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
          // overwrite with server values
          ...data,
        };

        // force arrays to be arrays
        normalized.images = Array.isArray(data?.images) ? data.images : [];
        normalized.what_to_expect = Array.isArray(data?.what_to_expect)
          ? data.what_to_expect
          : [];
        normalized.days = Array.isArray(data?.days) ? data.days : [];
        normalized.destinations = Array.isArray(data?.destinations)
          ? data.destinations
          : [];

        setForm(normalized);
      } catch (err) {
        console.error("Failed to fetch itinerary:", err);
      }
    };
    fetchTrip();
  }, [id]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const MAX_IMAGE_MB = 2;
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

      // Compress only if file size > 1MB
      if (file.size > 1 * 1024 * 1024) {
        alert("Image is larger than 1MB. Compressing...");

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
          alert("Cannot upload — total image size will exceed 6MB.");
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

  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleExpectChange = (index, field, value) => {
    setForm(prev => {
      const curr = Array.isArray(prev.what_to_expect) ? [...prev.what_to_expect] : [];
      const item = curr[index] ?? { expect_title: "", expect_description: "" };
      curr[index] = { ...item, [field]: value };
      return { ...prev, what_to_expect: curr };
    });
  };

  const addExpect = () => {
    setForm(prev => {
      const curr = Array.isArray(prev.what_to_expect) ? prev.what_to_expect : [];
      return {
        ...prev,
        what_to_expect: [...curr, { expect_title: "", expect_description: "" }],
      };
    });
  };

  const handleDayChange = (index, field, value) => {
    setForm(prev => {
      const curr = Array.isArray(prev.days) ? [...prev.days] : [];
      const item = curr[index] ?? { day: "", description: "", distance: "", duration: "", highlights: "" };
      curr[index] = { ...item, [field]: value };
      return { ...prev, days: curr };
    });
  };

  const addDay = () => {
    setForm(prev => {
      const curr = Array.isArray(prev.days) ? prev.days : [];
      return {
        ...prev,
        days: [
          ...curr,
          { day: "", description: "", distance: "", duration: "", highlights: "" },
        ],
      };
    });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setErrors({});

  try {
    // sanitize/coerce
    const payload = {
      ...form,
      // ensure arrays are arrays
      images: Array.isArray(form.images) ? form.images : [],
      what_to_expect: (Array.isArray(form.what_to_expect) ? form.what_to_expect : [])
        // if API expects {title, description}, map keys here:
        .map(x => ({
          title: x.title ?? x.expect_title ?? "",
          description: x.description ?? x.expect_description ?? "",
        })),
      days: (Array.isArray(form.days) ? form.days : []).map(d => ({
        day: typeof d.day === "string" ? parseInt(d.day, 10) || 0 : d.day || 0,
        description: d.description ?? "",
        distance: d.distance ?? "",
        duration: d.duration ?? "",
        // if API expects an array, split by comma; if it expects a string, keep as is
        highlights: Array.isArray(d.highlights)
          ? d.highlights
          : (d.highlights ? d.highlights.split(",").map(s => s.trim()).filter(Boolean) : []),
      })),
      // numeric coercions if needed:
      maxElevation: form.maxElevation?.toString?.() ?? "",
      distance: form.distance?.toString?.() ?? "",
      duration: form.duration?.toString?.() ?? "",
    };

    await updateTrip(id, payload);
    navigate("/itineraries");
  } catch (error) {
    console.error("Update failed", error);
    setErrors({ submit: "Failed to update itinerary" });
  } finally {
    setLoading(false);
  }
};


  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <div className="create-itinerary">
      <div className="create-header">
        <h1 className="create-title">Edit Itinerary</h1>
        <button
          onClick={() => navigate("/itineraries")}
          className="btn btn-secondary"
        >
          Cancel
        </button>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="create-form">
          {errors.submit && (
            <div className="alert alert-error">{errors.submit}</div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="category">
              Category
            </label>
            <select
              name="category"
              id="category"
              value={form.category}
              onChange={handleSelectChange}
              className="form-input"
            >
              <option value="Adventure & Trekking">Adventure & Trekking</option>
              <option value="Cultural & Heritage Tours">
                Cultural & Heritage Tours
              </option>
              <option value="Leisure & Offbeat Escapes">
                Leisure & Offbeat Escapes
              </option>
              <option value="Spiritual & Wellness Retreats">
                Spiritual & Wellness Retreats
              </option>
            </select>
          </div>
          {/* Text Fields */}
          {Object.keys(form)
            .filter((k) => !["what_to_expect", "days", "images"].includes(k))
            .map((key) => (
              <div key={key} className="form-group">
                <label htmlFor={key} className="form-label">
                  {key.replace(/_/g, " ")}
                </label>
                {key === "travel_description" || key === "highlights" ? (
                  <textarea
                    id={key}
                    name={key}
                    rows={3}
                    value={form[key]}
                    onChange={handleChange}
                    className={`form-input ${errors[key] ? "error" : ""}`}
                  />
                ) : (
                  <input
                    type="text"
                    id={key}
                    name={key}
                    value={form[key]}
                    onChange={handleChange}
                    className={`form-input ${errors[key] ? "error" : ""}`}
                  />
                )}
                {errors[key] && <p className="form-error">{errors[key]}</p>}
              </div>
            ))}

          {/* Image Upload */}
          <input
            type="file"
            accept="image/*"
            multiple
            className="form-input"
            onChange={handleBase64ImageUpload}
          />
          {form.images.length > 0 && (
            <div style={{ marginTop: 16 }}>
              {form.images.map((img, index) => {
                if (!img || img.length < 100) return null; // Skip broken images

                const sizeKB = Math.ceil((img.length * 3) / 4 / 1024);

                return (
                  <div
                    key={index}
                    style={{
                      marginBottom: 10,
                      padding: 8,
                      border: "1px solid #e5e7eb",
                      borderRadius: 4,
                      maxWidth: 300,
                    }}
                  >
                    <img
                      src={img}
                      alt={`img-${index}`}
                      style={{
                        width: "100%",
                        maxHeight: "180px",
                        objectFit: "cover",
                        borderRadius: 6,
                        marginBottom: 8,
                      }}
                    />
                    <p style={{ margin: 0, fontSize: 14 }}>
                      <strong>Image {index + 1}</strong> — {sizeKB} KB
                    </p>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="btn btn-danger"
                      style={{ marginTop: 6 }}
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>
          )}

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
                    value={item.expect_title}
                    onChange={(e) =>
                      handleExpectChange(index, "expect_title", e.target.value)
                    }
                  />
                  <textarea
                    rows={2}
                    placeholder="Description"
                    className="form-input"
                    value={item.expect_description}
                    onChange={(e) =>
                      handleExpectChange(
                        index,
                        "expect_description",
                        e.target.value
                      )
                    }
                  />
                </div>
              ))}

            <button
              type="button"
              className="btn btn-secondary"
              onClick={addExpect}
            >
              + Add More
            </button>
          </div>

          {/* Days Plan */}
          <div className="form-group">
            <label className="form-label">Day-wise Plan</label>
            {form.days.map((item, index) => (
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
                  onChange={(e) =>
                    handleDayChange(index, "day", parseInt(e.target.value))
                  }
                />
                <input
                  type="text"
                  placeholder="Description"
                  className="form-input"
                  value={item.description}
                  onChange={(e) =>
                    handleDayChange(index, "description", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Distance"
                  className="form-input"
                  value={item.distance}
                  onChange={(e) =>
                    handleDayChange(index, "distance", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Duration"
                  className="form-input"
                  value={item.duration}
                  onChange={(e) =>
                    handleDayChange(index, "duration", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Highlights (comma-separated)"
                  className="form-input"
                  value={item.highlights}
                  onChange={(e) =>
                    handleDayChange(index, "highlights", e.target.value)
                  }
                />
              </div>
            ))}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={addDay}
            >
              + Add Day
            </button>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate("/itineraries")}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-success"
            >
              {loading ? "Updating..." : "Update Itinerary"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItinerary;
