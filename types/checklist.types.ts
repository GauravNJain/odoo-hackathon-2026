export type ChecklistCategory =
  | "clothing"
  | "documents"
  | "electronics"
  | "toiletries"
  | "medicines"
  | "other";

export interface ChecklistItem {
  id: string;
  tripId: string;
  name: string;
  category: ChecklistCategory;
  isChecked: boolean;
  createdAt: string;
}

export interface CreateChecklistItemPayload {
  tripId: string;
  name: string;
  category: ChecklistCategory;
}
