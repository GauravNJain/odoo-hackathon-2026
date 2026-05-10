import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { communityApi } from "@/lib/api/community.api";
import type { CreatePostPayload } from "@/types/community.types";

export const useCommunityPosts = () =>
  useQuery({ queryKey: ["community"], queryFn: communityApi.getPosts });

export const useCreatePost = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePostPayload) => communityApi.createPost(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["community"] }),
  });
};

export const useToggleLike = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => communityApi.toggleLike(postId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["community"] }),
  });
};
