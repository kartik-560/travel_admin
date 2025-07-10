import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getItinerary, updateItinerary } from "../api/itineraries";

const EditItinerary = () => {
  const { id } = useParams();
  const [form, setForm] = useState({ title: "", description: "" });
  const navigate = useNavigate();

  useEffect(() => {
    getItinerary(id).then((res) => setForm(res.data));
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateItinerary(id, form);
    navigate("/itineraries");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Itinerary</h2>
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        required
      />
      <button type="submit">Update</button>
    </form>
  );
};

export default EditItinerary;
