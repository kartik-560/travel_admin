import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getTrips, deleteTrip, updateTripStatus, getCategories } from "../api/trips";
import ItineraryCard from "../components/ItineraryCard";
import { Search, Plus, X, Trash2, Filter, Eye, EyeOff } from "lucide-react";

const ItinerariesList = () => {
  const [itineraries, setItineraries] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState("ALL"); // "ALL", "PUBLISHED", "HIDDEN"
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const fetchItineraries = async () => {
    try {
      setLoading(true);
      const [tripsRes, catRes] = await Promise.allSettled([
        getTrips({ all: true }),
        getCategories(),
      ]);

      if (tripsRes.status === "fulfilled") {
        setItineraries(Array.isArray(tripsRes.value.data) ? tripsRes.value.data : []);
      }
      if (catRes.status === "fulfilled") {
        const names = (catRes.value.data || []).map((c) => c.name);
        setCategories(["All", ...names]);
      }
    } catch (error) {
      console.error("Failed to fetch itineraries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItineraries();
  }, []);

  const handleEdit = (id) => navigate(`/itineraries/edit/${id}`);

  const handleToggleStatus = async (id, newStatus) => {
    try {
      await updateTripStatus(id, newStatus);
      setItineraries((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
      );
    } catch (err) {
      console.error("Failed to toggle status:", err);
      alert("Failed to update visibility status.");
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeleting(true);
      await deleteTrip(id);
      setDeleteConfirm(null);
      await fetchItineraries();
    } catch (error) {
      console.error("Failed to delete itinerary:", error);
      alert("Failed to delete itinerary.");
    } finally {
      setDeleting(false);
    }
  };

  const filteredItineraries = itineraries.filter((itinerary) => {
    const t = String(itinerary.title || "").toLowerCase();
    const d = String(itinerary.travel_description || "").toLowerCase();
    const c = String(itinerary.category || "");
    const q = searchTerm.toLowerCase();

    const matchesSearch = t.includes(q) || d.includes(q);
    const matchesCategory = selectedCategory === "All" || c === selectedCategory;

    const isHidden = itinerary.status === "HIDDEN";
    const matchesStatus =
      statusFilter === "ALL"
        ? true
        : statusFilter === "HIDDEN"
        ? isHidden
        : !isHidden;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const tripKey = (trip, index) =>
    trip.id ??
    trip._id ??
    `${trip.title || "trip"}|${index}`;

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-slate-200 rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-slate-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
            All Itineraries
          </h2>
          <p className="text-[11px] text-slate-400">
            Manage, filter, and modify travel experiences across India.
          </p>
        </div>
        <Link
          to="/itineraries/create"
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Itinerary</span>
        </Link>
      </div>

      {/* Filter and Search Card */}
      <div className="bg-white rounded-xl p-3 sm:p-3.5 border border-slate-200/80 shadow-sm space-y-2.5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by title, location, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-8 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="text-[11px] text-slate-500 px-1 flex items-center justify-between md:justify-end gap-2">
            <span>Showing <strong className="text-slate-800">{filteredItineraries.length}</strong> of {itineraries.length}</span>
          </div>
        </div>

        {/* Category & Status Filter Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-xs flex-1">
            <Filter className="w-3 h-3 text-slate-400 shrink-0 mr-0.5" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-md whitespace-nowrap text-[11px] font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-slate-900 text-white font-semibold shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Visibility Status Filter */}
          <div className="flex items-center gap-1 shrink-0 bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`px-2 py-0.5 rounded-md transition-all ${
                statusFilter === "ALL"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              All Status
            </button>
            <button
              onClick={() => setStatusFilter("PUBLISHED")}
              className={`px-2 py-0.5 rounded-md flex items-center gap-1 transition-all ${
                statusFilter === "PUBLISHED"
                  ? "bg-white text-emerald-700 shadow-xs"
                  : "text-slate-500 hover:text-emerald-700"
              }`}
            >
              <Eye className="w-2.5 h-2.5 text-emerald-600" />
              Live
            </button>
            <button
              onClick={() => setStatusFilter("HIDDEN")}
              className={`px-2 py-0.5 rounded-md flex items-center gap-1 transition-all ${
                statusFilter === "HIDDEN"
                  ? "bg-white text-amber-700 shadow-xs"
                  : "text-slate-500 hover:text-amber-700"
              }`}
            >
              <EyeOff className="w-2.5 h-2.5 text-amber-600" />
              Hidden
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Cards */}
      {filteredItineraries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {filteredItineraries.map((trip, index) => (
            <ItineraryCard
              key={tripKey(trip, index)}
              itinerary={trip}
              onEdit={handleEdit}
              onDelete={(id) => setDeleteConfirm(id)}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            {searchTerm || selectedCategory !== "All"
              ? "No matching itineraries"
              : "No itineraries created yet"}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchTerm || selectedCategory !== "All"
              ? "Try resetting your search query or switching to another category."
              : "Get started by adding your first itinerary to showcase online."}
          </p>
          {(searchTerm || selectedCategory !== "All") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-5 sm:p-6 max-w-sm w-full shadow-xl border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="text-center space-y-1">
              <h4 className="text-sm font-bold text-slate-900">Delete Itinerary?</h4>
              <p className="text-xs text-slate-500">
                Are you sure you want to permanently remove this itinerary?
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
                className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleting}
                className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItinerariesList;
