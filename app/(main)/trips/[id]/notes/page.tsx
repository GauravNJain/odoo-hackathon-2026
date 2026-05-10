"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { mockNotes } from "@/lib/mock/notes.mock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { ArrowLeft, Plus, Pencil, Trash2, StickyNote, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import type { TripNote } from "@/types/notes.types";

export default function NotesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [notes, setNotes] = useState<TripNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", content: "", stop: "", day: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => { mockNotes.getByTripId(id).then((d) => { setNotes(d); setLoading(false); }); }, [id]);

  const handleSave = async () => {
    if (!form.title || !form.content) { toast.error("Title and content required"); return; }
    setSaving(true);
    try {
      if (editId) {
        const updated = await mockNotes.update(id, editId, { title: form.title, content: form.content, stop: form.stop || undefined, day: form.day ? Number(form.day) : undefined });
        setNotes(prev => prev.map(n => n.id === editId ? updated : n));
        toast.success("Note updated");
      } else {
        const created = await mockNotes.create({ tripId: id, title: form.title, content: form.content, stop: form.stop || undefined, day: form.day ? Number(form.day) : undefined });
        setNotes(prev => [created, ...prev]);
        toast.success("Note added");
      }
      setForm({ title: "", content: "", stop: "", day: "" });
      setEditId(null);
      setOpen(false);
    } catch { toast.error("Failed to save"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (noteId: string) => {
    await mockNotes.delete(id, noteId);
    setNotes(prev => prev.filter(n => n.id !== noteId));
    toast.success("Note deleted");
  };

  const openEdit = (note: TripNote) => {
    setEditId(note.id);
    setForm({ title: note.title, content: note.content, stop: note.stop ?? "", day: note.day?.toString() ?? "" });
    setOpen(true);
  };

  const filtered = notes.filter(n => {
    if (filter === "all") return true;
    if (filter === "day") return !!n.day;
    if (filter === "stop") return !!n.stop;
    return true;
  });

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <Link href={`/trips/${id}`} className="inline-flex items-center gap-1 text-sm text-ink-secondary hover:text-ink-primary">
        <ArrowLeft className="h-4 w-4" /> Back to Trip
      </Link>

      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold text-ink-primary">Trip Notes</h1>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditId(null); setForm({ title: "", content: "", stop: "", day: "" }); } }}>
          <DialogTrigger render={<Button className="bg-brand-500 hover:bg-brand-600 text-white gap-2"><Plus className="h-4 w-4" />Add Note</Button>} />
          <DialogContent>
            <DialogHeader><DialogTitle>{editId ? "Edit Note" : "Add Note"}</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-2">
              <div><Label>Title *</Label><Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
              <div><Label>Content *</Label><Textarea rows={4} value={form.content} onChange={e => setForm({...form, content: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Day (optional)</Label><Input type="number" min={1} value={form.day} onChange={e => setForm({...form, day: e.target.value})} placeholder="e.g. 2" /></div>
                <div><Label>Stop (optional)</Label><Input value={form.stop} onChange={e => setForm({...form, stop: e.target.value})} placeholder="e.g. Paris" /></div>
              </div>
              <Button onClick={handleSave} className="w-full bg-brand-500 hover:bg-brand-600 text-white" disabled={saving}>
                {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : editId ? "Update Note" : "Add Note"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList><TabsTrigger value="all">All</TabsTrigger><TabsTrigger value="day">By Day</TabsTrigger><TabsTrigger value="stop">By Stop</TabsTrigger></TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <EmptyState icon={<StickyNote className="h-12 w-12" />} title="No notes yet" description="Add notes to remember important details" />
      ) : (
        <div className="space-y-3 max-w-2xl">
          {filtered.map(note => (
            <div key={note.id} className="rounded-lg border border-border-default bg-surface p-4 shadow-card group">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-sans text-base font-semibold text-ink-primary">{note.title}</h3>
                  <p className="mt-1 text-sm text-ink-secondary whitespace-pre-wrap">{note.content}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs text-ink-tertiary">{format(new Date(note.createdAt), "MMM d, yyyy · h:mm a")}</span>
                    {note.day && <Badge variant="secondary" className="text-[10px]">Day {note.day}</Badge>}
                    {note.stop && <Badge variant="secondary" className="text-[10px]">{note.stop}</Badge>}
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(note)} className="p-1 text-ink-tertiary hover:text-brand-500" aria-label="Edit note"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => handleDelete(note.id)} className="p-1 text-ink-tertiary hover:text-error" aria-label="Delete note"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
