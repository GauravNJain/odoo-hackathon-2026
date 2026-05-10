import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { itineraryApi } from "@/lib/api/itinerary.api";
import type { SaveItineraryPayload } from "@/types/itinerary.types";

export const useItinerary = (tripId: string) =>
  useQuery({ queryKey: ["itinerary", tripId], queryFn: () => itineraryApi.getByTripId(tripId), enabled: !!tripId });

export const useSaveItinerary = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: SaveItineraryPayload) => itineraryApi.save(payload),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["itinerary", variables.tripId] });
      qc.invalidateQueries({ queryKey: ["trips"] });
    },
  });
};
