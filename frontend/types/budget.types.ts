import type { ExpenseCategory } from "./itinerary.types";

export interface BudgetSummary {
  totalBudget: number;
  totalSpent: number;
  remaining: number;
  currency: string;
  categoryBreakdown: CategoryBreakdown[];
  dailySpend: DailySpend[];
  averageCostPerDay: number;
}

export interface CategoryBreakdown {
  category: ExpenseCategory;
  amount: number;
  percentage: number;
  color: string;
}

export interface DailySpend {
  date: string;
  amount: number;
  budget: number;
}

export interface InvoiceLineItem {
  id: string;
  category: ExpenseCategory;
  description: string;
  units: number;
  unitCost: number;
  amount: number;
}

export interface Invoice {
  id: string;
  tripId: string;
  tripName: string;
  travelerName: string;
  travelDates: string;
  status: "paid" | "unpaid" | "partial";
  subtotal: number;
  tax: number;
  grandTotal: number;
  lineItems: InvoiceLineItem[];
  currency: string;
  createdAt: string;
}
