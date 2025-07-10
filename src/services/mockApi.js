// Mock API service to simulate backend calls
let mockItineraries = [
  {
    _id: "1",
    title: "Paris Adventure",
    description: "Explore the City of Light with visits to the Eiffel Tower, Louvre Museum, and charming cafes along the Seine. Experience French culture, cuisine, and history in this unforgettable journey through one of the world's most romantic cities.",
    duration: "7 days",
    price: "$2,500",
    destinations: ["Paris", "Versailles", "Montmartre"],
    highlights: ["Eiffel Tower", "Louvre Museum", "Seine River Cruise", "Palace of Versailles"]
  },
  {
    _id: "2", 
    title: "Tokyo Discovery",
    description: "Experience modern Japan with traditional temples, bustling markets, and incredible cuisine in the world's largest city. From ancient shrines to cutting-edge technology, discover the perfect blend of old and new.",
    duration: "10 days",
    price: "$3,200",
    destinations: ["Tokyo", "Kyoto", "Osaka"],
    highlights: ["Senso-ji Temple", "Shibuya Crossing", "Mount Fuji", "Traditional Tea Ceremony"]
  },
  {
    _id: "3",
    title: "New York Highlights",
    description: "See the best of the Big Apple including Central Park, Times Square, and world-class museums and Broadway shows. Experience the energy and diversity of America's most iconic city.",
    duration: "5 days",
    price: "$1,800",
    destinations: ["Manhattan", "Brooklyn", "Staten Island"],
    highlights: ["Statue of Liberty", "Central Park", "Broadway Show", "9/11 Memorial"]
  },
  {
    _id: "4",
    title: "Bali Retreat",
    description: "Relax and rejuvenate in tropical paradise with beautiful beaches, ancient temples, and lush rice terraces. Perfect for those seeking both adventure and tranquility.",
    duration: "8 days",
    price: "$2,100",
    destinations: ["Ubud", "Seminyak", "Nusa Penida"],
    highlights: ["Rice Terraces", "Beach Sunset", "Temple Visits", "Spa Treatments"]
  },
  {
    _id: "5",
    title: "Swiss Alps Adventure",
    description: "Experience breathtaking mountain scenery, charming villages, and outdoor adventures in the heart of the Swiss Alps. Perfect for nature lovers and adventure seekers.",
    duration: "9 days",
    price: "$3,800",
    destinations: ["Zermatt", "Interlaken", "Lucerne"],
    highlights: ["Matterhorn Views", "Jungfraujoch", "Lake Cruises", "Alpine Hiking"]
  }
];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  // Get all itineraries
  getItineraries: async () => {
    await delay(500);
    return { data: mockItineraries };
  },

  // Get single itinerary
  getItinerary: async (id) => {
    await delay(300);
    const itinerary = mockItineraries.find(item => item._id === id);
    if (!itinerary) {
      throw new Error('Itinerary not found');
    }
    return { data: itinerary };
  },

  // Create new itinerary
  createItinerary: async (data) => {
    await delay(800);
    const newItinerary = {
      ...data,
      _id: Date.now().toString(),
    };
    mockItineraries.push(newItinerary);
    return { data: newItinerary };
  },

  // Update itinerary
  updateItinerary: async (id, data) => {
    await delay(600);
    const index = mockItineraries.findIndex(item => item._id === id);
    if (index === -1) {
      throw new Error('Itinerary not found');
    }
    mockItineraries[index] = { ...mockItineraries[index], ...data };
    return { data: mockItineraries[index] };
  },

  // Delete itinerary
  deleteItinerary: async (id) => {
    await delay(400);
    const index = mockItineraries.findIndex(item => item._id === id);
    if (index === -1) {
      throw new Error('Itinerary not found');
    }
    mockItineraries.splice(index, 1);
    return { data: { message: 'Itinerary deleted successfully' } };
  }
};