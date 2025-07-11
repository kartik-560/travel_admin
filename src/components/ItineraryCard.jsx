import React from "react";

const ItineraryCard = ({ itinerary, onEdit, onDelete }) => (
  <div className="card hover:shadow-lg transition-shadow duration-200">
    <h3 className="text-xl font-semibold text-gray-900 mb-3">{itinerary.title}</h3>
    <p className="text-gray-600 mb-4 line-clamp-3">{itinerary.description}</p>
    
    <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
        {itinerary.duration || 'Not specified'}
      </span>
      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
        {itinerary.price || 'TBD'}
      </span>
    </div>

    {itinerary.destinations && itinerary.destinations.length > 0 && (
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Destinations:</p>
        <div className="flex flex-wrap gap-1">
          {itinerary.destinations.slice(0, 3).map((dest, index) => (
            <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
              {dest}
            </span>
          ))}
          {itinerary.destinations.length > 3 && (
            <span className="text-xs text-gray-500">
              +{itinerary.destinations.length - 3} more
            </span>
          )}
        </div>
      </div>
    )}
    
    <div className="flex space-x-2">
      <button
        onClick={() => onEdit(itinerary._id)}
        className="flex-1 btn btn-primary"
      >
        Edit
      </button>
      <button
        onClick={() => onDelete(itinerary._id)}
        className="flex-1 btn btn-danger"
      >
        Delete
      </button>
    </div>
  </div>
);

export default ItineraryCard;
