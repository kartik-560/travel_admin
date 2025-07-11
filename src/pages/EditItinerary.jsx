import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getItinerary, updateItinerary } from "../api/itineraries";
import './EditItinerary.css';

const EditItinerary = () => {
  const { id } = useParams();
  const [form, setForm] = useState({
    title: "",
    description: "",
    duration: "",
    price: "",
    destinations: "",
    highlights: ""
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const res = await getItinerary(id);
        const data = res.data;
        setForm({
          title: data.title || "",
          description: data.description || "",
          duration: data.duration || "",
          price: data.price || "",
          destinations: Array.isArray(data.destinations) ? data.destinations.join(", ") : (data.destinations || ""),
          highlights: Array.isArray(data.highlights) ? data.highlights.join(", ") : (data.highlights || "")
        });
      } catch (error) {
        console.error("Error fetching itinerary:", error);
        setErrors({ fetch: "Failed to load itinerary data." });
      } finally {
        setFetchLoading(false);
      }
    };

    fetchItinerary();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (!form.duration.trim()) newErrors.duration = "Duration is required";
    if (!form.price.trim()) newErrors.price = "Price is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await updateItinerary(id, {
        ...form,
        destinations: form.destinations.split(',').map(d => d.trim()).filter(d => d),
        highlights: form.highlights.split(',').map(h => h.trim()).filter(h => h)
      });
      navigate("/itineraries");
    } catch (error) {
      console.error("Error updating itinerary:", error);
      setErrors({ submit: "Failed to update itinerary. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (errors.fetch) {
    return (
      <div className="card">
        <div className="empty-state">
          <div className="empty-icon">❌</div>
          <h3 className="empty-title">Error Loading Itinerary</h3>
          <p className="empty-description">{errors.fetch}</p>
          <button
            onClick={() => navigate("/itineraries")}
            className="btn btn-primary"
          >
            Back to Itineraries
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-itinerary">
      <div className="edit-header">
        <h1 className="edit-title">Edit Itinerary</h1>
        <button
          onClick={() => navigate("/itineraries")}
          className="btn btn-secondary"
        >
          Cancel
        </button>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="edit-form">
          {errors.submit && (
            <div className="alert alert-error">
              {errors.submit}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              className={`form-input ${errors.title ? 'error' : ''}`}
              placeholder="Enter itinerary title"
            />
            {errors.title && <p className="form-error">{errors.title}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              className={`form-input ${errors.description ? 'error' : ''}`}
              placeholder="Describe the itinerary in detail"
            />
            {errors.description && <p className="form-error">{errors.description}</p>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="duration" className="form-label">
                Duration *
              </label>
              <input
                type="text"
                id="duration"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                className={`form-input ${errors.duration ? 'error' : ''}`}
                placeholder="e.g., 7 days, 2 weeks"
              />
              {errors.duration && <p className="form-error">{errors.duration}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="price" className="form-label">
                Price *
              </label>
              <input
                type="text"
                id="price"
                name="price"
                value={form.price}
                onChange={handleChange}
                className={`form-input ${errors.price ? 'error' : ''}`}
                placeholder="e.g., $1,500, €2,000"
              />
              {errors.price && <p className="form-error">{errors.price}</p>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="destinations" className="form-label">
              Destinations
            </label>
            <input
              type="text"
              id="destinations"
              name="destinations"
              value={form.destinations}
              onChange={handleChange}
              className="form-input"
              placeholder="Paris, Rome, Barcelona (comma-separated)"
            />
            <p className="form-help">Separate multiple destinations with commas</p>
          </div>

          <div className="form-group">
            <label htmlFor="highlights" className="form-label">
              Highlights
            </label>
            <textarea
              id="highlights"
              name="highlights"
              rows={3}
              value={form.highlights}
              onChange={handleChange}
              className="form-input"
              placeholder="Eiffel Tower visit, Colosseum tour, Beach relaxation (comma-separated)"
            />
            <p className="form-help">Separate multiple highlights with commas</p>
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