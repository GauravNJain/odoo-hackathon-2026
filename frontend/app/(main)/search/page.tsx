"use client";

import { useState, useEffect, useCallback } from "react";
import { searchApi } from "@/lib/api/search.api";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Star, Plus, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useTrips } from "@/hooks/useTrips";
import type { SearchResult } from "@/types/api.types";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"city" | "activity">("city");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [addToTripId, setAddToTripId] = useState<string | null>(null);
  const { data: trips } = useTrips();

  const doSearch = useCallback(async (q: string, t: "city" | "activity") => {
    setLoading(true);
    try {
      const r = await searchApi.search(q, t);
      setResults(r);
    } catch { setResults([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => { doSearch(query, tab); }, 300);
    return () => clearTimeout(timer);
  }, [query, tab, doSearch]);

  const costColors = { budget: "bg-success/10 text-success", moderate: "bg-warning/10 text-warning", luxury: "bg-brand-100 text-brand-700" };

  return (
    <div className="space-y-6">
      <PageHeader title="Explore" subtitle="Discover destinations and activities" />

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-tertiary" />
        <Input className="pl-12 py-6 text-base" placeholder="Search destinations, activities..." value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as "city" | "activity")}>
        <div className="flex items-center justify-between">
          <TabsList><TabsTrigger value="city">Cities</TabsTrigger><TabsTrigger value="activity">Activities</TabsTrigger></TabsList>
          <span className="text-sm text-ink-secondary">{results.length} results</span>
        </div>

        <TabsContent value="city" className="mt-4">
          {loading ? <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-28 rounded-lg" />)}</div>
          : results.length === 0 ? <EmptyState icon={<MapPin className="h-12 w-12" />} title="No results" description="Try a different search term" />
          : <div className="space-y-3">{results.map(r => (
            <div key={r.id} className="flex items-center gap-4 rounded-lg border border-border-default bg-surface p-4 shadow-card hover:shadow-card-hover transition-shadow">
              <div className="flex-1">
                <h3 className="font-sans text-base font-semibold text-ink-primary">{r.name}</h3>
                <p className="text-xs text-ink-secondary">{r.country}</p>
                <p className="text-sm text-ink-secondary mt-1 line-clamp-1">{r.description}</p>
                <div className="mt-2 flex items-center gap-2">
                  <Badge className={`${costColors[r.costIndex]} text-xs border-0`}>{r.costIndex}</Badge>
                  <span className="flex items-center gap-0.5 text-xs text-warning"><Star className="h-3 w-3 fill-current" />{r.rating}</span>
                  {r.tags.map(t => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}
                </div>
              </div>
              <Button size="sm" variant="outline" className="gap-1 shrink-0" onClick={() => setAddToTripId(r.id)}>
                <Plus className="h-3.5 w-3.5" />Add to Trip
              </Button>
            </div>
          ))}</div>}
        </TabsContent>
        <TabsContent value="activity" className="mt-4">
          {loading ? <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-28 rounded-lg" />)}</div>
          : results.length === 0 ? <EmptyState icon={<MapPin className="h-12 w-12" />} title="No results" />
          : <div className="space-y-3">{results.map(r => (
            <div key={r.id} className="flex items-center gap-4 rounded-lg border border-border-default bg-surface p-4 shadow-card hover:shadow-card-hover transition-shadow">
              <div className="flex-1">
                <h3 className="font-sans text-base font-semibold text-ink-primary">{r.name}</h3>
                <p className="text-sm text-ink-secondary mt-1 line-clamp-1">{r.description}</p>
                <div className="mt-2 flex items-center gap-2">
                  <Badge className={`${costColors[r.costIndex]} text-xs border-0`}>{r.costIndex}</Badge>
                  <span className="flex items-center gap-0.5 text-xs text-warning"><Star className="h-3 w-3 fill-current" />{r.rating}</span>
                </div>
              </div>
              <Button size="sm" variant="outline" className="gap-1 shrink-0" onClick={() => setAddToTripId(r.id)}>
                <Plus className="h-3.5 w-3.5" />Add
              </Button>
            </div>
          ))}</div>}
        </TabsContent>
      </Tabs>

      {/* Add to trip dialog */}
      <Dialog open={!!addToTripId} onOpenChange={() => setAddToTripId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add to which trip?</DialogTitle></DialogHeader>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {trips?.map(t => (
              <button key={t.id} className="w-full text-left rounded-lg border border-border-default p-3 hover:bg-surface-hover transition-colors"
                onClick={() => { toast.success(`Added to "${t.name}"`); setAddToTripId(null); }}>
                <p className="font-medium text-sm text-ink-primary">{t.name}</p>
                <p className="text-xs text-ink-secondary">{t.destination}</p>
              </button>
            ))}
            {(!trips || trips.length === 0) && <p className="text-sm text-ink-secondary text-center py-4">No trips yet. Create one first!</p>}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
