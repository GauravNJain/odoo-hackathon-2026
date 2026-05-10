"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useCreateTrip } from "@/hooks/useTrips";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";

const tripSchema = z.object({
  name: z.string().min(1, "Trip name is required"),
  destination: z.string().min(1, "Destination is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  description: z.string().optional(),
}).refine((d) => new Date(d.endDate) >= new Date(d.startDate), {
  message: "End date must be after start date", path: ["endDate"],
});

type TripForm = z.infer<typeof tripSchema>;

const suggestedPlaces = [
  { name: "Paris, France", emoji: "🗼" },
  { name: "Bali, Indonesia", emoji: "🌴" },
  { name: "Tokyo, Japan", emoji: "⛩️" },
  { name: "New York, USA", emoji: "🗽" },
  { name: "Dubai, UAE", emoji: "🏙️" },
  { name: "Jaipur, India", emoji: "🕌" },
];

export default function CreateTripPage() {
  const router = useRouter();
  const createMutation = useCreateTrip();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<TripForm>({ resolver: zodResolver(tripSchema) });

  const onSubmit = async (data: TripForm) => {
    try {
      const trip = await createMutation.mutateAsync(data);
      toast.success("Trip created!");
      router.push(`/trips/${trip.id}/build`);
    } catch {
      toast.error("Failed to create trip");
    }
  };

  return (
    <div className="space-y-6">
      <Link href="/trips" className="inline-flex items-center gap-1 text-sm text-ink-secondary hover:text-ink-primary">
        <ArrowLeft className="h-4 w-4" /> Back to Trips
      </Link>

      <h1 className="font-display text-3xl font-semibold text-ink-primary">Plan a new trip</h1>

      <div className="mx-auto max-w-2xl">
        <div className="rounded-lg border border-border-default bg-surface p-6 shadow-card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div className="space-y-2">
              <Label htmlFor="name">Trip Name *</Label>
              <Input id="name" placeholder="e.g. European Summer Adventure" {...register("name")} className={errors.name ? "border-error" : ""} />
              {errors.name && <p className="text-xs text-error">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination">Destination *</Label>
              <Input id="destination" placeholder="e.g. Paris, France" {...register("destination")} className={errors.destination ? "border-error" : ""} />
              {errors.destination && <p className="text-xs text-error">{errors.destination.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input id="startDate" type="date" {...register("startDate")} className={errors.startDate ? "border-error" : ""} />
                {errors.startDate && <p className="text-xs text-error">{errors.startDate.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input id="endDate" type="date" {...register("endDate")} className={errors.endDate ? "border-error" : ""} />
                {errors.endDate && <p className="text-xs text-error">{errors.endDate.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="What's this trip about?" rows={3} {...register("description")} />
            </div>

            <Button type="submit" className="w-full bg-brand-500 hover:bg-brand-600 text-white" disabled={createMutation.isPending}>
              {createMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</> : "Create Trip & Build Itinerary →"}
            </Button>
          </form>
        </div>

        {/* Suggested Places */}
        <div className="mt-8">
          <h2 className="font-sans text-lg font-semibold text-ink-primary mb-3">Suggested Places</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {suggestedPlaces.map((p) => (
              <button key={p.name} type="button" onClick={() => setValue("destination", p.name)}
                className="flex items-center gap-2 rounded-lg border border-border-default bg-surface p-3 text-left transition-colors hover:bg-surface-hover hover:border-brand-300">
                <span className="text-2xl">{p.emoji}</span>
                <span className="text-sm font-medium text-ink-primary">{p.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
