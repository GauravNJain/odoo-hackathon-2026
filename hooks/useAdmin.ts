import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/api/admin.api";

export const useAdminStats = () =>
  useQuery({ queryKey: ["admin", "stats"], queryFn: adminApi.getStats });

export const useAdminUsers = () =>
  useQuery({ queryKey: ["admin", "users"], queryFn: adminApi.getUsers });
