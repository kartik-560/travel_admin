import axios from "axios";
import config from "../config";

// Mock data for development
const mockItineraries = [
  {
    _id: "1",
    title: "Paris Adventure",
    description: "Explore the City of Light with visits to the Eiffel Tower, Louvre Museum, and charming cafes along the Seine.",
    duration: "7 days",
    price: "$2,500",
    destinations: ["Paris", "Versailles", "Montmartre"],
    highlights: ["Eiffel Tower", "Louvre Museum", "Seine River Cruise", "Palace of Versailles"]
  },
  {
    _id: "2", 
    title: "Tokyo Discovery",
    description: "Experience modern Japan with traditional temples, bustling markets, and incredible cuisine in the world's largest city.",
    duration: "10 days",
    price: "$3,200",
    destinations: ["Tokyo", "Kyoto", "Osaka"],
    highlights: ["Senso-ji Temple", "Shibuya Crossing", "Mount Fuji", "Traditional Tea Ceremony"]
  },
  {
    _id: "3",
    title: "New York Highlights",
    description: "See the best of the Big Apple including Central Park, Times Square, and world-class museums and Broadway shows.",
    duration: "5 days",
    price: "$1,800",
    destinations: ["Manhattan", "Brooklyn", "Staten Island"],
    highlights: ["Statue of Liberty", "Central Park", "Broadway Show", "9/11 Memorial"]
  }
];

const api = axios.create({
  baseURL: config.API_BASE_URL + "/itineraries",
});

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Use mock data for now (set to false when backend is ready)
const USE_MOCK_DATA = true;

export const getItineraries = async () => {
  if (USE_MOCK_DATA) {
    await delay(500);
    return { data: mockItineraries };
  }
  return api.get("/");
};

export const getItinerary = async (id) => {
  if (USE_MOCK_DATA) {
    await delay(300);
    const itinerary = mockItineraries.find(item => item._id === id);
    if (!itinerary) {
      throw new Error('Itinerary not found');
    }
    return { data: itinerary };
  }
  return api.get(`/${id}`);
};

export const createItinerary = async (data) => {
  if (USE_MOCK_DATA) {
    await delay(800);
    const newItinerary = {
      ...data,
      _id: Date.now().toString(),
    };
    mockItineraries.push(newItinerary);
    return { data: newItinerary };
  }
  return api.post("/", data);
};

export const updateItinerary = async (id, data) => {
  if (USE_MOCK_DATA) {
    await delay(600);
    const index = mockItineraries.findIndex(item => item._id === id);
    if (index === -1) {
      throw new Error('Itinerary not found');
    }
    mockItineraries[index] = { ...mockItineraries[index], ...data };
    return { data: mockItineraries[index] };
  }
  return api.put(`/${id}`, data);
};

export const deleteItinerary = async (id) => {
  if (USE_MOCK_DATA) {
    await delay(400);
    const index = mockItineraries.findIndex(item => item._id === id);
    if (index === -1) {
      throw new Error('Itinerary not found');
    }
    mockItineraries.splice(index, 1);
    return { data: { message: 'Itinerary deleted successfully' } };
  }
  return api.delete(`/${id}`);
};