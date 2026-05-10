import type { TripNote, CreateNotePayload } from "@/types/notes.types";

const mockNotesData: Record<string, TripNote[]> = {
  "trip-1": [
    { id: "note-1", tripId: "trip-1", title: "Restaurant Recommendations", content: "Café de Flore for breakfast, Le Comptoir du Panthéon for lunch. Book 2 days ahead!", day: 2, stop: "Paris, France", createdAt: "2025-05-02T10:00:00Z", updatedAt: "2025-05-02T10:00:00Z" },
    { id: "note-2", tripId: "trip-1", title: "Amsterdam Museum Pass", content: "Get the I Amsterdam City Card — covers most museums and public transport. Worth it for 3+ days.", stop: "Amsterdam, Netherlands", createdAt: "2025-05-03T14:00:00Z", updatedAt: "2025-05-03T14:00:00Z" },
    { id: "note-3", tripId: "trip-1", title: "Packing Note", content: "Pack layers — Switzerland will be cold even in June. Bring a rain jacket.", createdAt: "2025-05-01T08:00:00Z", updatedAt: "2025-05-01T08:00:00Z" },
  ],
};

export const mockNotes = {
  getByTripId: async (tripId: string): Promise<TripNote[]> => {
    await new Promise((r) => setTimeout(r, 400));
    return [...(mockNotesData[tripId] ?? [])];
  },
  create: async (payload: CreateNotePayload): Promise<TripNote> => {
    await new Promise((r) => setTimeout(r, 500));
    const note: TripNote = { id: "note-" + Date.now(), ...payload, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    if (!mockNotesData[payload.tripId]) mockNotesData[payload.tripId] = [];
    mockNotesData[payload.tripId].unshift(note);
    return note;
  },
  update: async (tripId: string, noteId: string, data: Partial<TripNote>): Promise<TripNote> => {
    await new Promise((r) => setTimeout(r, 400));
    const notes = mockNotesData[tripId] ?? [];
    const idx = notes.findIndex((n) => n.id === noteId);
    if (idx === -1) throw new Error("Note not found");
    notes[idx] = { ...notes[idx], ...data, updatedAt: new Date().toISOString() };
    return { ...notes[idx] };
  },
  delete: async (tripId: string, noteId: string): Promise<void> => {
    await new Promise((r) => setTimeout(r, 300));
    if (mockNotesData[tripId]) {
      mockNotesData[tripId] = mockNotesData[tripId].filter((n) => n.id !== noteId);
    }
  },
};
