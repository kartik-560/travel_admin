import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./styles/Navbar.css";

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token"); // clear auth
    navigate("/login", { replace: true });
  };

  const isLoginPage = location.pathname === "/login";

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
          {!isLoginPage && (
            <button className="navbar-logout" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
