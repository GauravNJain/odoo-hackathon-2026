import type { User, LoginPayload, RegisterPayload, AuthResponse } from "@/types/user.types";

const MOCK_USER: User = {
  id: "user-1",
  firstName: "Gaurav",
  lastName: "Jain",
  email: "gaurav@traveloop.com",
  phone: "9876543210",
  city: "Mumbai",
  country: "India",
  role: "admin",
  savedDestinations: ["Paris", "Tokyo", "Bali", "New York", "Dubai"],
  createdAt: "2025-01-15T10:00:00Z",
};

export const mockAuth = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    await new Promise((r) => setTimeout(r, 800));
    return {
      token: "mock-jwt-token-" + Date.now(),
      user: { ...MOCK_USER, email: payload.email },
    };
  },

  register: async (_payload: RegisterPayload): Promise<{ success: boolean; message: string }> => {
    await new Promise((r) => setTimeout(r, 1000));
    return { success: true, message: "Registration successful!" };
  },

  getProfile: async (): Promise<User> => {
    await new Promise((r) => setTimeout(r, 400));
    return { ...MOCK_USER };
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    await new Promise((r) => setTimeout(r, 600));
    return { ...MOCK_USER, ...data };
  },
};
