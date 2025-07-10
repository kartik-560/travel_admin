import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createItinerary } from "../api/itineraries";

const CreateItinerary = () => {
  const [form, setForm] = useState({ title: "", description: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createItinerary(form);
    navigate("/itineraries");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Itinerary</h2>
      <input
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        required
      />
      <button type="submit">Create</button>
    </form>
  );
};

export default CreateItinerary;
