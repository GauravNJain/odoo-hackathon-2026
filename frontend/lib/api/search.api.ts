import { USE_MOCK } from "../config";
import { mockAdmin } from "../mock/admin.mock";
import type { SearchResult } from "@/types/api.types";

export const searchApi = {
  search: async (query: string, type?: "city" | "activity"): Promise<SearchResult[]> => {
    if (USE_MOCK) return mockAdmin.search(query, type);
    return [];
  },
};
