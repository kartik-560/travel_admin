import React from "react";
import { FaClock, FaMountain, FaRoute, FaMapMarkerAlt } from "react-icons/fa";

const ItineraryCard = ({ itinerary, onEdit, onDelete }) => {
  const {
    title,
    duration = "TBD",
    difficulty = "Easy to Moderate",
    distance = "TBD",
    destinations = [],
    image = "/fallback.jpg", // fallback if no image
  } = itinerary;

  return (
    <div
      className="relative rounded-xl overflow-hidden shadow-lg h-80 group bg-cover bg-center flex flex-col justify-between"
      style={{ backgroundImage: `url(${image})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300 z-0" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between p-4 text-white">
        {/* Title */}
        <div>
          <h3 className="text-xl font-bold leading-tight mb-2">
            {title}
          </h3>
        </div>

        {/* Info row */}
        <div className="grid grid-cols-2 gap-3 text-sm font-medium">
          <div className="flex items-center space-x-2">
            <FaClock className="text-yellow-300" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FaMountain className="text-yellow-300" />
            <span>{difficulty}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FaRoute className="text-yellow-300" />
            <span>{distance}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FaMapMarkerAlt className="text-yellow-300" />
            <span>{destinations.length} Location{destinations.length !== 1 && "s"}</span>
          </div>
        </div>

        {/* Admin Buttons */}
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={() => onEdit(itinerary._id)}
            className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(itinerary._id)}
            className="btn btn-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItineraryCard;
