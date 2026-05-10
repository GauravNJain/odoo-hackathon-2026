"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { mockChecklist } from "@/lib/mock/checklist.mock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ArrowLeft, Plus, Trash2, RotateCcw, Printer, Shirt, FileText, Smartphone, Droplets, Pill, Package } from "lucide-react";
import { toast } from "sonner";
import type { ChecklistItem, ChecklistCategory } from "@/types/checklist.types";

const categoryConfig: Record<ChecklistCategory, { label: string; icon: React.ElementType }> = {
  clothing: { label: "Clothing", icon: Shirt },
  documents: { label: "Documents", icon: FileText },
  electronics: { label: "Electronics", icon: Smartphone },
  toiletries: { label: "Toiletries", icon: Droplets },
  medicines: { label: "Medicines", icon: Pill },
  other: { label: "Other", icon: Package },
};

export default function ChecklistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [newCat, setNewCat] = useState<ChecklistCategory>("other");

  useEffect(() => {
    mockChecklist.getByTripId(id).then((d) => { setItems(d); setLoading(false); });
  }, [id]);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    const item = await mockChecklist.addItem({ tripId: id, name: newName.trim(), category: newCat });
    setItems((prev) => [...prev, item]);
    setNewName("");
    toast.success("Item added");
  };

  const handleToggle = async (itemId: string) => {
    const updated = await mockChecklist.toggleItem(id, itemId);
    setItems((prev) => prev.map((i) => (i.id === itemId ? updated : i)));
  };

  const handleDelete = async (itemId: string) => {
    await mockChecklist.deleteItem(id, itemId);
    setItems((prev) => prev.filter((i) => i.id !== itemId));
    toast.success("Item removed");
  };

  const handleReset = async () => {
    const reset = await mockChecklist.resetAll(id);
    setItems(reset);
    toast.success("Checklist reset");
  };

  const checked = items.filter((i) => i.isChecked).length;
  const grouped = Object.entries(categoryConfig).map(([key, cfg]) => ({
    category: key as ChecklistCategory,
    ...cfg,
    items: items.filter((i) => i.category === key),
  })).filter((g) => g.items.length > 0);

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <Link href={`/trips/${id}`} className="inline-flex items-center gap-1 text-sm text-ink-secondary hover:text-ink-primary">
        <ArrowLeft className="h-4 w-4" /> Back to Trip
      </Link>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold text-ink-primary">Packing Checklist</h1>
        <div className="flex gap-2 no-print">
          <Button variant="outline" size="sm" onClick={handleReset} className="gap-1"><RotateCcw className="h-3.5 w-3.5" />Reset</Button>
          <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-1"><Printer className="h-3.5 w-3.5" />Print</Button>
        </div>
      </div>

      {/* Progress */}
      <div className="rounded-lg border border-border-default bg-surface p-4 shadow-card">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-ink-secondary">{checked} of {items.length} items packed</span>
          <span className="font-medium">{items.length > 0 ? Math.round((checked / items.length) * 100) : 0}%</span>
        </div>
        <Progress value={items.length > 0 ? (checked / items.length) * 100 : 0} className="h-3" />
      </div>

      {/* Add item */}
      <div className="flex gap-2 no-print">
        <Input placeholder="Add new item..." value={newName} onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }} className="flex-1" />
        <Select value={newCat} onValueChange={(v) => setNewCat(v as ChecklistCategory)}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            {Object.entries(categoryConfig).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button onClick={handleAdd} className="bg-brand-500 hover:bg-brand-600 text-white gap-1"><Plus className="h-4 w-4" />Add</Button>
      </div>

      {/* Items by category */}
      <div className="space-y-4">
        {grouped.map((g) => (
          <div key={g.category} className="rounded-lg border border-border-default bg-surface p-4 shadow-card">
            <div className="flex items-center gap-2 mb-3">
              <g.icon className="h-5 w-5 text-brand-500" />
              <h3 className="font-sans text-sm font-semibold text-ink-primary">{g.label}</h3>
              <span className="text-xs text-ink-tertiary">({g.items.filter(i => i.isChecked).length}/{g.items.length})</span>
            </div>
            <div className="space-y-2">
              {g.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={item.isChecked} onCheckedChange={() => handleToggle(item.id)} id={item.id} />
                    <label htmlFor={item.id} className={`text-sm cursor-pointer ${item.isChecked ? "line-through text-ink-tertiary" : "text-ink-primary"}`}>
                      {item.name}
                    </label>
                  </div>
                  <button onClick={() => handleDelete(item.id)} className="opacity-0 group-hover:opacity-100 text-ink-tertiary hover:text-error transition-opacity no-print" aria-label="Delete item">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
