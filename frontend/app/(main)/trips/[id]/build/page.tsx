"use client";

import { useCallback, useEffect, useReducer, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useTrip } from "@/hooks/useTrips";
import { useItinerary, useSaveItinerary } from "@/hooks/useItinerary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ArrowLeft, GripVertical, Plus, Trash2, Loader2, Save } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface BuilderSection {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
}

type Action =
  | { type: "SET"; sections: BuilderSection[] }
  | { type: "ADD" }
  | { type: "REMOVE"; id: string }
  | { type: "UPDATE"; id: string; field: keyof BuilderSection; value: string | number }
  | { type: "REORDER"; activeId: string; overId: string };

const newSection = (): BuilderSection => ({
  id: "s-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
  title: "",
  description: "",
  startDate: "",
  endDate: "",
  budget: 0,
});

function reducer(state: BuilderSection[], action: Action): BuilderSection[] {
  switch (action.type) {
    case "SET":
      return action.sections;
    case "ADD":
      return [...state, newSection()];
    case "REMOVE":
      return state.length <= 1 ? state : state.filter((s) => s.id !== action.id);
    case "UPDATE":
      return state.map((s) => s.id === action.id ? { ...s, [action.field]: action.value } : s);
    case "REORDER": {
      const oldIdx = state.findIndex((s) => s.id === action.activeId);
      const newIdx = state.findIndex((s) => s.id === action.overId);
      return oldIdx === -1 || newIdx === -1 ? state : arrayMove(state, oldIdx, newIdx);
    }
    default:
      return state;
  }
}

function SortableSection({
  section, index, total, dispatch,
}: {
  section: BuilderSection; index: number; total: number;
  dispatch: React.Dispatch<Action>;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: section.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="rounded-lg border border-border-default bg-surface p-5 shadow-card">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center h-7 w-auto px-2 rounded-full bg-brand-100 text-brand-700 text-xs font-semibold">
            Stop {index + 1}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button {...attributes} {...listeners} className="cursor-grab p-1 text-ink-tertiary hover:text-ink-secondary" aria-label="Drag to reorder">
            <GripVertical className="h-5 w-5" />
          </button>
          {total > 1 && (
            <button onClick={() => dispatch({ type: "REMOVE", id: section.id })} className="p-1 text-ink-tertiary hover:text-error" aria-label="Remove section">
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <Label className="text-xs">Section Title</Label>
          <Input placeholder="e.g. Paris, France" value={section.title} onChange={(e) => dispatch({ type: "UPDATE", id: section.id, field: "title", value: e.target.value })} />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Description</Label>
          <Textarea placeholder="What will you do here?" rows={2} value={section.description} onChange={(e) => dispatch({ type: "UPDATE", id: section.id, field: "description", value: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Start Date</Label>
            <Input type="date" value={section.startDate} onChange={(e) => dispatch({ type: "UPDATE", id: section.id, field: "startDate", value: e.target.value })} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">End Date</Label>
            <Input type="date" value={section.endDate} onChange={(e) => dispatch({ type: "UPDATE", id: section.id, field: "endDate", value: e.target.value })} />
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Budget (₹)</Label>
          <Input type="number" min={0} value={section.budget || ""} onChange={(e) => dispatch({ type: "UPDATE", id: section.id, field: "budget", value: Number(e.target.value) })} placeholder="0" />
        </div>
      </div>
    </div>
  );
}

export default function BuildItineraryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: trip, isLoading: tripLoading } = useTrip(id);
  const { data: existingItinerary, isLoading: itinLoading } = useItinerary(id);
  const saveMutation = useSaveItinerary();

  const [sections, dispatch] = useReducer(reducer, [newSection()]);

  useEffect(() => {
    if (existingItinerary?.sections && existingItinerary.sections.length > 0) {
      dispatch({
        type: "SET",
        sections: existingItinerary.sections.map((s) => ({
          id: s.id,
          title: s.title,
          description: s.description,
          startDate: s.startDate,
          endDate: s.endDate,
          budget: s.budget,
        })),
      });
    }
  }, [existingItinerary]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      dispatch({ type: "REORDER", activeId: String(active.id), overId: String(over.id) });
    }
  };

  const totalBudget = sections.reduce((s, sec) => s + (sec.budget || 0), 0);
  const totalStops = sections.length;
  const filledCount = sections.filter((s) => s.title.trim()).length;

  const handleSave = async () => {
    try {
      await saveMutation.mutateAsync({
        tripId: id,
        sections: sections.map((s, i) => ({
          order: i + 1,
          title: s.title,
          description: s.description,
          startDate: s.startDate,
          endDate: s.endDate,
          budget: s.budget,
          currency: "INR",
          activities: [],
        })),
      });
      toast.success("Itinerary saved!");
      router.push(`/trips/${id}`);
    } catch {
      toast.error("Failed to save itinerary");
    }
  };

  if (tripLoading || itinLoading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <Link href={`/trips/${id}`} className="inline-flex items-center gap-1 text-sm text-ink-secondary hover:text-ink-primary">
        <ArrowLeft className="h-4 w-4" /> Back to Trip
      </Link>
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink-primary">{trip?.name ?? "Trip"}</h1>
        <p className="text-sm text-ink-secondary mt-1">Build Itinerary</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Builder */}
        <div className="flex-1 space-y-4">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
              {sections.map((s, i) => (
                <SortableSection key={s.id} section={s} index={i} total={sections.length} dispatch={dispatch} />
              ))}
            </SortableContext>
          </DndContext>
          <Button variant="outline" onClick={() => dispatch({ type: "ADD" })} className="w-full border-dashed border-brand-300 text-brand-500 hover:bg-brand-50 gap-2">
            <Plus className="h-4 w-4" /> Add another Section
          </Button>
        </div>

        {/* Summary panel */}
        <div className="lg:w-80">
          <div className="sticky top-24 rounded-lg border border-border-default bg-surface p-5 shadow-card space-y-4">
            <h3 className="font-sans text-lg font-semibold text-ink-primary">Trip Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-ink-secondary">Total Stops</span><span className="font-medium">{totalStops}</span></div>
              <div className="flex justify-between"><span className="text-ink-secondary">Estimated Budget</span><span className="font-medium">₹{totalBudget.toLocaleString("en-IN")}</span></div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs"><span className="text-ink-secondary">Progress</span><span>{filledCount}/{totalStops}</span></div>
                <Progress value={totalStops > 0 ? (filledCount / totalStops) * 100 : 0} className="h-2" />
              </div>
            </div>
            <Button onClick={handleSave} className="w-full bg-brand-500 hover:bg-brand-600 text-white gap-2" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? <><Loader2 className="h-4 w-4 animate-spin" />Saving...</> : <><Save className="h-4 w-4" />Save & Preview Itinerary →</>}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
