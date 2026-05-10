export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SearchResult {
  id: string;
  type: "city" | "activity";
  name: string;
  country?: string;
  description: string;
  costIndex: "budget" | "moderate" | "luxury";
  rating: number;
  tags: string[];
  imageUrl?: string;
}

export interface AdminStats {
  totalUsers: number;
  totalTrips: number;
  activeTrips: number;
  popularDestinations: string[];
  tripsOverTime: { date: string; count: number }[];
  tripsByStatus: { status: string; count: number }[];
  topCities: { city: string; count: number }[];
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  tripsCount: number;
  joinedDate: string;
  status: "active" | "suspended";
}
