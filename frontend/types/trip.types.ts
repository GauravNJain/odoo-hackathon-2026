export type TripStatus = "ongoing" | "upcoming" | "completed";

export interface Trip {
  id: string;
  name: string;
  destination: string;
  description?: string;
  coverPhoto?: string;
  startDate: string;
  endDate: string;
  status: TripStatus;
  totalBudget: number;
  currency: string;
  stopsCount: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTripPayload {
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  description?: string;
  coverPhoto?: string;
}
