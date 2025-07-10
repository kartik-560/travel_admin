import React from "react";

const ItineraryCard = ({ itinerary, onEdit, onDelete }) => (
  <div className="itinerary-card">
    <h3>{itinerary.title}</h3>
    <p>{itinerary.description}</p>
    <div className="itinerary-meta">
      <span>Duration: {itinerary.duration || 'Not specified'}</span>
      <span>Price: {itinerary.price || 'TBD'}</span>
    </div>
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