import React from "react";

const ItineraryCard = ({ itinerary, onEdit, onDelete }) => (
  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-xl font-semibold text-gray-800 line-clamp-2">
        {itinerary.title}
      </h3>
      <div className="flex space-x-2 ml-4">
        <button
          onClick={() => onEdit(itinerary._id)}
          className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors duration-200"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(itinerary._id)}
          className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition-colors duration-200"
        >
          Delete
        </button>
      </div>
    </div>
    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
      {itinerary.description}
    </p>
    <div className="mt-4 pt-4 border-t border-gray-100">
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Duration: {itinerary.duration || 'Not specified'}</span>
        <span>Price: ${itinerary.price || 'TBD'}</span>
      </div>
    </div>
  </div>
);

export default ItineraryCard;