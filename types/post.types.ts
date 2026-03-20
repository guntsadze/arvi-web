export interface Posts {
  type?: string;
  content?: string;
  images?: string[];
  videos?: string[];
  carId?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  commentsEnabled?: boolean;
  isPublic?: boolean;
  isPinned?: boolean;
  // Hashtags: #cars #bmw
  tags?: string[];
  // Mentions: ["userId1", "userId2"]
  mentions?: string[];
}

export interface MediaItem {
  url: string;
  type: "image" | "video";
}

export interface PostUser {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  avatar?: { url: string };
}

export interface Comment {
  id: string;
  content: string;
  user: PostUser;
  createdAt: string;
  replies?: Comment[];
}

export interface Post {
  id: string;
  content: string;
  media: MediaItem[];
  user: PostUser;
  createdAt: string;
  isLiked: boolean;
  isSaved: boolean;
  likesCount: number;
  commentsCount: number;
}
