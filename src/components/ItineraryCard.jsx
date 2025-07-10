import React from "react";

const ItineraryCard = ({ itinerary, onEdit, onDelete }) => (
  <div className="itinerary-card">
    <h3>{itinerary.title}</h3>
    <p>{itinerary.description}</p>
    <button onClick={() => onEdit(itinerary._id)}>Edit</button>
    <button onClick={() => onDelete(itinerary._id)}>Delete</button>
  </div>
);

export default ItineraryCard;
