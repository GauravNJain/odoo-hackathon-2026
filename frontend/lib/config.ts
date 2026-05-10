export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

const TOKEN_KEY = "auth_token";
const USER_KEY = "traveloop_user";

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
};

export const getStoredUser = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(USER_KEY);
};

export const setStoredUser = (user: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, user);
};

export const removeStoredUser = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_KEY);
};

export const authHeaders = (): HeadersInit => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken() ?? ""}`,
});

export const clearAuth = (): void => {
  removeToken();
  removeStoredUser();
};
