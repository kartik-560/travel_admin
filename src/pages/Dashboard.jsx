import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getItineraries } from "../api/itineraries";

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
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex-between mb-2">
        <h1>Dashboard</h1>
        <Link to="/create" className="btn btn-primary">
          Create New Itinerary
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">📋</div>
          <div className="stat-info">
            <h3>{stats.totalItineraries}</h3>
            <p>Total Itineraries</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">📈</div>
          <div className="stat-info">
            <h3>{Math.floor(stats.totalItineraries * 0.8)}</h3>
            <p>Active Tours</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">💰</div>
          <div className="stat-info">
            <h3>$24,750</h3>
            <p>Revenue</p>
          </div>
        </div>
      </div>

      {/* Recent Itineraries */}
      <div className="card">
        <div className="flex-between mb-2">
          <h2>Recent Itineraries</h2>
          <Link to="/itineraries" className="btn btn-secondary">
            View All
          </Link>
        </div>
        
        {stats.recentItineraries.length > 0 ? (
          <div>
            {stats.recentItineraries.map((itinerary) => (
              <div key={itinerary._id} className="itinerary-card mb-1">
                <h3>{itinerary.title}</h3>
                <p>{itinerary.description?.substring(0, 100)}...</p>
                <div className="itinerary-meta">
                  <span>Duration: {itinerary.duration}</span>
                  <span>Price: {itinerary.price}</span>
                </div>
                <Link to={`/edit/${itinerary._id}`} className="btn btn-primary">
                  Edit
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No itineraries</h3>
            <p>Get started by creating a new itinerary.</p>
            <Link to="/create" className="btn btn-primary mt-1">
              Create Itinerary
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;