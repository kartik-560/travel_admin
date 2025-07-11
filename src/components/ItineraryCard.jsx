import React from "react";
import './ItineraryCard.css';

const ItineraryCard = ({ itinerary, onEdit, onDelete }) => (
  <div className="itinerary-card">
    <h3 className="itinerary-title">{itinerary.title}</h3>
    <p className="itinerary-description line-clamp-3">{itinerary.description}</p>
    
    <div className="itinerary-meta">
      <span className="badge badge-blue">
        {itinerary.duration || 'Not specified'}
      </span>
      <span className="badge badge-green">
        {itinerary.price || 'TBD'}
      </span>
    </div>

    {itinerary.destinations && itinerary.destinations.length > 0 && (
      <div className="itinerary-destinations">
        <p className="destinations-label">Destinations:</p>
        <div className="destinations-list">
          {itinerary.destinations.slice(0, 3).map((dest, index) => (
            <span key={index} className="badge badge-gray">
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
        onClick={() => onEdit(itinerary._id)}
        className="btn btn-primary"
      >
        Edit
      </button>
      <button
        onClick={() => onDelete(itinerary._id)}
        className="btn btn-danger"
      >
        Delete
      </button>
    </div>
  </div>
);

export default ItineraryCard;