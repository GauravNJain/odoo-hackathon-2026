import { USE_MOCK } from "../config";
import { mockCommunity } from "../mock/community.mock";
import type { CommunityPost, CreatePostPayload } from "@/types/community.types";

export const communityApi = {
  getPosts: async (): Promise<CommunityPost[]> => {
    if (USE_MOCK) return mockCommunity.getPosts();
    return [];
  },
  createPost: async (payload: CreatePostPayload): Promise<CommunityPost> => {
    if (USE_MOCK) return mockCommunity.createPost(payload);
    throw new Error("Not implemented");
  },
  toggleLike: async (postId: string): Promise<CommunityPost> => {
    if (USE_MOCK) return mockCommunity.toggleLike(postId);
    throw new Error("Not implemented");
  },
};
