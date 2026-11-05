import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Menu, LogOut, Plus, UserCheck } from "lucide-react";
import { clearBasicToken } from "../api/client";

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const adminName = sessionStorage.getItem("adminName") || "Admin User";

  const handleLogout = () => {
    clearBasicToken();
    sessionStorage.removeItem("adminName");
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/") return "Overview & Analytics";
    if (path.startsWith("/itineraries/create")) return "Create New Itinerary";
    if (path.startsWith("/itineraries/edit")) return "Edit Itinerary";
    if (path.startsWith("/itineraries")) return "Itineraries Management";
    if (path.startsWith("/image/upload")) return "Upload Gallery Photos";
    if (path.startsWith("/adminPhotos")) return "Photo Galleries";
    if (path.startsWith("/photo/edit")) return "Edit Photo Gallery";
    return "Admin Dashboard";
  };

  return (
    <header className="sticky top-0 z-20 w-full bg-white/85 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="flex items-center justify-between h-13 px-3.5 sm:px-5">
        {/* Left: Mobile trigger & Page title */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
            aria-label="Open menu"
          >
            <Menu className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-tight">
              {getPageTitle()}
            </h1>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              Better Backpacking CMS
            </p>
          </div>
        </div>

        {/* Right: Actions, Admin Profile & Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          {location.pathname !== "/itineraries/create" && (
            <Link
              to="/itineraries/create"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-orange-500 hover:bg-orange-600 text-white shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Itinerary</span>
            </Link>
          )}

          {/* User profile */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center font-bold text-[11px] shadow-sm">
              {adminName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-semibold text-slate-800 leading-tight">
                {adminName}
              </div>
              <div className="text-[9px] font-medium text-emerald-600 flex items-center gap-0.5">
                <UserCheck className="w-2.5 h-2.5" />
                Admin
              </div>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            title="Log out"
            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
