import React from "react";
import { Clock, MapPin, Mountain, Edit3, Trash2, Map, Eye, EyeOff } from "lucide-react";

const ItineraryCard = ({ itinerary, onEdit, onDelete, onToggleStatus }) => {
  const coverImage = itinerary.images?.[0];
  const tripId = itinerary.id || itinerary._id;
  const isHidden = itinerary.status === "HIDDEN";

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all duration-150 flex flex-col group">
      {/* Cover Image Header */}
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
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-slate-950/70 backdrop-blur-md text-white text-[10px] font-semibold flex items-center gap-1">
          <Clock className="w-2.5 h-2.5 text-amber-400" />
          <span>{itinerary.duration || "N/A"}</span>
        </div>

        {/* Status Badge in overlay */}
        <div className="absolute top-2 right-2 flex items-center gap-1">
          {isHidden ? (
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
      </div>

      {/* Body Content */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
        <div>
          <div className="flex items-center justify-between gap-1 mb-1">
            {itinerary.category && (
              <span className="inline-block px-2 py-0.5 rounded bg-orange-50 text-orange-600 text-[10px] font-semibold truncate">
                {itinerary.category}
              </span>
            )}
            {itinerary.difficulty && (
              <span className="text-[10px] text-slate-400 font-medium">
                {itinerary.difficulty}
              </span>
            )}
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-orange-600 transition-colors">
            {itinerary.title}
          </h3>
          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
            {itinerary.subTitle || itinerary.travel_description || "No description provided."}
          </p>
        </div>

        {/* Route Details */}
        <div className="space-y-1 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
          {(itinerary.startPoint || itinerary.endPoint) && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-orange-500 shrink-0" />
              <span className="truncate">
                {itinerary.startPoint} {itinerary.endPoint ? `→ ${itinerary.endPoint}` : ""}
              </span>
            </div>
          )}
          {itinerary.maxElevation && (
            <div className="flex items-center gap-1">
              <Mountain className="w-3 h-3 text-emerald-500 shrink-0" />
              <span>Elev: {itinerary.maxElevation}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-1 flex items-center gap-1.5">
          <button
            onClick={() => onEdit(tripId)}
            className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-orange-50 text-slate-700 hover:text-orange-600 text-[11px] font-semibold transition-colors"
          >
            <Edit3 className="w-3 h-3" />
            <span>Edit</span>
          </button>
          {onToggleStatus && (
            <button
              onClick={() => onToggleStatus(tripId, isHidden ? "PUBLISHED" : "HIDDEN")}
              className={`p-1.5 rounded-lg border text-xs transition-colors ${
                isHidden
                  ? "border-emerald-200 bg-emerald-50/50 text-emerald-600 hover:bg-emerald-100"
                  : "border-slate-200 bg-slate-50 text-slate-500 hover:bg-amber-50 hover:text-amber-600"
              }`}
              title={isHidden ? "Make Live on Website" : "Hide from Website"}
            >
              {isHidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>
          )}
          <button
            onClick={() => onDelete(tripId)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Delete itinerary"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItineraryCard;
