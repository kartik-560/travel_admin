import React from "react";
import "./styles/ItineraryCard.css";
const ItineraryCard = ({ itinerary, onEdit, onDelete }) => {
  // console.log("Rendering ItineraryCard with ID:", itinerary._id);
  return (
   
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
