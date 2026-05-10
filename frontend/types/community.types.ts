export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  title: string;
  content: string;
  destination?: string;
  tripId?: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  createdAt: string;
}

export interface CreatePostPayload {
  title: string;
  content: string;
  destination?: string;
  tripId?: string;
}
