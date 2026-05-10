"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTrips } from "@/hooks/useTrips";
import { TripCard } from "@/components/trips/TripCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Pencil, Save, X, Trash2, Calendar } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const { data: trips } = useTrips();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    phone: user?.phone ?? "",
    city: user?.city ?? "",
    country: user?.country ?? "",
    additionalInfo: user?.additionalInfo ?? "",
  });

  const handleSave = () => {
    updateUser(form);
    setEditing(false);
    toast.success("Profile updated!");
  };

  const initials = user ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() : "U";
  const preplanned = trips?.filter((t) => t.status === "upcoming") ?? [];
  const previous = trips?.filter((t) => t.status === "completed") ?? [];

  return (
    <div className="space-y-8">
      {/* Profile header */}
      <div className="rounded-lg border border-border-default bg-surface p-6 shadow-card">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <Avatar className="h-24 w-24">
            <AvatarFallback className="bg-brand-100 text-brand-700 text-2xl font-bold">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            {editing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-xs">First Name</Label><Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></div>
                  <div><Label className="text-xs">Last Name</Label><Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></div>
                </div>
                <div><Label className="text-xs">Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-xs">City</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
                  <div><Label className="text-xs">Country</Label><Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} /></div>
                </div>
                <div><Label className="text-xs">Additional Info</Label><Textarea value={form.additionalInfo} onChange={(e) => setForm({ ...form, additionalInfo: e.target.value })} rows={2} /></div>
                <div className="flex gap-2">
                  <Button onClick={handleSave} className="bg-brand-500 hover:bg-brand-600 text-white gap-1"><Save className="h-4 w-4" />Save</Button>
                  <Button variant="outline" onClick={() => setEditing(false)} className="gap-1"><X className="h-4 w-4" />Cancel</Button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="font-display text-2xl font-bold text-ink-primary">{user?.firstName} {user?.lastName}</h1>
                <p className="text-sm text-ink-secondary">{user?.email}</p>
                <p className="text-sm text-ink-secondary mt-1">{user?.city}, {user?.country}</p>
                <div className="flex items-center gap-1 text-xs text-ink-tertiary mt-1"><Calendar className="h-3 w-3" />Member since {user?.createdAt ? format(new Date(user.createdAt), "MMM yyyy") : "N/A"}</div>
                <Button variant="outline" onClick={() => setEditing(true)} className="mt-3 gap-1"><Pencil className="h-4 w-4" />Edit Profile</Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Saved destinations */}
      {user?.savedDestinations && user.savedDestinations.length > 0 && (
        <section>
          <h2 className="font-sans text-lg font-semibold text-ink-primary mb-3">Saved Destinations</h2>
          <div className="flex flex-wrap gap-2">
            {user.savedDestinations.map((d) => <Badge key={d} variant="secondary" className="cursor-pointer hover:bg-brand-100">{d}</Badge>)}
          </div>
        </section>
      )}

      {/* Preplanned trips */}
      {preplanned.length > 0 && (
        <section>
          <h2 className="font-sans text-lg font-semibold text-ink-primary mb-3">Upcoming Trips</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">{preplanned.map((t) => <TripCard key={t.id} trip={t} compact />)}</div>
        </section>
      )}

      {/* Previous trips */}
      {previous.length > 0 && (
        <section>
          <h2 className="font-sans text-lg font-semibold text-ink-primary mb-3">Previous Trips</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">{previous.map((t) => <TripCard key={t.id} trip={t} compact />)}</div>
        </section>
      )}

      {/* Danger zone */}
      <section className="rounded-lg border border-error/30 bg-error/5 p-6">
        <h2 className="font-sans text-lg font-semibold text-error mb-2">Danger Zone</h2>
        <p className="text-sm text-ink-secondary mb-4">Permanently delete your account and all associated data.</p>
        <AlertDialog>
          <AlertDialogTrigger render={<Button variant="outline" className="border-error text-error hover:bg-error/10 gap-1"><Trash2 className="h-4 w-4" />Delete Account</Button>} />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>This action cannot be undone. This will permanently delete your account and all your data.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={logout} className="bg-error hover:bg-error/90 text-white">Delete Account</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>
    </div>
  );
}
