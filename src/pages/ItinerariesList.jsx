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

  const filteredItineraries = itineraries.filter(
    (itinerary) =>
      itinerary.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      itinerary.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">All Itineraries</h1>
        <Link to="/create" className="btn btn-primary">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItineraries.map((itinerary) => (
            <ItineraryCard
              key={itinerary.id}
              itinerary={itinerary}
              onEdit={(id) => navigate(`/itineraries/edit/${id}`)} // ✅ Correct
              onDelete={(id) => setDeleteConfirm(id)}
            />
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? "No matching itineraries" : "No itineraries found"}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Get started by creating your first itinerary."}
            </p>
            {!searchTerm && (
              <Link to="/create" className="btn btn-primary">
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
            <div className="flex space-x-3 justify-end">
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
