import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getItineraries, deleteItinerary } from "../api/itineraries";
import ItineraryCard from "../components/ItineraryCard";

const ItinerariesList = () => {
  const [itineraries, setItineraries] = useState([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    const res = await getItineraries();
    setItineraries(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    await deleteItinerary(id);
    fetchData();
  };

  return (
    <div>
      <h2>All Itineraries</h2>
      {itineraries.map((itinerary) => (
        <ItineraryCard
          key={itinerary._id}
          itinerary={itinerary}
          onEdit={(id) => navigate(`/edit/${id}`)}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};

export default ItinerariesList;
