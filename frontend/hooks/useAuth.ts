"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/types/user.types";
import { clearAuth, getStoredUser, getToken, setStoredUser, setToken } from "@/lib/config";

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    const stored = getStoredUser();
    if (token && stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        clearAuth();
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(
    (token: string, userData: User) => {
      setToken(token);
      setStoredUser(JSON.stringify(userData));
      setUser(userData);
      router.push("/dashboard");
    },
    [router],
  );

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
    router.push("/login");
  }, [router]);

  const updateUser = useCallback((userData: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...userData };
      setStoredUser(JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isAuthenticated = !!user && !!getToken();

  return { user, isAuthenticated, isLoading, login, logout, updateUser };
}
