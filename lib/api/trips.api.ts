import { API_BASE_URL, USE_MOCK, authHeaders } from "../config";
import { mockTrips } from "../mock/trips.mock";
import type { Trip, CreateTripPayload } from "@/types/trip.types";

export const tripsApi = {
  getAll: async (): Promise<Trip[]> => {
    if (USE_MOCK) return mockTrips.getAll();
    const res = await fetch(`${API_BASE_URL}/trips`, { headers: authHeaders() });
    if (!res.ok) throw new Error("Failed to fetch trips");
    const json = await res.json();
    return json.data;
  },
  getById: async (id: string): Promise<Trip> => {
    if (USE_MOCK) return mockTrips.getById(id);
    const res = await fetch(`${API_BASE_URL}/trips/${id}`, { headers: authHeaders() });
    if (!res.ok) throw new Error("Trip not found");
    const json = await res.json();
    return json.data;
  },
  create: async (payload: CreateTripPayload): Promise<Trip> => {
    if (USE_MOCK) return mockTrips.create(payload);
    const res = await fetch(`${API_BASE_URL}/trips`, { method: "POST", headers: authHeaders(), body: JSON.stringify(payload) });
    if (!res.ok) throw new Error("Failed to create trip");
    const json = await res.json();
    return json.data;
  },
  update: async (id: string, payload: Partial<Trip>): Promise<Trip> => {
    if (USE_MOCK) return mockTrips.update(id, payload);
    const res = await fetch(`${API_BASE_URL}/trips/${id}`, { method: "PUT", headers: authHeaders(), body: JSON.stringify(payload) });
    if (!res.ok) throw new Error("Failed to update trip");
    const json = await res.json();
    return json.data;
  },
  delete: async (id: string): Promise<void> => {
    if (USE_MOCK) return mockTrips.delete(id);
    const res = await fetch(`${API_BASE_URL}/trips/${id}`, { method: "DELETE", headers: authHeaders() });
    if (!res.ok) throw new Error("Failed to delete trip");
  },
};
