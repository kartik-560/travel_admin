import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getItineraries } from "../api/itineraries";
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalItineraries: 0,
    recentItineraries: []
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
          recentItineraries: itineraries.slice(0, 3)
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats({
          totalItineraries: 0,
          recentItineraries: []
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
          <div className="stat-content">
            <p className="stat-label">Total Itineraries</p>
            <p className="stat-value">{stats.totalItineraries}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <span>📈</span>
          </div>
          <div className="stat-content">
            <p className="stat-label">Active Tours</p>
            <p className="stat-value">{Math.floor(stats.totalItineraries * 0.8)}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <span>💰</span>
          </div>
          <div className="stat-content">
            <p className="stat-label">Revenue</p>
            <p className="stat-value">$24,750</p>
          </div>
        </div>
      </div>

      {/* Recent Itineraries */}
      <div className="card">
        <div className="recent-header">
          <h2 className="recent-title">Recent Itineraries</h2>
          <Link to="/itineraries" className="btn btn-secondary">
            View All
          </Link>
        </div>
        
        {stats.recentItineraries.length > 0 ? (
          <div className="recent-list">
            {stats.recentItineraries.map((itinerary) => (
              <div key={itinerary._id} className="recent-item">
                <h3 className="recent-item-title">{itinerary.title}</h3>
                <p className="recent-item-description">{itinerary.description?.substring(0, 100)}...</p>
                <div className="recent-item-footer">
                  <div className="recent-item-meta">
                    <span>Duration: {itinerary.duration}</span>
                    <span>Price: {itinerary.price}</span>
                  </div>
                  <Link to={`/edit/${itinerary._id}`} className="btn btn-primary">
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3 className="empty-title">No itineraries</h3>
            <p className="empty-description">Get started by creating a new itinerary.</p>
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