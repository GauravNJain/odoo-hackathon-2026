import { API_BASE_URL, USE_MOCK, authHeaders } from "../config";
import { mockItinerary } from "../mock/itinerary.mock";
import type { Itinerary, SaveItineraryPayload } from "@/types/itinerary.types";

export const itineraryApi = {
  getByTripId: async (tripId: string): Promise<Itinerary | null> => {
    if (USE_MOCK) return mockItinerary.getByTripId(tripId);
    const res = await fetch(`${API_BASE_URL}/trips/${tripId}/itinerary`, { headers: authHeaders() });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Failed to fetch itinerary");
    const json = await res.json();
    return json.data;
  },
  save: async (payload: SaveItineraryPayload): Promise<Itinerary> => {
    if (USE_MOCK) return mockItinerary.save(payload);
    const res = await fetch(`${API_BASE_URL}/trips/${payload.tripId}/itinerary`, {
      method: "POST", headers: authHeaders(), body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to save itinerary");
    const json = await res.json();
    return json.data;
  },
};
