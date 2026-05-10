export interface TripNote {
  id: string;
  tripId: string;
  title: string;
  content: string;
  day?: number;
  stop?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotePayload {
  tripId: string;
  title: string;
  content: string;
  day?: number;
  stop?: string;
}
