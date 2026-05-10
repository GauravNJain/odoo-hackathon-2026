import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tripsApi } from "@/lib/api/trips.api";
import type { CreateTripPayload, Trip } from "@/types/trip.types";

export const useTrips = () =>
  useQuery({ queryKey: ["trips"], queryFn: tripsApi.getAll });

export const useTrip = (id: string) =>
  useQuery({ queryKey: ["trips", id], queryFn: () => tripsApi.getById(id), enabled: !!id });

export const useCreateTrip = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTripPayload) => tripsApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["trips"] }),
  });
};

export const useUpdateTrip = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Trip> }) => tripsApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["trips"] }),
  });
};

export const useDeleteTrip = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tripsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["trips"] }),
  });
};
