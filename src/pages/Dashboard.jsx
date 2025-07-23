import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTrips } from "../api/trips";
import { deleteTrip } from "../api/trips";

import "./styles/Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalItineraries: 0,
    recentItineraries: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await getTrips();
        const itineraries = res.data || [];

        // Group by category
        const grouped = {};
        itineraries.forEach((item) => {
          const cat = item.category || "Uncategorized";
          if (!grouped[cat]) grouped[cat] = [];
          grouped[cat].push(item);
        });

        setStats({
          totalItineraries: itineraries.length,
          groupedItineraries: grouped,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        setStats({ totalItineraries: 0, groupedItineraries: {} });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this itinerary?"
    );
    if (!confirmed) return;

    try {
      await deleteTrip(id);
      // Refresh list after delete
      const res = await getTrips();
      const itineraries = res.data || [];

      // Re-group after delete
      const grouped = {};
      itineraries.forEach((item) => {
        const cat = item.category || "Uncategorized";
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(item);
      });

      setStats({
        totalItineraries: itineraries.length,
        groupedItineraries: grouped,
      });
    } catch (error) {
      console.error("Failed to delete itinerary:", error);
    }
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <Link to="/itineraries/create" className="btn btn-primary">
          Create New Itinerary
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <span>📋</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">
              Total Itineraries
            </p>
            <p className="text-3xl font-bold text-gray-900">
              {stats.totalItineraries}
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <span>📈</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Active Tours</p>
            <p className="text-3xl font-bold text-gray-900">
              {Math.floor(stats.totalItineraries * 0.8)}
            </p>
          </div>
        </div>

       
      </div>

      {/* Recent Itineraries */}
     {Object.keys(stats.groupedItineraries || {}).map((category) => (
  <div className="card" key={category}>
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-bold text-gray-900">
        {category} Itineraries
      </h2>
      <Link to="/itineraries" className="btn btn-secondary">
        View All
      </Link>
    </div>

    <div className="recent-list">
      {stats.groupedItineraries[category].slice(0, 3).map((itinerary) => (
        <div
          key={itinerary._id || itinerary.id} // ✅ unique key here
          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {itinerary.title}
          </h3>
          <p className="text-gray-600 mb-3">
            {itinerary.subTitle?.substring(0, 100)}...
          </p>
          <div className="flex items-center justify-between">
            <div className="flex space-x-4 text-sm text-gray-500">
              <span>Duration: {itinerary.duration}</span>
              <span>Price: {itinerary.price || "N/A"}</span>
            </div>
            <div className="flex gap-2">
              <Link
                to={`/itineraries/edit/${itinerary._id}`}
                className="btn btn-primary"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(itinerary._id)}
                className="btn btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
))}

    </div>
  );
};

export default Dashboard;
