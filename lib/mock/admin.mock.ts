import type { SearchResult, AdminStats, AdminUser } from "@/types/api.types";

const mockSearchResults: SearchResult[] = [
  { id: "s1", type: "city", name: "Paris", country: "France", description: "The City of Lights — art, culture, cuisine, and romance", costIndex: "luxury", rating: 4.8, tags: ["Popular", "Culture"], imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80" },
  { id: "s2", type: "city", name: "Bali", country: "Indonesia", description: "Tropical paradise with temples, rice terraces, and surf", costIndex: "budget", rating: 4.7, tags: ["Budget-friendly", "Nature"], imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80" },
  { id: "s3", type: "city", name: "Tokyo", country: "Japan", description: "Ultra-modern meets traditional — a sensory overload", costIndex: "moderate", rating: 4.9, tags: ["Popular", "Food"], imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80" },
  { id: "s4", type: "city", name: "Dubai", country: "UAE", description: "Futuristic skyline, desert adventures, luxury shopping", costIndex: "luxury", rating: 4.5, tags: ["Luxury", "Shopping"], imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80" },
  { id: "s5", type: "city", name: "Jaipur", country: "India", description: "The Pink City — royal palaces and vibrant bazaars", costIndex: "budget", rating: 4.4, tags: ["Budget-friendly", "Heritage"], imageUrl: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400&q=80" },
  { id: "s6", type: "city", name: "New York", country: "USA", description: "The city that never sleeps — Broadway, Central Park, pizza", costIndex: "luxury", rating: 4.7, tags: ["Popular", "Nightlife"], imageUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&q=80" },
  { id: "s7", type: "activity", name: "Scuba Diving", country: "Multiple", description: "Explore coral reefs and marine life underwater", costIndex: "moderate", rating: 4.6, tags: ["Adventure", "Water"] },
  { id: "s8", type: "activity", name: "Hot Air Balloon Ride", country: "Turkey", description: "Soar over Cappadocia's fairy chimneys at sunrise", costIndex: "luxury", rating: 4.9, tags: ["Once-in-a-lifetime", "Views"] },
  { id: "s9", type: "activity", name: "Street Food Tour", country: "Multiple", description: "Taste authentic local flavours with expert guides", costIndex: "budget", rating: 4.5, tags: ["Budget-friendly", "Food"] },
  { id: "s10", type: "activity", name: "Trekking", country: "Nepal", description: "Himalayan trails with breathtaking mountain views", costIndex: "budget", rating: 4.8, tags: ["Adventure", "Nature"] },
];

export const mockAdmin = {
  getStats: async (): Promise<AdminStats> => {
    await new Promise((r) => setTimeout(r, 600));
    return {
      totalUsers: 1247,
      totalTrips: 3891,
      activeTrips: 342,
      popularDestinations: ["Paris", "Bali", "Tokyo", "Dubai", "New York"],
      tripsOverTime: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 86400000).toISOString().slice(0, 10),
        count: Math.floor(Math.random() * 40) + 10,
      })),
      tripsByStatus: [
        { status: "ongoing", count: 342 },
        { status: "upcoming", count: 1205 },
        { status: "completed", count: 2344 },
      ],
      topCities: [
        { city: "Paris", count: 487 },
        { city: "Bali", count: 412 },
        { city: "Tokyo", count: 389 },
        { city: "Dubai", count: 301 },
        { city: "New York", count: 278 },
      ],
    };
  },
  getUsers: async (): Promise<AdminUser[]> => {
    await new Promise((r) => setTimeout(r, 500));
    return [
      { id: "u1", name: "Gaurav Jain", email: "gaurav@test.com", tripsCount: 5, joinedDate: "2025-01-15", status: "active" },
      { id: "u2", name: "Ananya Sharma", email: "ananya@test.com", tripsCount: 3, joinedDate: "2025-02-20", status: "active" },
      { id: "u3", name: "Rohan Mehta", email: "rohan@test.com", tripsCount: 8, joinedDate: "2024-11-10", status: "active" },
      { id: "u4", name: "Priya Patel", email: "priya@test.com", tripsCount: 2, joinedDate: "2025-03-05", status: "active" },
      { id: "u5", name: "Arjun Singh", email: "arjun@test.com", tripsCount: 1, joinedDate: "2025-04-01", status: "suspended" },
    ];
  },
  search: async (query: string, type?: "city" | "activity"): Promise<SearchResult[]> => {
    await new Promise((r) => setTimeout(r, 400));
    const q = query.toLowerCase();
    return mockSearchResults.filter((r) => {
      const matchesType = !type || r.type === type;
      const matchesQuery = !q || r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.tags.some((t) => t.toLowerCase().includes(q));
      return matchesType && matchesQuery;
    });
  },
};
