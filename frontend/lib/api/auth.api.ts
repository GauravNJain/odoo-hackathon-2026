import { API_BASE_URL, USE_MOCK, authHeaders } from "../config";
import { mockAuth } from "../mock/auth.mock";
import type { LoginPayload, RegisterPayload, AuthResponse, User } from "@/types/user.types";

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    if (USE_MOCK) return mockAuth.login(payload);
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Invalid credentials");
    const json = await res.json();
    return json.data;
  },
  register: async (payload: RegisterPayload): Promise<{ success: boolean; message: string }> => {
    if (USE_MOCK) return mockAuth.register(payload);
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Registration failed");
    return await res.json();
  },
  getProfile: async (): Promise<User> => {
    if (USE_MOCK) return mockAuth.getProfile();
    const res = await fetch(`${API_BASE_URL}/auth/profile`, { headers: authHeaders() });
    if (!res.ok) throw new Error("Failed to fetch profile");
    const json = await res.json();
    return json.data;
  },
  updateProfile: async (data: Partial<User>): Promise<User> => {
    if (USE_MOCK) return mockAuth.updateProfile(data);
    const res = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update profile");
    const json = await res.json();
    return json.data;
  },
};
