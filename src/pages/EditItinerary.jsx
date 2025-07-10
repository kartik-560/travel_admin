import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getItinerary, updateItinerary } from "../api/itineraries";

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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (errors.fetch) {
    return (
      <div className="card">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Itinerary</h3>
          <p className="text-gray-600 mb-4">{errors.fetch}</p>
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Edit Itinerary</h1>
        <button
          onClick={() => navigate("/itineraries")}
          className="btn btn-secondary"
        >
          Cancel
        </button>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {errors.submit}
            </div>
          )}

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              className={`form-input ${errors.title ? 'border-red-500' : ''}`}
              placeholder="Enter itinerary title"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              className={`form-input ${errors.description ? 'border-red-500' : ''}`}
              placeholder="Describe the itinerary in detail"
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                Duration *
              </label>
              <input
                type="text"
                id="duration"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                className={`form-input ${errors.duration ? 'border-red-500' : ''}`}
                placeholder="e.g., 7 days, 2 weeks"
              />
              {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration}</p>}
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price *
              </label>
              <input
                type="text"
                id="price"
                name="price"
                value={form.price}
                onChange={handleChange}
                className={`form-input ${errors.price ? 'border-red-500' : ''}`}
                placeholder="e.g., $1,500, €2,000"
              />
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="destinations" className="block text-sm font-medium text-gray-700 mb-2">
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
            <p className="mt-1 text-sm text-gray-500">Separate multiple destinations with commas</p>
          </div>

          <div>
            <label htmlFor="highlights" className="block text-sm font-medium text-gray-700 mb-2">
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
            <p className="mt-1 text-sm text-gray-500">Separate multiple highlights with commas</p>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
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