"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useTrips } from "@/hooks/useTrips";
import { TripCard } from "@/components/trips/TripCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, MapPin, Globe, Calendar, Search } from "lucide-react";
import type { Metadata } from "next";

const destinations = [
  { name: "Paris", country: "France", tag: "Popular", img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80" },
  { name: "Bali", country: "Indonesia", tag: "Budget-friendly", img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80" },
  { name: "Tokyo", country: "Japan", tag: "Popular", img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80" },
  { name: "Dubai", country: "UAE", tag: "Luxury", img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80" },
  { name: "New York", country: "USA", tag: "Popular", img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&q=80" },
  { name: "Jaipur", country: "India", tag: "Heritage", img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400&q=80" },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: trips, isLoading } = useTrips();

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const completedTrips = trips?.filter((t) => t.status === "completed") ?? [];
  const countries = new Set(trips?.map((t) => t.destination?.split(",").pop()?.trim()).filter(Boolean) ?? []);
  const totalDays = trips?.reduce((sum, t) => {
    const d = (new Date(t.endDate).getTime() - new Date(t.startDate).getTime()) / 86400000;
    return sum + Math.max(0, d);
  }, 0) ?? 0;

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <h1 className="font-display text-3xl font-bold text-ink-primary">
        {getGreeting()}, {user?.firstName ?? "Traveler"} 🗻
      </h1>

      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-xl h-56 md:h-64">
        <Image
          src="/images/fuji.png"
          alt="Travel banner"
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1280px) 100vw, 1200px"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-900/60 to-transparent" />
        <div className="relative z-10 flex h-full flex-col justify-center p-6 md:p-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">Where to next?</h2>
          <p className="mt-2 max-w-md text-white/80">Discover new destinations and plan your perfect trip</p>
          <Link href="/trips/new" className="mt-4 w-fit">
            <Button className="bg-white text-brand-700 hover:bg-white/90 font-semibold gap-2">
              <Plus className="h-4 w-4" /> Plan a Trip
            </Button>
          </Link>
        </div>
      </div>

      {/* Search bar */}
      <Link href="/search" className="block">
        <div className="flex items-center gap-3 rounded-lg border border-border-default bg-surface px-4 py-3 shadow-card transition-shadow hover:shadow-card-hover cursor-pointer">
          <Search className="h-5 w-5 text-ink-tertiary" />
          <span className="text-sm text-ink-tertiary">Search destinations, activities...</span>
        </div>
      </Link>

      {/* Top Regional Selections */}
      <section>
        <h2 className="font-sans text-xl font-semibold text-ink-primary mb-4">Top Destinations</h2>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {destinations.map((d) => (
            <Link key={d.name} href={`/search?q=${encodeURIComponent(d.name)}`} className="shrink-0">
              <div className="group relative w-44 overflow-hidden rounded-lg">
                <div className="relative h-56">
                  <Image src={d.img} alt={d.name} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="176px" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="absolute bottom-0 p-3 text-white">
                  <p className="font-semibold text-sm">{d.name}</p>
                  <p className="text-xs text-white/70">{d.country}</p>
                  <span className="mt-1 inline-block rounded-full bg-white/20 px-2 py-0.5 text-[10px] backdrop-blur-sm">{d.tag}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Previous Trips */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-sans text-xl font-semibold text-ink-primary">Your Trips</h2>
          <Link href="/trips" className="text-sm text-brand-500 hover:text-brand-600 font-medium">View all →</Link>
        </div>
        {isLoading ? (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-72 shrink-0 space-y-3">
                <Skeleton className="h-40 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : trips && trips.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} compact />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<MapPin className="h-12 w-12" />}
            title="No trips yet"
            description="Start planning your first adventure!"
            actionLabel="+ Plan a Trip"
            onAction={() => window.location.href = "/trips/new"}
          />
        )}
      </section>

      {/* Stats */}
      <section className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Trips", value: trips?.length ?? 0, icon: MapPin },
          { label: "Countries", value: countries.size, icon: Globe },
          { label: "Days Traveled", value: Math.round(totalDays), icon: Calendar },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border border-border-default bg-surface p-4 shadow-card">
            <div className="flex items-center gap-2 text-ink-secondary">
              <stat.icon className="h-4 w-4" />
              <span className="text-xs font-medium">{stat.label}</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-ink-primary">{stat.value}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
