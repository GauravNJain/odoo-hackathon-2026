"use client";

import { useState } from "react";
import Link from "next/link";
import { useTrips, useDeleteTrip } from "@/hooks/useTrips";
import { TripCard } from "@/components/trips/TripCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Map } from "lucide-react";
import { toast } from "sonner";
import type { TripStatus } from "@/types/trip.types";

export default function TripsPage() {
  const { data: trips, isLoading } = useTrips();
  const deleteMutation = useDeleteTrip();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = () => {
    if (!deleteId) return;
    deleteMutation.mutate(deleteId, {
      onSuccess: () => { toast.success("Trip deleted"); setDeleteId(null); },
      onError: () => toast.error("Failed to delete trip"),
    });
  };

  const filterByStatus = (status: TripStatus) => trips?.filter((t) => t.status === status) ?? [];

  const renderTrips = (status: TripStatus) => {
    if (isLoading) return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-64 rounded-lg" />)}
      </div>
    );
    const filtered = filterByStatus(status);
    if (filtered.length === 0) return (
      <EmptyState icon={<Map className="h-12 w-12" />} title={`No ${status} trips`} description={`You don't have any ${status} trips yet.`} />
    );
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((trip) => <TripCard key={trip.id} trip={trip} onDelete={setDeleteId} />)}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader title="My Trips" action={
        <Link href="/trips/new"><Button className="bg-brand-500 hover:bg-brand-600 text-white gap-2"><Plus className="h-4 w-4" /> New Trip</Button></Link>
      } />

      <Tabs defaultValue="ongoing">
        <TabsList>
          <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="ongoing" className="mt-4">{renderTrips("ongoing")}</TabsContent>
        <TabsContent value="upcoming" className="mt-4">{renderTrips("upcoming")}</TabsContent>
        <TabsContent value="completed" className="mt-4">{renderTrips("completed")}</TabsContent>
      </Tabs>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this trip?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. All itinerary data will be permanently removed.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-error hover:bg-error/90 text-white">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
