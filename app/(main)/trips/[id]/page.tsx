"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { format } from "date-fns";
import { useTrip } from "@/hooks/useTrips";
import { useItinerary } from "@/hooks/useItinerary";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Pencil, Share2, MapPin, Calendar, DollarSign } from "lucide-react";
import type { BudgetSummary, CategoryBreakdown } from "@/types/budget.types";

const BudgetCharts = dynamic(() => import("@/components/trips/BudgetChart"), { ssr: false });

export default function TripDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: trip, isLoading: tripLoading } = useTrip(id);
  const { data: itinerary, isLoading: itinLoading } = useItinerary(id);

  const budgetSummary = useMemo((): BudgetSummary | null => {
    if (!itinerary?.sections) return null;
    const totalBudget = itinerary.sections.reduce((s, sec) => s + sec.budget, 0);
    const allActivities = itinerary.sections.flatMap((s) => s.activities);
    const totalSpent = allActivities.reduce((s, a) => s + a.expense, 0);
    const cats: Record<string, number> = {};
    allActivities.forEach((a) => { cats[a.category] = (cats[a.category] ?? 0) + a.expense; });
    const colors: Record<string, string> = { transport: "#2B7EC1", stay: "#EE5A1F", food: "#2D9966", activities: "#D4860A", shopping: "#782215", other: "#9E9892" };
    const categoryBreakdown: CategoryBreakdown[] = Object.entries(cats).map(([cat, amount]) => ({
      category: cat as CategoryBreakdown["category"], amount, percentage: totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0, color: colors[cat] ?? "#9E9892",
    }));
    const days = itinerary.sections.reduce((s, sec) => {
      const d = (new Date(sec.endDate).getTime() - new Date(sec.startDate).getTime()) / 86400000;
      return s + Math.max(1, d);
    }, 0);
    return { totalBudget, totalSpent, remaining: totalBudget - totalSpent, currency: "INR", categoryBreakdown, dailySpend: [], averageCostPerDay: days > 0 ? Math.round(totalSpent / days) : 0 };
  }, [itinerary]);

  if (tripLoading || itinLoading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;
  if (!trip) return <div className="py-20 text-center text-ink-secondary">Trip not found</div>;

  const statusStyles: Record<string, string> = {
    ongoing: "bg-success/10 text-success border-success/20",
    upcoming: "bg-info/10 text-info border-info/20",
    completed: "bg-ink-tertiary/10 text-ink-secondary border-border-default",
  };

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-xl h-56 md:h-72">
        {trip.coverPhoto ? (
          <Image src={trip.coverPhoto} alt={trip.name} fill className="object-cover" sizes="100vw" priority />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-brand-200 to-brand-400" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <Badge className={`${statusStyles[trip.status]} border mb-2`}>{trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}</Badge>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white">{trip.name}</h1>
          <div className="mt-2 flex items-center gap-4 text-sm text-white/80">
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{trip.destination}</span>
            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{format(new Date(trip.startDate), "MMM d")} – {format(new Date(trip.endDate), "MMM d, yyyy")}</span>
          </div>
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
          <Link href={`/trips/${id}/build`}><Button size="sm" className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 gap-1"><Pencil className="h-3.5 w-3.5" />Edit</Button></Link>
          <Button size="sm" className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 gap-1"><Share2 className="h-3.5 w-3.5" />Share</Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="itinerary">
        <TabsList>
          <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="checklist"><Link href={`/trips/${id}/checklist`}>Checklist</Link></TabsTrigger>
          <TabsTrigger value="notes"><Link href={`/trips/${id}/notes`}>Notes</Link></TabsTrigger>
          <TabsTrigger value="invoice"><Link href={`/trips/${id}/invoice`}>Invoice</Link></TabsTrigger>
        </TabsList>

        <TabsContent value="itinerary" className="mt-6 space-y-6">
          {itinerary?.sections && itinerary.sections.length > 0 ? (
            itinerary.sections.map((section) => (
              <div key={section.id} className="rounded-lg border border-border-default bg-surface p-5 shadow-card">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-sans text-lg font-semibold text-ink-primary">{section.title || "Untitled Stop"}</h3>
                    <p className="text-xs text-ink-secondary">
                      {section.startDate && section.endDate ? `${format(new Date(section.startDate), "MMM d")} – ${format(new Date(section.endDate), "MMM d")}` : "Dates TBD"} · ₹{section.budget.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
                {section.activities.length > 0 ? (
                  <div className="relative ml-4 border-l-2 border-border-default pl-6 space-y-4">
                    {section.activities.map((act) => (
                      <div key={act.id} className="relative">
                        <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-brand-500 border-2 border-surface" />
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs text-ink-tertiary font-mono">Day {act.day}</span>
                            <p className="text-sm font-medium text-ink-primary">{act.name}</p>
                          </div>
                          <span className="text-sm font-medium text-ink-primary">₹{act.expense.toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-ink-tertiary ml-4">No activities added yet</p>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-ink-secondary">No itinerary built yet</p>
              <Link href={`/trips/${id}/build`}><Button className="mt-4 bg-brand-500 hover:bg-brand-600 text-white">Build Itinerary</Button></Link>
            </div>
          )}
        </TabsContent>

        <TabsContent value="budget" className="mt-6 space-y-6">
          {budgetSummary ? (
            <>
              <div className="rounded-lg border border-border-default bg-surface p-5 shadow-card">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-ink-secondary">Budget Usage</span>
                  <span className="text-sm font-medium">₹{budgetSummary.totalSpent.toLocaleString("en-IN")} / ₹{budgetSummary.totalBudget.toLocaleString("en-IN")}</span>
                </div>
                <Progress value={budgetSummary.totalBudget > 0 ? (budgetSummary.totalSpent / budgetSummary.totalBudget) * 100 : 0} className="h-3" />
                <div className="mt-3 grid grid-cols-3 gap-4 text-center">
                  <div><p className="text-xs text-ink-secondary">Total Budget</p><p className="text-lg font-bold text-ink-primary">₹{budgetSummary.totalBudget.toLocaleString("en-IN")}</p></div>
                  <div><p className="text-xs text-ink-secondary">Spent</p><p className="text-lg font-bold text-brand-500">₹{budgetSummary.totalSpent.toLocaleString("en-IN")}</p></div>
                  <div><p className="text-xs text-ink-secondary">Remaining</p><p className={`text-lg font-bold ${budgetSummary.remaining >= 0 ? "text-success" : "text-error"}`}>₹{budgetSummary.remaining.toLocaleString("en-IN")}</p></div>
                </div>
              </div>
              <BudgetCharts breakdown={budgetSummary.categoryBreakdown} avgPerDay={budgetSummary.averageCostPerDay} />
            </>
          ) : (
            <p className="text-center text-ink-secondary py-12">No budget data available</p>
          )}
        </TabsContent>
      </Tabs>

      {/* Floating edit button */}
      <Link href={`/trips/${id}/build`} className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-30 no-print">
        <Button className="h-12 w-12 rounded-full bg-brand-500 hover:bg-brand-600 text-white shadow-modal" aria-label="Edit itinerary">
          <Pencil className="h-5 w-5" />
        </Button>
      </Link>
    </div>
  );
}
