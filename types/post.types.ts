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
