import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Map,
  PlusCircle,
  ImagePlus,
  Images,
  X,
  Compass,
  ExternalLink,
  Eye,
  Tag,
  MessageSquareQuote,
} from "lucide-react";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/impressions", label: "User Impressions", icon: Eye },
    { path: "/itineraries", label: "Itineraries", icon: Map },
    { path: "/categories", label: "Categories", icon: Tag },
    { path: "/testimonials", label: "Testimonials", icon: MessageSquareQuote },
    { path: "/itineraries/create", label: "Create Itinerary", icon: PlusCircle },
    { path: "/image/upload", label: "Upload Photos", icon: ImagePlus },
    { path: "/adminPhotos", label: "Photo Manager", icon: Images },
  ];

  const NavContent = () => (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 border-r border-slate-800">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-800">
        <Link to="/" className="flex items-center gap-3 group" onClick={onClose}>
          <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-md shadow-black/30 group-hover:ring-2 group-hover:ring-orange-400/50 transition-all overflow-hidden shrink-0">
            <img
              src="/logo.webp"
              alt="Better Backpacking India"
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/logo.png";
              }}
            />
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-white group-hover:text-orange-400 transition-colors leading-tight">
              Better Backpacking
            </div>
            <div className="text-[10px] font-semibold tracking-wider text-orange-400 uppercase">
              Admin Portal
            </div>
          </div>
        </Link>
        <button
          onClick={onClose}
          className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close sidebar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2.5 py-4 space-y-1 overflow-y-auto">
        <div className="px-2.5 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                isActive
                  ? "bg-orange-500 text-white shadow-md shadow-orange-500/20 font-semibold"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
              <span>{item.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom status & actions */}
      <div className="p-3 border-t border-slate-800 space-y-2">
        <a
          href="https://www.betterbackpackingindia.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-1.5 rounded-lg text-[11px] font-medium text-slate-400 hover:text-white hover:bg-slate-800/70 transition-colors border border-slate-800"
        >
          <span className="flex items-center gap-1.5">
            <ExternalLink className="w-3 h-3" />
            View Live Site
          </span>
          <span className="text-[9px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-mono">Live</span>
        </a>
        <div className="flex items-center justify-between px-1.5 pt-0.5">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500" />
            <span className="text-[11px] text-slate-400">Connected</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">v1.2</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-60 z-30">
        <NavContent />
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />
          <div className="relative w-64 max-w-[80vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-150">
            <NavContent />
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
