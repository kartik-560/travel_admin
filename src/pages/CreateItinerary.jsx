import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createItinerary } from "../api/itineraries";

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
    <div>
      <div className="flex-between mb-2">
        <h1>Create New Itinerary</h1>
        <button
          onClick={() => navigate("/itineraries")}
          className="btn btn-secondary"
        >
          Cancel
        </button>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          {errors.submit && (
            <div style={{
              backgroundColor: '#fee',
              border: '1px solid #fcc',
              color: '#c33',
              padding: '10px',
              borderRadius: '5px',
              marginBottom: '20px'
            }}>
              {errors.submit}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter itinerary title"
              style={errors.title ? {borderColor: '#e74c3c'} : {}}
            />
            {errors.title && <small style={{color: '#e74c3c'}}>{errors.title}</small>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              className="form-control"
              placeholder="Describe the itinerary in detail"
              style={errors.description ? {borderColor: '#e74c3c'} : {}}
            />
            {errors.description && <small style={{color: '#e74c3c'}}>{errors.description}</small>}
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label htmlFor="duration">Duration *</label>
              <input
                type="text"
                id="duration"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g., 7 days, 2 weeks"
                style={errors.duration ? {borderColor: '#e74c3c'} : {}}
              />
              {errors.duration && <small style={{color: '#e74c3c'}}>{errors.duration}</small>}
            </div>

            <div className="form-group">
              <label htmlFor="price">Price *</label>
              <input
                type="text"
                id="price"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g., $1,500, €2,000"
                style={errors.price ? {borderColor: '#e74c3c'} : {}}
              />
              {errors.price && <small style={{color: '#e74c3c'}}>{errors.price}</small>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="destinations">Destinations</label>
            <input
              type="text"
              id="destinations"
              name="destinations"
              value={form.destinations}
              onChange={handleChange}
              className="form-control"
              placeholder="Paris, Rome, Barcelona (comma-separated)"
            />
            <small style={{color: '#7f8c8d'}}>Separate multiple destinations with commas</small>
          </div>

          <div className="form-group">
            <label htmlFor="highlights">Highlights</label>
            <textarea
              id="highlights"
              name="highlights"
              rows={3}
              value={form.highlights}
              onChange={handleChange}
              className="form-control"
              placeholder="Eiffel Tower visit, Colosseum tour, Beach relaxation (comma-separated)"
            />
            <small style={{color: '#7f8c8d'}}>Separate multiple highlights with commas</small>
          </div>

          <div className="flex" style={{justifyContent: 'flex-end', gap: '10px', paddingTop: '20px', borderTop: '1px solid #eee'}}>
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