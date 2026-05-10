"use client";

import React, { useState } from "react";
import { useCommunityPosts, useCreatePost, useToggleLike } from "@/hooks/useCommunity";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, MessageCircle, Plus, Users, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import type { CommunityPost } from "@/types/community.types";

const PostCard = React.memo(function PostCard({ post, onLike }: { post: CommunityPost; onLike: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const initials = post.userName.split(" ").map(n => n[0]).join("").toUpperCase();

  return (
    <div className="rounded-lg border border-border-default bg-surface p-5 shadow-card">
      <div className="flex items-center gap-3 mb-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-brand-100 text-brand-700 text-sm font-medium">{initials}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium text-ink-primary">{post.userName}</p>
          <p className="text-xs text-ink-tertiary">{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</p>
        </div>
      </div>
      <h3 className="font-sans text-base font-semibold text-ink-primary">{post.title}</h3>
      <p className={`mt-1 text-sm text-ink-secondary ${expanded ? "" : "line-clamp-3"}`}>{post.content}</p>
      {post.content.length > 200 && (
        <button className="text-xs text-brand-500 hover:text-brand-600 mt-1" onClick={() => setExpanded(!expanded)}>
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
      {post.destination && <Badge variant="secondary" className="mt-2">{post.destination}</Badge>}
      <div className="mt-3 flex items-center gap-4 pt-3 border-t border-border-default">
        <button onClick={() => onLike(post.id)} className={`flex items-center gap-1 text-sm ${post.isLiked ? "text-error" : "text-ink-secondary"} hover:text-error transition-colors`}>
          <Heart className={`h-4 w-4 ${post.isLiked ? "fill-current" : ""}`} />{post.likes}
        </button>
        <span className="flex items-center gap-1 text-sm text-ink-secondary"><MessageCircle className="h-4 w-4" />{post.comments}</span>
      </div>
    </div>
  );
});

export default function CommunityPage() {
  const { data: posts, isLoading } = useCommunityPosts();
  const createPost = useCreatePost();
  const toggleLike = useToggleLike();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", destination: "" });
  const [search, setSearch] = useState("");

  const handleCreate = async () => {
    if (!form.title || !form.content) { toast.error("Title and content are required"); return; }
    try {
      await createPost.mutateAsync(form);
      toast.success("Post shared!");
      setForm({ title: "", content: "", destination: "" });
      setOpen(false);
    } catch { toast.error("Failed to create post"); }
  };

  const filtered = posts?.filter(p => {
    if (!search) return true;
    const q = search.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q) || p.destination?.toLowerCase().includes(q);
  }) ?? [];

  return (
    <div className="space-y-6">
      <PageHeader title="Community" subtitle="Discover travel experiences shared by fellow travelers" action={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button className="bg-brand-500 hover:bg-brand-600 text-white gap-2"><Plus className="h-4 w-4" />Share Experience</Button>} />
          <DialogContent>
            <DialogHeader><DialogTitle>Share Your Experience</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-2">
              <div><Label>Title *</Label><Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Give your post a title" /></div>
              <div><Label>Content *</Label><Textarea rows={4} value={form.content} onChange={e => setForm({...form, content: e.target.value})} placeholder="Share your experience..." /></div>
              <div><Label>Destination</Label><Input value={form.destination} onChange={e => setForm({...form, destination: e.target.value})} placeholder="e.g. Bali, Indonesia" /></div>
              <Button onClick={handleCreate} className="w-full bg-brand-500 hover:bg-brand-600 text-white" disabled={createPost.isPending}>
                {createPost.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Posting...</> : "Share Post"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      } />

      <Input placeholder="Search posts..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-md" />

      {isLoading ? (
        <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-48 rounded-lg" />)}</div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={<Users className="h-12 w-12" />} title="No posts yet" description="Be the first to share!" />
      ) : (
        <div className="space-y-4 max-w-2xl">{filtered.map(p => <PostCard key={p.id} post={p} onLike={(id) => toggleLike.mutate(id)} />)}</div>
      )}
    </div>
  );
}
