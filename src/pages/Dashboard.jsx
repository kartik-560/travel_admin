import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getItineraries } from "../api/itineraries";
import './Dashboard.css';

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
        const res = await getItineraries();
        const itineraries = res.data || [];
        setStats({
          totalItineraries: itineraries.length,
          recentItineraries: itineraries.slice(0, 3),
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        setStats({
          totalItineraries: 0,
          recentItineraries: [],
        });
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

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <Link to="/create" className="btn btn-primary">
          Create New Itinerary
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <span>📋</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Total Itineraries</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalItineraries}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <span>📈</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Active Tours</p>
            <p className="text-3xl font-bold text-gray-900">{Math.floor(stats.totalItineraries * 0.8)}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
          <div className="stat-content">
            <p className="stat-label">Revenue</p>
            <p className="stat-value">$24,750</p>
          </div>
        </div> */}
      </div>

      {/* Recent Itineraries */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Itineraries</h2>
          <Link to="/itineraries" className="btn btn-secondary">
            View All
          </Link>
        </div>

        {stats.recentItineraries.length > 0 ? (
          <div className="recent-list">
            {stats.recentItineraries.map((itinerary) => (
              <div key={itinerary._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{itinerary.title}</h3>
                <p className="text-gray-600 mb-3">{itinerary.description?.substring(0, 100)}...</p>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-4 text-sm text-gray-500">
                    <span>Duration: {itinerary.duration}</span>
                    <span>Price: {itinerary.price}</span>
                  </div>
                  {itinerary.id && (
                    <Link
                      to={`/itineraries/edit/${itinerary.id}`}
                      className="btn btn-primary"
                    >
                      Edit
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No itineraries</h3>
            <p className="text-gray-600 mb-4">Get started by creating a new itinerary.</p>
            <Link to="/create" className="btn btn-primary">
              Create Itinerary
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
