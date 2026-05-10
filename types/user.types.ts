export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  city?: string;
  country?: string;
  additionalInfo?: string;
  avatarUrl?: string;
  role: "user" | "admin";
  savedDestinations?: string[];
  createdAt: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  city: string;
  country: string;
  additionalInfo?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
