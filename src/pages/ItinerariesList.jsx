/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getTrips, deleteTrip } from "../api/trips";

import ItineraryCard from "../components/ItineraryCard";
import "./styles/ItinerariesList.css";

const ItinerariesList = () => {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const navigate = useNavigate();

  const fetchItineraries = async () => {
    try {
      const response = await getTrips();
      setItineraries(response.data);
    } catch (error) {
      console.error("Failed to fetch itineraries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    // console.log("Navigating to edit:", id);
    navigate(`/itineraries/edit/${id}`);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this itinerary?"
    );
    if (!confirmed) return;

    try {
      await deleteTrip(id);
      fetchItineraries();
    } catch (error) {
      console.error("Failed to delete itinerary:", error);
    }
  };

  useEffect(() => {
    fetchItineraries();
  }, []);
  const filteredItineraries = itineraries.filter(
  (itinerary) =>
    itinerary.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    itinerary.travel_description?.toLowerCase().includes(searchTerm.toLowerCase())
);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="itineraries-list">
      {/* Header */}
      <div className="list-header">
        <h1 className="list-title">All Itineraries</h1>
        <Link to="/itineraries/create" className="btn btn-primary">
          Create New
        </Link>
      </div>

      {/* Search */}
      <div className="card">
        <input
          type="text"
          placeholder="Search itineraries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input"
        />
      </div>

      {/* Stats */}
      <div className="card">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">
            Showing {filteredItineraries.length} of {itineraries.length}{" "}
            itineraries
          </span>
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
        <>
          {["Adventure & Trekking", "Cultural & Heritage Tours", "Leisure & Offbeat Escapes", "Spiritual & Wellness Retreats"].map(
            (category) => {
              const categoryTrips = filteredItineraries.filter(
                (trip) => trip.category === category
              );
              if (categoryTrips.length === 0) return null;
              return (
                <div key={category} className="category-section">
                  <h2 className="category-title">{category}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                    {categoryTrips.map((trip) => (
                      <ItineraryCard
                        key={trip._id}
                        itinerary={trip}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                </div>
              );
            }
          )}
        </>
      ) : (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3 className="empty-title">
              {searchTerm ? "No matching itineraries" : "No itineraries found"}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Get started by creating your first itinerary."}
            </p>
            {!searchTerm && (
              <Link to="/itineraries/create" className="btn btn-primary">
                Create Itinerary
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Delete Itinerary
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this itinerary? This action cannot
              be undone.
            </p>
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
