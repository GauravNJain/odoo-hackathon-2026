import { USE_MOCK } from "../config";
import { mockAdmin } from "../mock/admin.mock";
import type { AdminStats, AdminUser } from "@/types/api.types";

export const adminApi = {
  getStats: async (): Promise<AdminStats> => {
    if (USE_MOCK) return mockAdmin.getStats();
    throw new Error("Not implemented");
  },
  getUsers: async (): Promise<AdminUser[]> => {
    if (USE_MOCK) return mockAdmin.getUsers();
    throw new Error("Not implemented");
  },
};
