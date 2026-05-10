import type { ChecklistItem, CreateChecklistItemPayload } from "@/types/checklist.types";

const mockChecklistData: Record<string, ChecklistItem[]> = {
  "trip-1": [
    { id: "cl-1", tripId: "trip-1", name: "Passport", category: "documents", isChecked: true, createdAt: "2025-05-01T10:00:00Z" },
    { id: "cl-2", tripId: "trip-1", name: "Travel Insurance", category: "documents", isChecked: true, createdAt: "2025-05-01T10:01:00Z" },
    { id: "cl-3", tripId: "trip-1", name: "Visa Documents", category: "documents", isChecked: false, createdAt: "2025-05-01T10:02:00Z" },
    { id: "cl-4", tripId: "trip-1", name: "Phone Charger", category: "electronics", isChecked: true, createdAt: "2025-05-01T10:03:00Z" },
    { id: "cl-5", tripId: "trip-1", name: "Power Adapter (EU)", category: "electronics", isChecked: false, createdAt: "2025-05-01T10:04:00Z" },
    { id: "cl-6", tripId: "trip-1", name: "T-shirts (5)", category: "clothing", isChecked: true, createdAt: "2025-05-01T10:06:00Z" },
    { id: "cl-7", tripId: "trip-1", name: "Jacket", category: "clothing", isChecked: false, createdAt: "2025-05-01T10:07:00Z" },
    { id: "cl-8", tripId: "trip-1", name: "Sunscreen SPF 50", category: "toiletries", isChecked: false, createdAt: "2025-05-01T10:09:00Z" },
    { id: "cl-9", tripId: "trip-1", name: "Paracetamol", category: "medicines", isChecked: false, createdAt: "2025-05-01T10:11:00Z" },
    { id: "cl-10", tripId: "trip-1", name: "Travel Pillow", category: "other", isChecked: false, createdAt: "2025-05-01T10:13:00Z" },
  ],
};

export const mockChecklist = {
  getByTripId: async (tripId: string): Promise<ChecklistItem[]> => {
    await new Promise((r) => setTimeout(r, 400));
    return [...(mockChecklistData[tripId] ?? [])];
  },
  addItem: async (payload: CreateChecklistItemPayload): Promise<ChecklistItem> => {
    await new Promise((r) => setTimeout(r, 300));
    const item: ChecklistItem = { id: "cl-" + Date.now(), ...payload, isChecked: false, createdAt: new Date().toISOString() };
    if (!mockChecklistData[payload.tripId]) mockChecklistData[payload.tripId] = [];
    mockChecklistData[payload.tripId].push(item);
    return item;
  },
  toggleItem: async (tripId: string, itemId: string): Promise<ChecklistItem> => {
    await new Promise((r) => setTimeout(r, 200));
    const items = mockChecklistData[tripId] ?? [];
    const idx = items.findIndex((i) => i.id === itemId);
    if (idx === -1) throw new Error("Item not found");
    items[idx] = { ...items[idx], isChecked: !items[idx].isChecked };
    return { ...items[idx] };
  },
  deleteItem: async (tripId: string, itemId: string): Promise<void> => {
    await new Promise((r) => setTimeout(r, 200));
    if (mockChecklistData[tripId]) {
      mockChecklistData[tripId] = mockChecklistData[tripId].filter((i) => i.id !== itemId);
    }
  },
  resetAll: async (tripId: string): Promise<ChecklistItem[]> => {
    await new Promise((r) => setTimeout(r, 300));
    if (mockChecklistData[tripId]) {
      mockChecklistData[tripId] = mockChecklistData[tripId].map((i) => ({ ...i, isChecked: false }));
    }
    return [...(mockChecklistData[tripId] ?? [])];
  },
};
