import React from "react";
import "./styles/Navbar.css";

const Navbar = ({ toggleSidebar }) => {
  return (
    <header className="navbar">
      <div className="navbar-content">
        <button className="mobile-menu-button" onClick={toggleSidebar}>
          ☰
        </button>
        <h1 className="navbar-title">Travel Admin Panel</h1>
        <div className="navbar-user">
          <div className="navbar-welcome">Welcome back, Admin</div>
          <div className="navbar-avatar">
            <span>A</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
