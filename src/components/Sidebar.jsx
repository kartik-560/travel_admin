import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./styles/Sidebar.css";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: "📊" },
    { path: "/itineraries", label: "Itineraries", icon: "🗺️" },
    { path: "/itineraries/create", label: "Create New", icon: "➕" },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      {/* Mobile Sidebar */}
      <div className={`sidebar-mobile ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">🧭 Travel Admin</h2>
        </div>
        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`sidebar-link ${location.pathname === item.path ? "active" : ""}`}
                  onClick={onClose} // Close sidebar on click
                >
                  <span className="sidebar-icon">{item.icon}</span>
                  <span className="sidebar-label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Desktop Sidebar */}
      <div className="sidebar desktop-only">
        <div className="sidebar-header">
          <h2 className="sidebar-title">🧭 Travel Admin</h2>
        </div>
        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`sidebar-link ${location.pathname === item.path ? "active" : ""}`}
                >
                  <span className="sidebar-icon">{item.icon}</span>
                  <span className="sidebar-label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
