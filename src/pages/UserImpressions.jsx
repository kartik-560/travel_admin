import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAnalyticsStats, clearAnalyticsStats } from "../api/analytics";
import {
  Users,
  Eye,
  Calendar,
  Clock,
  TrendingUp,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  RefreshCw,
  Trash2,
  Search,
  ArrowUpRight,
  ShieldAlert,
  Compass,
} from "lucide-react";

const UserImpressions = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [clearConfirm, setClearConfirm] = useState(false);
  const [clearing, setClearing] = useState(false);

  const fetchTelemetry = async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true);
      else setLoading(true);

      const res = await getAnalyticsStats();
      setData(res.data);
    } catch (err) {
      console.error("Failed to load visitor telemetry:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
  }, []);

  const handleClear = async () => {
    try {
      setClearing(true);
      await clearAnalyticsStats();
      setClearConfirm(false);
      await fetchTelemetry();
    } catch (err) {
      console.error("Failed to clear telemetry:", err);
      alert("Failed to reset telemetry.");
    } finally {
      setClearing(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-slate-200 rounded-xl animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-slate-200 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="h-64 bg-slate-200 rounded-2xl animate-pulse" />
        <div className="h-64 bg-slate-200 rounded-2xl animate-pulse" />
      </div>
    );
  }

  const summary = data?.summary || {
    totalImpressions: 0,
    uniqueVisitors: 0,
    todayImpressions: 0,
    todayUniqueVisitors: 0,
    weekImpressions: 0,
    monthImpressions: 0,
  };

  const topPages = data?.topPages || [];
  const deviceBreakdown = data?.deviceBreakdown || { desktop: 0, mobile: 0, tablet: 0 };
  const topBrowsers = data?.topBrowsers || [];
  const timeline = data?.timeline || [];
  const recent = data?.recent || [];

  const totalDeviceCount =
    (deviceBreakdown.desktop || 0) +
    (deviceBreakdown.mobile || 0) +
    (deviceBreakdown.tablet || 0) || 1;

  const maxTimelineImpression = Math.max(
    ...timeline.map((t) => t.impressions),
    1
  );

  const filteredRecent = recent.filter((r) => {
    const term = searchTerm.toLowerCase();
    return (
      r.path?.toLowerCase().includes(term) ||
      r.visitorId?.toLowerCase().includes(term) ||
      r.browser?.toLowerCase().includes(term) ||
      r.os?.toLowerCase().includes(term) ||
      r.device?.toLowerCase().includes(term)
    );
  });

  const kpis = [
    {
      title: "Total Impressions",
      value: summary.totalImpressions.toLocaleString(),
      sub: "All-time page views",
      icon: Eye,
      bg: "bg-orange-50 text-orange-600",
    },
    {
      title: "Unique Visitors",
      value: summary.uniqueVisitors.toLocaleString(),
      sub: "Distinct client devices",
      icon: Users,
      bg: "bg-blue-50 text-blue-600",
    },
    {
      title: "Today's Visits",
      value: summary.todayImpressions.toLocaleString(),
      sub: `${summary.todayUniqueVisitors} unique users today`,
      icon: TrendingUp,
      bg: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "7-Day Volume",
      value: summary.weekImpressions.toLocaleString(),
      sub: "Past 7 days traffic",
      icon: Calendar,
      bg: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              User Impressions
            </h2>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Telemetry
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Monitor real-time visitors, user impressions, and engagement across Better Backpacking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchTelemetry(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-orange-500" : ""}`} />
            <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
          </button>
          <button
            onClick={() => setClearConfirm(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 bg-red-50/50 hover:bg-red-50 text-red-600 text-xs font-semibold transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-xl p-3.5 border border-slate-200/80 shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500">{card.title}</span>
                <div className={`p-1.5 rounded-lg ${card.bg}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2">
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {card.value}
                </div>
                <div className="text-[10px] font-medium text-slate-400 mt-0.5">{card.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 7-Day Traffic Trend Bar Chart */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">7-Day Visitor Velocity</h3>
            <p className="text-[11px] text-slate-400">Daily impressions and unique visitors over the past week</p>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-semibold text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-orange-500" /> Impressions
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" /> Unique Visitors
            </span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 pt-2 items-end h-40 border-b border-slate-100 pb-2">
          {timeline.map((day, idx) => {
            const impHeight = Math.max(Math.round((day.impressions / maxTimelineImpression) * 100), 6);
            const uniqHeight = Math.max(Math.round((day.uniqueVisitors / maxTimelineImpression) * 100), 4);

            return (
              <div key={idx} className="flex flex-col items-center justify-end h-full gap-1 group">
                <div className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  {day.impressions}
                </div>
                <div className="w-full flex items-end justify-center gap-1 max-w-[40px] h-32">
                  <div
                    style={{ height: `${impHeight}%` }}
                    className="w-1/2 bg-orange-500 hover:bg-orange-600 rounded-t-sm transition-all duration-300 relative"
                    title={`Impressions: ${day.impressions}`}
                  />
                  <div
                    style={{ height: `${uniqHeight}%` }}
                    className="w-1/2 bg-blue-500 hover:bg-blue-600 rounded-t-sm transition-all duration-300 relative"
                    title={`Unique Visitors: ${day.uniqueVisitors}`}
                  />
                </div>
                <span className="text-[10px] font-medium text-slate-500 tracking-tight">
                  {day.label.split(",")[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two-Column Analytics: Top Pages & Devices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        {/* Top Pages */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Top Visited Pages</h3>
              <p className="text-[11px] text-slate-400">Routes receiving the highest user impressions</p>
            </div>
            <Compass className="w-4 h-4 text-orange-500" />
          </div>

          {topPages.length > 0 ? (
            <div className="space-y-2.5">
              {topPages.map((page, idx) => {
                const percent = Math.round(
                  (page.views / (summary.totalImpressions || 1)) * 100
                );
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-semibold text-slate-700 truncate max-w-[240px]">
                        {page.path === "/" ? "/ (Home)" : page.path}
                      </span>
                      <span className="text-slate-500 font-bold">
                        {page.views} <span className="text-[10px] font-normal text-slate-400">({percent}%)</span>
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        style={{ width: `${percent}%` }}
                        className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">
              No page impressions recorded yet.
            </div>
          )}
        </div>

        {/* Devices & Browsers */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Device & Platform Breakdown</h3>
              <p className="text-[11px] text-slate-400">Visitor technology distribution</p>
            </div>
            <Monitor className="w-4 h-4 text-blue-500" />
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              {
                label: "Desktop",
                count: deviceBreakdown.desktop,
                icon: Monitor,
                color: "text-blue-600 bg-blue-50",
              },
              {
                label: "Mobile",
                count: deviceBreakdown.mobile,
                icon: Smartphone,
                color: "text-emerald-600 bg-emerald-50",
              },
              {
                label: "Tablet",
                count: deviceBreakdown.tablet,
                icon: Tablet,
                color: "text-purple-600 bg-purple-50",
              },
            ].map((d, i) => {
              const Icon = d.icon;
              const pct = Math.round((d.count / totalDeviceCount) * 100);
              return (
                <div key={i} className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/60 text-center">
                  <div className={`w-7 h-7 mx-auto rounded-lg flex items-center justify-center mb-1 ${d.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-xs font-bold text-slate-800">{pct}%</div>
                  <div className="text-[10px] text-slate-400">{d.label}</div>
                  <div className="text-[9px] font-mono text-slate-400 mt-0.5">{d.count} views</div>
                </div>
              );
            })}
          </div>

          {/* Top Browsers */}
          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-wider">
              Top Browsers
            </h4>
            <div className="flex flex-wrap gap-2">
              {topBrowsers.map((b, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium flex items-center gap-1.5"
                >
                  <Globe className="w-3 h-3 text-slate-400" />
                  {b.browser}: <span className="font-bold text-slate-900">{b.count}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Impressions Log Table */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Visitor Activity Log</h3>
            <p className="text-[11px] text-slate-400">Latest telemetry entries captured from website visitors</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search route, browser, visitor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        {filteredRecent.length > 0 ? (
          <div>
            {/* Mobile View: Clean Responsive Cards (< md screens) */}
            <div className="md:hidden space-y-2.5">
              {filteredRecent.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/70 space-y-2 shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-orange-50 text-orange-700 text-xs font-mono font-bold border border-orange-200/70 truncate max-w-[200px]">
                      {item.path}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium shrink-0">
                      {new Date(item.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-slate-200/60 text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Visitor</span>
                      <span className="font-mono text-slate-700 font-semibold truncate block">
                        {item.visitorId ? item.visitorId.slice(0, 15) : "anon"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Device & OS</span>
                      <span className="text-slate-700 font-medium capitalize truncate block">
                        {item.device || "desktop"} {item.os ? `(${item.os})` : ""}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Browser</span>
                      <span className="text-slate-700 font-medium truncate block">
                        {item.browser || "Unknown"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Referrer</span>
                      <span className="text-slate-600 truncate block" title={item.referrer}>
                        {item.referrer || "direct"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View: Full Table (>= md screens) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-2 px-2">Time</th>
                    <th className="py-2 px-2">Page Route</th>
                    <th className="py-2 px-2">Visitor Hash</th>
                    <th className="py-2 px-2">Device & OS</th>
                    <th className="py-2 px-2">Browser</th>
                    <th className="py-2 px-2">Referrer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRecent.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2 px-2 whitespace-nowrap text-slate-500 text-[11px]">
                        {new Date(item.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                        <span className="block text-[9px] text-slate-400">
                          {new Date(item.timestamp).toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </td>
                      <td className="py-2 px-2 font-mono font-semibold text-slate-800">
                        <span className="inline-block px-1.5 py-0.5 rounded bg-orange-50 text-orange-700 text-[11px] border border-orange-100">
                          {item.path}
                        </span>
                      </td>
                      <td className="py-2 px-2 font-mono text-[11px] text-slate-500">
                        {item.visitorId ? item.visitorId.slice(0, 14) : "anon"}
                      </td>
                      <td className="py-2 px-2 text-slate-600">
                        <span className="capitalize font-medium">{item.device || "desktop"}</span>
                        {item.os && <span className="text-slate-400 text-[10px]"> ({item.os})</span>}
                      </td>
                      <td className="py-2 px-2 text-slate-600">{item.browser || "Unknown"}</td>
                      <td className="py-2 px-2 text-slate-400 truncate max-w-[150px]" title={item.referrer}>
                        {item.referrer || "direct"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-400">
            {searchTerm ? "No matching visitor logs found." : "No impressions recorded yet."}
          </div>
        )}
      </div>

      {/* Clear Confirmation Modal */}
      {clearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="text-center space-y-1">
              <h4 className="text-base font-bold text-slate-900">Reset Telemetry Data?</h4>
              <p className="text-xs text-slate-500">
                Are you sure you want to clear all recorded visitor impressions and history? This cannot be undone.
              </p>
            </div>
            <div className="flex gap-2.5 pt-1.5">
              <button
                onClick={() => setClearConfirm(false)}
                disabled={clearing}
                className="flex-1 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClear}
                disabled={clearing}
                className="flex-1 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors shadow-md shadow-red-500/25"
              >
                {clearing ? "Clearing..." : "Reset Data"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserImpressions;

