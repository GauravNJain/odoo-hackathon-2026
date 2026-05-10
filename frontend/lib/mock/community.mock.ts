import type { CommunityPost, CreatePostPayload } from "@/types/community.types";

let mockPostsData: CommunityPost[] = [
  {
    id: "post-1",
    userId: "user-2",
    userName: "Ananya Sharma",
    userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&q=80",
    title: "Why Bali Changed My Perspective on Travel",
    content: "After spending 10 days in Bali, I came back a different person. The rice terraces of Tegallalang, the spiritual energy of Ubud's yoga studios, and the incredible sunsets at Tanah Lot temple — Bali isn't just a destination, it's a transformation. Pro tip: skip the tourist traps in Kuta and head straight to Canggu for the best cafes and surf.",
    destination: "Bali, Indonesia",
    likes: 42,
    comments: 8,
    isLiked: false,
    createdAt: "2025-04-28T14:30:00Z",
  },
  {
    id: "post-2",
    userId: "user-3",
    userName: "Rohan Mehta",
    title: "Budget Backpacking Through Southeast Asia: A Complete Guide",
    content: "Just completed a 30-day backpacking trip through Thailand, Vietnam, and Cambodia on under ₹1.5L. Yes, it's possible! Here's my day-by-day budget breakdown, hostel recommendations, and the hidden gems that no travel blog tells you about. The night markets in Chiang Mai alone are worth the trip.",
    destination: "Southeast Asia",
    likes: 67,
    comments: 15,
    isLiked: true,
    createdAt: "2025-04-25T09:15:00Z",
  },
  {
    id: "post-3",
    userId: "user-4",
    userName: "Priya Patel",
    userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
    title: "Solo Female Travel in Japan: Everything You Need to Know",
    content: "Japan is hands down the safest country I've ever traveled solo in. From navigating the Tokyo metro to staying in traditional ryokans in Kyoto, every moment felt secure and welcoming. The cherry blossom season in March-April is absolutely magical. Here are my top 10 tips for solo female travelers.",
    destination: "Tokyo, Japan",
    likes: 89,
    comments: 23,
    isLiked: false,
    createdAt: "2025-04-22T16:45:00Z",
  },
  {
    id: "post-4",
    userId: "user-5",
    userName: "Arjun Singh",
    title: "Hidden Gems of Rajasthan Nobody Talks About",
    content: "Everyone knows about Jaipur and Udaipur, but have you heard of Bundi? This tiny town has some of the most stunning step-wells and frescoed palaces in all of Rajasthan, without the crowds. Also, the sunset from Taragarh Fort is the best I've seen anywhere in India.",
    destination: "Rajasthan, India",
    likes: 34,
    comments: 6,
    isLiked: false,
    createdAt: "2025-04-20T11:00:00Z",
  },
  {
    id: "post-5",
    userId: "user-1",
    userName: "Gaurav Jain",
    title: "My Dubai Trip: Work Hard, Play Harder",
    content: "Combining a business conference with 3 days of exploration in Dubai was the best decision. The Burj Khalifa at sunset, dune bashing in the desert, and the incredible food scene in Old Dubai — there's something for everyone here. Budget tip: visit during shoulder season (Oct-Nov) for better hotel rates.",
    destination: "Dubai, UAE",
    likes: 28,
    comments: 4,
    isLiked: true,
    createdAt: "2025-04-18T08:30:00Z",
  },
];

export const mockCommunity = {
  getPosts: async (): Promise<CommunityPost[]> => {
    await new Promise((r) => setTimeout(r, 600));
    return [...mockPostsData];
  },

  createPost: async (payload: CreatePostPayload): Promise<CommunityPost> => {
    await new Promise((r) => setTimeout(r, 800));
    const newPost: CommunityPost = {
      id: "post-" + Date.now(),
      userId: "user-1",
      userName: "Gaurav Jain",
      ...payload,
      likes: 0,
      comments: 0,
      isLiked: false,
      createdAt: new Date().toISOString(),
    };
    mockPostsData = [newPost, ...mockPostsData];
    return newPost;
  },

  toggleLike: async (postId: string): Promise<CommunityPost> => {
    await new Promise((r) => setTimeout(r, 200));
    const idx = mockPostsData.findIndex((p) => p.id === postId);
    if (idx === -1) throw new Error("Post not found");
    mockPostsData[idx] = {
      ...mockPostsData[idx],
      isLiked: !mockPostsData[idx].isLiked,
      likes: mockPostsData[idx].isLiked
        ? mockPostsData[idx].likes - 1
        : mockPostsData[idx].likes + 1,
    };
    return { ...mockPostsData[idx] };
  },
};
