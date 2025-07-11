import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createItinerary } from "../api/itineraries";
import './CreateItinerary.css';

const CreateItinerary = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    duration: "",
    price: "",
    destinations: "",
    highlights: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

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
      await createItinerary({
        ...form,
        destinations: form.destinations.split(',').map(d => d.trim()).filter(d => d),
        highlights: form.highlights.split(',').map(h => h.trim()).filter(h => h)
      });
      navigate("/itineraries");
    } catch (error) {
      console.error("Error creating itinerary:", error);
      setErrors({ submit: "Failed to create itinerary. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-itinerary">
      <div className="create-header">
        <h1 className="create-title">Create New Itinerary</h1>
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
              {loading ? "Creating..." : "Create Itinerary"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateItinerary;