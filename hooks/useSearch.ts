import { useQuery } from "@tanstack/react-query";
import { searchApi } from "@/lib/api/search.api";

export const useSearch = (query: string, type?: "city" | "activity") =>
  useQuery({
    queryKey: ["search", query, type],
    queryFn: () => searchApi.search(query, type),
    enabled: query.length > 0,
  });
