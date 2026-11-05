import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTrips, deleteTrip } from "../api/trips";
import { getAnalyticsStats } from "../api/analytics";
import {
  Map,
  Compass,
  Layers,
  Plus,
  ArrowRight,
  Edit3,
  Trash2,
  Clock,
  MapPin,
  TrendingUp,
  Image,
  Eye,
  EyeOff,
  Users,
} from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalItineraries: 0,
    groupedItineraries: {},
    categoriesCount: 0,
    totalImpressions: 0,
    uniqueVisitors: 0,
    todayImpressions: 0,
    todayUniqueVisitors: 0,
  });
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [tripsRes, analyticsRes] = await Promise.allSettled([
        getTrips(),
        getAnalyticsStats(),
      ]);

      const itineraries = tripsRes.status === "fulfilled" ? tripsRes.value.data || [] : [];
      const analytics = analyticsRes.status === "fulfilled" ? analyticsRes.value.data || {} : {};

      const grouped = {};
      itineraries.forEach((item) => {
        const cat = item.category || "Uncategorized";
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(item);
      });

      const summary = analytics.summary || {};

      setStats({
        totalItineraries: itineraries.length,
        groupedItineraries: grouped,
        categoriesCount: Object.keys(grouped).length,
        totalImpressions: summary.totalImpressions || 0,
        uniqueVisitors: summary.uniqueVisitors || 0,
        todayImpressions: summary.todayImpressions || 0,
        todayUniqueVisitors: summary.todayUniqueVisitors || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleDelete = async (id) => {
    try {
      setDeleting(true);
      await deleteTrip(id);
      setDeleteId(null);
      await fetchStats();
    } catch (error) {
      console.error("Failed to delete itinerary:", error);
      alert("Failed to delete itinerary.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-28 rounded-2xl bg-slate-200 animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-slate-200 animate-pulse" />
          ))}
        </div>
        <div className="h-56 rounded-2xl bg-slate-200 animate-pulse" />
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Itineraries",
      value: stats.totalItineraries,
      icon: Map,
      bgLight: "bg-orange-50 text-orange-600",
      change: "Active adventure tours",
      link: "/itineraries",
    },
    {
      title: "Tour Categories",
      value: stats.categoriesCount,
      icon: Layers,
      bgLight: "bg-amber-50 text-amber-600",
      change: "Manage collections",
      link: "/categories",
    },
    {
      title: "User Impressions",
      value: stats.totalImpressions.toLocaleString(),
      icon: Eye,
      bgLight: "bg-blue-50 text-blue-600",
      change: `${stats.uniqueVisitors.toLocaleString()} unique visitors`,
      link: "/impressions",
    },
    {
      title: "Today's Visits",
      value: stats.todayImpressions.toLocaleString(),
      icon: TrendingUp,
      bgLight: "bg-emerald-50 text-emerald-600",
      change: `${stats.todayUniqueVisitors} unique users today`,
      link: "/impressions",
    },
  ];

  return (
    <div className="space-y-5">
      {/* Compact Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-4 sm:p-5 shadow-lg border border-slate-800">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-60 h-60 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-orange-500/15 border border-orange-500/20 text-orange-400 text-[10px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping" />
              Better Backpacking India
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Manage Your Expeditions & Telemetry
            </h2>
            <p className="text-xs text-slate-300 max-w-xl">
              Create, curate, and update itineraries, trekking packages, and track live user impressions across your website.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/impressions"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/20 text-orange-300 hover:bg-orange-500/30 border border-orange-500/30 text-xs font-semibold transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>User Impressions</span>
            </Link>
            <Link
              to="/itineraries/create"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Itinerary</span>
            </Link>
            <Link
              to="/image/upload"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <Image className="w-3.5 h-3.5" />
              <span>Upload Photos</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Compact KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          const CardContent = (
            <div
              className={`bg-white rounded-xl p-3.5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col justify-between ${
                stat.link ? "hover:border-orange-300 cursor-pointer" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  {stat.title}
                </span>
                <div className={`p-1.5 rounded-lg ${stat.bgLight}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-1.5">
                <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-[10px] text-slate-400 flex items-center justify-between">
                  <span>{stat.change}</span>
                  {stat.link && <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-orange-500" />}
                </div>
              </div>
            </div>
          );

          return stat.link ? (
            <Link key={i} to={stat.link} className="block group">
              {CardContent}
            </Link>
          ) : (
            <div key={i}>{CardContent}</div>
          );
        })}
      </div>

      {/* Categorized Sections */}
      {Object.keys(stats.groupedItineraries || {}).length === 0 ? (
        <div className="bg-white rounded-2xl p-8 border border-slate-200/80 text-center space-y-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">No Itineraries Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Get started by adding your first adventure package to display on the live website.
          </p>
          <Link
            to="/itineraries/create"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500 text-white text-xs font-semibold hover:bg-orange-600 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Itinerary
          </Link>
        </div>
      ) : (
        Object.entries(stats.groupedItineraries).map(([category, items]) => (
          <div key={category} className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                  {category}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {items.length} {items.length === 1 ? "tour" : "tours"} in this collection
                </p>
              </div>
              <Link
                to="/itineraries"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-orange-600 hover:text-orange-700 transition-colors"
              >
                <span>View all</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {items.slice(0, 3).map((itinerary) => {
                const coverImage = itinerary.images?.[0];
                return (
                  <div
                    key={itinerary.id || itinerary._id}
                    className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all duration-150 flex flex-col group"
                  >
                    {/* Cover preview */}
                    <div className="relative h-36 w-full bg-slate-100 overflow-hidden">
                      {coverImage ? (
                        <img
                          src={coverImage}
                          alt={itinerary.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100">
                          <Map className="w-6 h-6 opacity-40" />
                        </div>
                      )}
                      <div className="absolute top-2 left-2 flex items-center gap-1">
                        {itinerary.status === "HIDDEN" ? (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/95 backdrop-blur-md text-white text-[9px] font-bold flex items-center gap-1 shadow-xs">
                            <EyeOff className="w-2.5 h-2.5" />
                            Hidden
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/95 backdrop-blur-md text-white text-[9px] font-bold flex items-center gap-1 shadow-xs">
                            <Eye className="w-2.5 h-2.5" />
                            Live
                          </span>
                        )}
                      </div>
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-slate-950/70 backdrop-blur-md text-white text-[10px] font-semibold flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5 text-amber-400" />
                        <span>{itinerary.duration || "N/A"}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-orange-600 transition-colors">
                          {itinerary.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {itinerary.subTitle || itinerary.travel_description || "No description."}
                        </p>
                      </div>

                      {/* Route meta */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <div className="flex items-center gap-1 truncate max-w-[65%]">
                          <MapPin className="w-3 h-3 text-orange-500 shrink-0" />
                          <span className="truncate">
                            {itinerary.startPoint && itinerary.endPoint
                              ? `${itinerary.startPoint} → ${itinerary.endPoint}`
                              : itinerary.startPoint || "Custom route"}
                          </span>
                        </div>
                        {itinerary.difficulty && (
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[9px] font-semibold text-slate-700">
                            {itinerary.difficulty}
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="pt-1 flex items-center gap-2">
                        <Link
                          to={`/itineraries/edit/${itinerary.id || itinerary._id}`}
                          className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-lg bg-slate-100 hover:bg-orange-50 text-slate-700 hover:text-orange-600 text-[11px] font-semibold transition-colors"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </Link>
                        <button
                          onClick={() => setDeleteId(itinerary.id || itinerary._id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete itinerary"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-5 sm:p-6 max-w-sm w-full shadow-xl border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="text-center space-y-1">
              <h4 className="text-sm font-bold text-slate-900">Delete Itinerary?</h4>
              <p className="text-xs text-slate-500">
                Are you sure? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                disabled={deleting}
                className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
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

export default Dashboard;
