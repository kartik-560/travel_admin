import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: "dashboard" },
    { path: "/itineraries", label: "Itineraries", icon: "list" },
    { path: "/create", label: "Create New", icon: "plus" }
  ];

  const getIcon = (iconName) => {
    const icons = {
      dashboard: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
        </svg>
      ),
      list: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      plus: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      )
    };
    return icons[iconName];
  };

  return (
    <div className="w-64 bg-gray-800 text-white h-full flex flex-col shadow-lg">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-2xl font-bold flex items-center">
          <span className="text-2xl mr-2">🧭</span>
          Travel Admin
        </h2>
        <p className="text-gray-400 text-sm mt-1">Manage your itineraries</p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <span className="mr-3">{getIcon(item.icon)}</span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-700">
        <div className="text-xs text-gray-400">
          <p>Version 1.0.0</p>
          <p className="mt-1">© 2025 Travel Admin</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;