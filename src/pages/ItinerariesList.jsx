import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getItineraries, deleteItinerary } from "../api/itineraries";
import ItineraryCard from "../components/ItineraryCard";

const ItinerariesList = () => {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getItineraries();
      setItineraries(res.data || []);
    } catch (error) {
      console.error("Error fetching itineraries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteItinerary(id);
      await fetchData();
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting itinerary:", error);
    }
  };

  const filteredItineraries = itineraries.filter(itinerary =>
    itinerary.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    itinerary.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex-between mb-2">
        <h1>All Itineraries</h1>
        <Link to="/create" className="btn btn-primary">
          Create New
        </Link>
      </div>

      {/* Search */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search itineraries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Stats */}
      <div className="card mb-2">
        <div className="flex-between">
          <span>Showing {filteredItineraries.length} of {itineraries.length} itineraries</span>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="btn btn-secondary"
            >
              Clear search
            </button>
          )}
        </div>
      </div>

      {/* Itineraries Grid */}
      {filteredItineraries.length > 0 ? (
        <div className="grid grid-3">
          {filteredItineraries.map((itinerary) => (
            <ItineraryCard
              key={itinerary._id}
              itinerary={itinerary}
              onEdit={(id) => navigate(`/edit/${id}`)}
              onDelete={(id) => setDeleteConfirm(id)}
            />
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="empty-state">
            <h3>{searchTerm ? "No matching itineraries" : "No itineraries found"}</h3>
            <p>
              {searchTerm 
                ? "Try adjusting your search terms" 
                : "Get started by creating your first itinerary."
              }
            </p>
            {!searchTerm && (
              <Link to="/create" className="btn btn-primary mt-1">
                Create Itinerary
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Delete Itinerary</h3>
            <p>Are you sure you want to delete this itinerary? This action cannot be undone.</p>
            <div className="modal-actions">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="btn btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItinerariesList;