export interface ItinerarySection {
  id: string;
  tripId: string;
  order: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
  currency: string;
  activities: ItineraryActivity[];
}

export interface ItineraryActivity {
  id: string;
  sectionId: string;
  day: number;
  name: string;
  description?: string;
  expense: number;
  category: ExpenseCategory;
  time?: string;
}

export type ExpenseCategory =
  | "transport"
  | "stay"
  | "food"
  | "activities"
  | "shopping"
  | "other";

export interface Itinerary {
  id: string;
  tripId: string;
  sections: ItinerarySection[];
  createdAt: string;
  updatedAt: string;
}

export interface SaveItineraryPayload {
  tripId: string;
  sections: Omit<ItinerarySection, "id" | "tripId">[];
}
