import type { Trip, CreateTripPayload } from "@/types/trip.types";

let mockTripsData: Trip[] = [
  {
    id: "trip-1",
    name: "European Summer Adventure",
    destination: "Paris, France",
    description: "Exploring the City of Lights and beyond",
    coverPhoto: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
    startDate: "2025-06-01",
    endDate: "2025-06-20",
    status: "upcoming",
    totalBudget: 250000,
    currency: "INR",
    stopsCount: 4,
    userId: "user-1",
    createdAt: "2025-05-01T10:00:00Z",
    updatedAt: "2025-05-01T10:00:00Z",
  },
  {
    id: "trip-2",
    name: "Bali Wellness Retreat",
    destination: "Bali, Indonesia",
    description: "A soul-rejuvenating journey through Bali's spiritual heartland",
    coverPhoto: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    startDate: "2025-04-10",
    endDate: "2025-04-20",
    status: "ongoing",
    totalBudget: 180000,
    currency: "INR",
    stopsCount: 3,
    userId: "user-1",
    createdAt: "2025-03-15T10:00:00Z",
    updatedAt: "2025-04-10T10:00:00Z",
  },
  {
    id: "trip-3",
    name: "Tokyo Culture Deep-Dive",
    destination: "Tokyo, Japan",
    description: "Traditional temples, modern marvels, and the best ramen",
    coverPhoto: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
    startDate: "2025-01-05",
    endDate: "2025-01-15",
    status: "completed",
    totalBudget: 300000,
    currency: "INR",
    stopsCount: 5,
    userId: "user-1",
    createdAt: "2024-12-01T10:00:00Z",
    updatedAt: "2025-01-15T10:00:00Z",
  },
  {
    id: "trip-4",
    name: "Dubai Business + Leisure",
    destination: "Dubai, UAE",
    description: "Mixing work and play in the desert metropolis",
    coverPhoto: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
    startDate: "2024-11-10",
    endDate: "2024-11-17",
    status: "completed",
    totalBudget: 200000,
    currency: "INR",
    stopsCount: 2,
    userId: "user-1",
    createdAt: "2024-10-20T10:00:00Z",
    updatedAt: "2024-11-17T10:00:00Z",
  },
  {
    id: "trip-5",
    name: "Rajasthan Royal Heritage Tour",
    destination: "Jaipur, India",
    description: "Exploring the pink city and its royal heritage",
    coverPhoto: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80",
    startDate: "2025-07-01",
    endDate: "2025-07-10",
    status: "upcoming",
    totalBudget: 80000,
    currency: "INR",
    stopsCount: 3,
    userId: "user-1",
    createdAt: "2025-05-20T10:00:00Z",
    updatedAt: "2025-05-20T10:00:00Z",
  },
];

export const mockTrips = {
  getAll: async (): Promise<Trip[]> => {
    await new Promise((r) => setTimeout(r, 600));
    return [...mockTripsData];
  },

  getById: async (id: string): Promise<Trip> => {
    await new Promise((r) => setTimeout(r, 400));
    const trip = mockTripsData.find((t) => t.id === id);
    if (!trip) throw new Error("Trip not found");
    return { ...trip };
  },

  create: async (payload: CreateTripPayload): Promise<Trip> => {
    await new Promise((r) => setTimeout(r, 800));
    const newTrip: Trip = {
      id: "trip-" + Date.now(),
      ...payload,
      status: "upcoming",
      totalBudget: 0,
      currency: "INR",
      stopsCount: 0,
      userId: "user-1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockTripsData = [newTrip, ...mockTripsData];
    return newTrip;
  },

  update: async (id: string, payload: Partial<Trip>): Promise<Trip> => {
    await new Promise((r) => setTimeout(r, 600));
    const idx = mockTripsData.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error("Trip not found");
    mockTripsData[idx] = {
      ...mockTripsData[idx],
      ...payload,
      updatedAt: new Date().toISOString(),
    };
    return { ...mockTripsData[idx] };
  },

  delete: async (id: string): Promise<void> => {
    await new Promise((r) => setTimeout(r, 500));
    mockTripsData = mockTripsData.filter((t) => t.id !== id);
  },
};
