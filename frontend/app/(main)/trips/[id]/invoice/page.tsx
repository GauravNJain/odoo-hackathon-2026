"use client";

import { useState, use, useMemo } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { useTrip } from "@/hooks/useTrips";
import { useItinerary } from "@/hooks/useItinerary";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Printer, Download, CheckCircle, Clock, Plane, Hotel, Utensils, MapPin, ShoppingBag, Package } from "lucide-react";

const catIcons: Record<string, React.ElementType> = { transport: Plane, stay: Hotel, food: Utensils, activities: MapPin, shopping: ShoppingBag, other: Package };
const catLabels: Record<string, string> = { transport: "Transport", stay: "Accommodation", food: "Food & Dining", activities: "Activities", shopping: "Shopping", other: "Other" };

export default function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: trip, isLoading: tl } = useTrip(id);
  const { data: itinerary, isLoading: il } = useItinerary(id);
  const [paid, setPaid] = useState(false);

  const lineItems = useMemo(() => {
    if (!itinerary?.sections) return [];
    return itinerary.sections.flatMap(s =>
      s.activities.map(a => ({
        id: a.id, category: a.category, description: a.name, units: 1, unitCost: a.expense, amount: a.expense, section: s.title,
      }))
    );
  }, [itinerary]);

  const catTotals = useMemo(() => {
    const m: Record<string, number> = {};
    lineItems.forEach(i => { m[i.category] = (m[i.category] ?? 0) + i.amount; });
    return Object.entries(m).map(([cat, total]) => ({ category: cat, total }));
  }, [lineItems]);

  const subtotal = lineItems.reduce((s, i) => s + i.amount, 0);
  const tax = 0;
  const grandTotal = subtotal + tax;
  const totalBudget = itinerary?.sections.reduce((s, sec) => s + sec.budget, 0) ?? 0;

  if (tl || il) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;
  if (!trip) return <div className="py-20 text-center text-ink-secondary">Trip not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between no-print">
        <Link href={`/trips/${id}`} className="inline-flex items-center gap-1 text-sm text-ink-secondary hover:text-ink-primary">
          <ArrowLeft className="h-4 w-4" /> Back to Trip
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-1"><Printer className="h-3.5 w-3.5" />Print</Button>
          <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-1"><Download className="h-3.5 w-3.5" />Export PDF</Button>
          <Button size="sm" onClick={() => setPaid(!paid)} className={paid ? "bg-success hover:bg-success/90 text-white gap-1" : "bg-brand-500 hover:bg-brand-600 text-white gap-1"}>
            {paid ? <><CheckCircle className="h-3.5 w-3.5" />Paid</> : <><Clock className="h-3.5 w-3.5" />Mark as Paid</>}
          </Button>
        </div>
      </div>

      {/* Invoice document */}
      <div className="rounded-lg border border-border-default bg-surface shadow-card overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-500 to-brand-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🌍</span>
              <span className="font-display text-2xl font-bold">Traveloop</span>
            </div>
            <Badge className={`text-sm ${paid ? "bg-success/20 text-white border-white/30" : "bg-white/20 text-white border-white/30"}`}>
              {paid ? "PAID" : "UNPAID"}
            </Badge>
          </div>
          <h2 className="mt-4 text-xl font-semibold">Travel Expense Invoice</h2>
        </div>

        {/* Trip info */}
        <div className="p-6 border-b border-border-default">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div><span className="text-ink-tertiary">Trip</span><p className="font-medium text-ink-primary">{trip.name}</p></div>
            <div><span className="text-ink-tertiary">Traveler</span><p className="font-medium text-ink-primary">Gaurav Jain</p></div>
            <div><span className="text-ink-tertiary">Dates</span><p className="font-medium text-ink-primary">{format(new Date(trip.startDate), "MMM d")} – {format(new Date(trip.endDate), "MMM d, yyyy")}</p></div>
            <div><span className="text-ink-tertiary">Destination</span><p className="font-medium text-ink-primary">{trip.destination}</p></div>
          </div>
        </div>

        {/* Budget summary */}
        <div className="p-6 border-b border-border-default">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="rounded-lg bg-canvas p-3"><p className="text-xs text-ink-tertiary">Total Budget</p><p className="text-lg font-bold text-ink-primary">₹{totalBudget.toLocaleString("en-IN")}</p></div>
            <div className="rounded-lg bg-canvas p-3"><p className="text-xs text-ink-tertiary">Total Spent</p><p className="text-lg font-bold text-brand-500">₹{subtotal.toLocaleString("en-IN")}</p></div>
            <div className="rounded-lg bg-canvas p-3"><p className="text-xs text-ink-tertiary">Remaining</p><p className={`text-lg font-bold ${totalBudget - subtotal >= 0 ? "text-success" : "text-error"}`}>₹{(totalBudget - subtotal).toLocaleString("en-IN")}</p></div>
          </div>
        </div>

        {/* Line items table */}
        <div className="p-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-default text-left text-xs text-ink-tertiary">
                <th className="pb-2 pr-2">#</th>
                <th className="pb-2 pr-2">Category</th>
                <th className="pb-2 pr-2">Description</th>
                <th className="pb-2 pr-2">Section</th>
                <th className="pb-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item, i) => {
                const Icon = catIcons[item.category] ?? Package;
                return (
                  <tr key={item.id} className="border-b border-border-default/50">
                    <td className="py-2 pr-2 text-ink-tertiary">{i + 1}</td>
                    <td className="py-2 pr-2"><span className="flex items-center gap-1.5"><Icon className="h-3.5 w-3.5 text-ink-secondary" />{catLabels[item.category] ?? item.category}</span></td>
                    <td className="py-2 pr-2 text-ink-primary">{item.description}</td>
                    <td className="py-2 pr-2 text-ink-secondary text-xs">{item.section}</td>
                    <td className="py-2 text-right font-medium">₹{item.amount.toLocaleString("en-IN")}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Category subtotals */}
          <div className="mt-4 pt-4 border-t border-border-default space-y-1">
            {catTotals.map(ct => (
              <div key={ct.category} className="flex justify-between text-sm">
                <span className="text-ink-secondary">{catLabels[ct.category] ?? ct.category} subtotal</span>
                <span className="font-medium">₹{ct.total.toLocaleString("en-IN")}</span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-4 pt-4 border-t-2 border-border-strong space-y-2">
            <div className="flex justify-between text-sm"><span className="text-ink-secondary">Subtotal</span><span className="font-medium">₹{subtotal.toLocaleString("en-IN")}</span></div>
            <div className="flex justify-between text-sm"><span className="text-ink-secondary">Taxes</span><span className="font-medium">₹{tax}</span></div>
            <div className="flex justify-between text-lg font-bold"><span>Grand Total</span><span className="text-brand-500">₹{grandTotal.toLocaleString("en-IN")}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
