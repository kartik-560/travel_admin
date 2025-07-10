import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="sidebar">
      <h2>🧭 Travel Admin</h2>
      <nav>
        <ul>
          <li>
            <Link 
              to="/" 
              className={location.pathname === "/" ? "active" : ""}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link 
              to="/itineraries" 
              className={location.pathname === "/itineraries" ? "active" : ""}
            >
              Itineraries
            </Link>
          </li>
          <li>
            <Link 
              to="/create" 
              className={location.pathname === "/create" ? "active" : ""}
            >
              Create New
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;