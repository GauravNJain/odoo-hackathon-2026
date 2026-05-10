import type {
  Itinerary,
  ItinerarySection,
  SaveItineraryPayload,
} from "@/types/itinerary.types";

const mockItineraries: Record<string, Itinerary> = {
  "trip-1": {
    id: "itin-1",
    tripId: "trip-1",
    sections: [
      {
        id: "sec-1",
        tripId: "trip-1",
        order: 1,
        title: "Paris, France",
        description: "Explore the City of Lights",
        startDate: "2025-06-01",
        endDate: "2025-06-06",
        budget: 80000,
        currency: "INR",
        activities: [
          { id: "a1", sectionId: "sec-1", day: 1, name: "Arrive at CDG Airport", expense: 5000, category: "transport" },
          { id: "a2", sectionId: "sec-1", day: 1, name: "Check in Hotel Le Marais", expense: 12000, category: "stay" },
          { id: "a3", sectionId: "sec-1", day: 2, name: "Visit Eiffel Tower", expense: 3000, category: "activities" },
          { id: "a4", sectionId: "sec-1", day: 2, name: "Lunch at Café de Flore", expense: 4000, category: "food" },
          { id: "a5", sectionId: "sec-1", day: 3, name: "Louvre Museum", expense: 2500, category: "activities" },
          { id: "a6", sectionId: "sec-1", day: 3, name: "Seine River Cruise", expense: 5000, category: "activities" },
        ],
      },
      {
        id: "sec-2",
        tripId: "trip-1",
        order: 2,
        title: "Amsterdam, Netherlands",
        description: "Canals and culture",
        startDate: "2025-06-07",
        endDate: "2025-06-11",
        budget: 60000,
        currency: "INR",
        activities: [
          { id: "a7", sectionId: "sec-2", day: 1, name: "Train Paris → Amsterdam", expense: 8000, category: "transport" },
          { id: "a8", sectionId: "sec-2", day: 1, name: "Hotel check-in", expense: 10000, category: "stay" },
          { id: "a9", sectionId: "sec-2", day: 2, name: "Anne Frank House", expense: 2000, category: "activities" },
          { id: "a10", sectionId: "sec-2", day: 2, name: "Canal boat tour", expense: 4000, category: "activities" },
        ],
      },
      {
        id: "sec-3",
        tripId: "trip-1",
        order: 3,
        title: "Zurich, Switzerland",
        description: "Mountains and chocolate",
        startDate: "2025-06-12",
        endDate: "2025-06-16",
        budget: 70000,
        currency: "INR",
        activities: [
          { id: "a11", sectionId: "sec-3", day: 1, name: "Flight to Zurich", expense: 12000, category: "transport" },
          { id: "a12", sectionId: "sec-3", day: 2, name: "Lake Zurich walk", expense: 0, category: "activities" },
          { id: "a13", sectionId: "sec-3", day: 3, name: "Jungfrau day trip", expense: 15000, category: "activities" },
        ],
      },
      {
        id: "sec-4",
        tripId: "trip-1",
        order: 4,
        title: "Rome, Italy",
        description: "When in Rome...",
        startDate: "2025-06-17",
        endDate: "2025-06-20",
        budget: 40000,
        currency: "INR",
        activities: [
          { id: "a14", sectionId: "sec-4", day: 1, name: "Flight to Rome", expense: 10000, category: "transport" },
          { id: "a15", sectionId: "sec-4", day: 2, name: "Colosseum", expense: 3000, category: "activities" },
          { id: "a16", sectionId: "sec-4", day: 2, name: "Pasta dinner", expense: 3500, category: "food" },
          { id: "a17", sectionId: "sec-4", day: 3, name: "Vatican tour", expense: 5000, category: "activities" },
        ],
      },
    ],
    createdAt: "2025-05-01T10:00:00Z",
    updatedAt: "2025-05-01T10:00:00Z",
  },
  "trip-2": {
    id: "itin-2",
    tripId: "trip-2",
    sections: [
      {
        id: "sec-5",
        tripId: "trip-2",
        order: 1,
        title: "Ubud, Bali",
        description: "Spiritual heart of Bali",
        startDate: "2025-04-10",
        endDate: "2025-04-14",
        budget: 60000,
        currency: "INR",
        activities: [
          { id: "a18", sectionId: "sec-5", day: 1, name: "Airport to Ubud transfer", expense: 3000, category: "transport" },
          { id: "a19", sectionId: "sec-5", day: 1, name: "Check in villa", expense: 8000, category: "stay" },
          { id: "a20", sectionId: "sec-5", day: 2, name: "Tegallalang Rice Terraces", expense: 1000, category: "activities" },
          { id: "a21", sectionId: "sec-5", day: 3, name: "Yoga and spa", expense: 5000, category: "activities" },
        ],
      },
      {
        id: "sec-6",
        tripId: "trip-2",
        order: 2,
        title: "Seminyak, Bali",
        description: "Beach vibes and nightlife",
        startDate: "2025-04-15",
        endDate: "2025-04-17",
        budget: 50000,
        currency: "INR",
        activities: [
          { id: "a22", sectionId: "sec-6", day: 1, name: "Drive to Seminyak", expense: 2000, category: "transport" },
          { id: "a23", sectionId: "sec-6", day: 1, name: "Beach resort", expense: 12000, category: "stay" },
          { id: "a24", sectionId: "sec-6", day: 2, name: "Sunset at Tanah Lot", expense: 2000, category: "activities" },
        ],
      },
      {
        id: "sec-7",
        tripId: "trip-2",
        order: 3,
        title: "Nusa Penida",
        description: "Island paradise",
        startDate: "2025-04-18",
        endDate: "2025-04-20",
        budget: 70000,
        currency: "INR",
        activities: [
          { id: "a25", sectionId: "sec-7", day: 1, name: "Boat to Nusa Penida", expense: 4000, category: "transport" },
          { id: "a26", sectionId: "sec-7", day: 1, name: "Kelingking Beach", expense: 500, category: "activities" },
          { id: "a27", sectionId: "sec-7", day: 2, name: "Snorkeling at Manta Point", expense: 6000, category: "activities" },
        ],
      },
    ],
    createdAt: "2025-03-15T10:00:00Z",
    updatedAt: "2025-04-10T10:00:00Z",
  },
};

export const mockItinerary = {
  getByTripId: async (tripId: string): Promise<Itinerary | null> => {
    await new Promise((r) => setTimeout(r, 500));
    return mockItineraries[tripId] ? { ...mockItineraries[tripId] } : null;
  },

  save: async (payload: SaveItineraryPayload): Promise<Itinerary> => {
    await new Promise((r) => setTimeout(r, 700));
    const sections: ItinerarySection[] = payload.sections.map((s, i) => ({
      ...s,
      id: "sec-" + Date.now() + "-" + i,
      tripId: payload.tripId,
    }));
    const itinerary: Itinerary = {
      id: "itin-" + Date.now(),
      tripId: payload.tripId,
      sections,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockItineraries[payload.tripId] = itinerary;
    return itinerary;
  },
};
