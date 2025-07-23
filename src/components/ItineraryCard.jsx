import React from "react";
import "./styles/ItineraryCard.css";
const ItineraryCard = ({ itinerary, onEdit, onDelete }) => {
  // console.log("Rendering ItineraryCard with ID:", itinerary._id);
  return (
    // <div className="card hover:shadow-lg transition-shadow duration-200">
    //   <h3 className="text-xl font-semibold text-gray-900 mb-3">
    //     {itinerary.title}
    //   </h3>
    //   <p className="text-gray-600 mb-4 line-clamp-3">{itinerary.description}</p>

    //   <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
    //     <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
    //       {itinerary.duration || "Not specified"}
    //     </span>
    //     <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
    //       {itinerary.price || "TBD"}
    //     </span>
    //   </div>

    //   {itinerary.destinations && itinerary.destinations.length > 0 && (
    //     <div className="mb-4">
    //       <p className="text-sm font-medium text-gray-700 mb-2">
    //         Destinations:
    //       </p>
    //       <div className="flex flex-wrap gap-1">
    //         {itinerary.destinations.slice(0, 3).map((dest, index) => (
    //           <span
    //             key={index}
    //             className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
    //           >
    //             {dest}
    //           </span>
    //         ))}
    //         {itinerary.destinations.length > 3 && (
    //           <span className="text-xs text-gray-500">
    //             +{itinerary.destinations.length - 3} more
    //           </span>
    //         )}
    //       </div>
    //     </div>
    //   )}

    //   <div className="flex space-x-2">
    //     <button
    //       onClick={() => onEdit(itinerary.id)}
    //       className="flex-1 btn btn-primary"
    //     >
    //       Edit
    //     </button>
    //     <button
    //       onClick={() => onDelete(itinerary.id)}
    //       className="flex-1 btn btn-danger"
    //     >
    //       Delete
    //     </button>
    //   </div>
    // </div>
    <div className="card-grid">
    <div className="itinerary-card hover-shadow">
      <h3 className="itinerary-title">{itinerary.title}</h3>

      <p className="itinerary-description line-clamp-3">
        {itinerary.description}
      </p>

      <div className="itinerary-meta">
        <span className="duration-badge">
          {itinerary.duration || "Not specified"}
        </span>
        <span className="price-badge">{itinerary.price || "TBD"}</span>
      </div>

      {itinerary.destinations && itinerary.destinations.length > 0 && (
        <div className="itinerary-destinations">
          <p className="destinations-label">Destinations:</p>
          <div className="destinations-list">
            {itinerary.destinations.slice(0, 3).map((dest, index) => (
              <span key={index} className="destination-chip">
                {dest}
              </span>
            ))}
            {itinerary.destinations.length > 3 && (
              <span className="destinations-more">
                +{itinerary.destinations.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      <div className="itinerary-actions">
        <button
          onClick={() => onEdit(itinerary.id)}
          className="btn btn-primary"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(itinerary.id)}
          className="btn btn-danger"
        >
          Delete
        </button>
      </div>
    </div>
    </div>
  );
};

export default ItineraryCard;
