"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, DollarSign, Eye, Pencil, Trash2 } from "lucide-react";
import type { Trip } from "@/types/trip.types";

interface TripCardProps {
  trip: Trip;
  onDelete?: (id: string) => void;
  compact?: boolean;
}

function TripCardComponent({ trip, onDelete, compact }: TripCardProps) {
  const statusStyles = {
    ongoing: "bg-success/10 text-success border-success/20",
    upcoming: "bg-info/10 text-info border-info/20",
    completed: "bg-ink-tertiary/10 text-ink-secondary border-border-default",
  };

  const fmtDate = (d: string) => {
    try { return format(new Date(d), "MMM d, yyyy"); } catch { return d; }
  };

  return (
    <div className={cn(
      "group relative overflow-hidden rounded-lg border border-border-default bg-surface shadow-card transition-shadow duration-200 hover:shadow-card-hover",
      compact ? "w-72 shrink-0" : ""
    )}>
      {/* Cover image */}
      <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-brand-100 to-brand-200">
        {trip.coverPhoto && (
          <Image
            src={trip.coverPhoto}
            alt={trip.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white">
          <MapPin className="h-4 w-4" />
          <span className="text-sm font-medium">{trip.destination}</span>
        </div>
        <Badge className={cn("absolute right-3 top-3 border text-xs", statusStyles[trip.status])}>
          {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-sans text-base font-semibold text-ink-primary line-clamp-1">{trip.name}</h3>

        <div className="mt-2 flex items-center gap-3 text-xs text-ink-secondary">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {fmtDate(trip.startDate)} – {fmtDate(trip.endDate)}
          </span>
        </div>

        <div className="mt-2 flex items-center gap-3 text-xs text-ink-secondary">
          <span>{trip.stopsCount} stops</span>
          <span className="flex items-center gap-1">
            <DollarSign className="h-3.5 w-3.5" />
            ₹{trip.totalBudget.toLocaleString("en-IN")}
          </span>
        </div>

        {!compact && (
          <div className="mt-3 flex items-center gap-2">
            <Link href={`/trips/${trip.id}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs">
                <Eye className="h-3.5 w-3.5" /> View
              </Button>
            </Link>
            <Link href={`/trips/${trip.id}/build`}>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            </Link>
            {onDelete && (
              <Button variant="outline" size="sm" className="gap-1.5 text-xs text-error hover:text-error" onClick={() => onDelete(trip.id)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export const TripCard = React.memo(TripCardComponent);
