export interface User {
  id: string;
  email: string;
  username: string;
  phone: string | null;
  firstName: string;
  lastName: string;
  avatar?: string;
  isVerified?: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string | null;
  content: string;
  type: "TEXT" | "IMAGE" | "VIDEO" | "FILE";
  mediaUrls?: string[];
  createdAt: string;
  isRead: boolean;
  readAt?: string | null;
  deletedAt?: string | null;
  sender?: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    avatar?: string;
  };
}

export interface ConversationParticipant {
  id: string;
  userId: string;
  conversationId: string;
  unreadCount: number;
  isMuted: boolean;
  isPinned: boolean;
  lastReadAt?: string | null;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    avatar?: string;
    isVerified: boolean;
  };
}

export interface Conversation {
  id: string;
  type: "DIRECT" | "GROUP";
  lastMessageAt: string | null;
  participants: ConversationParticipant[];
  messages?: Message[];
  unreadCount?: number;
  isMuted?: boolean;
  isPinned?: boolean;
}

export interface SendMessageDto {
  conversationId: string;
  content: string;
  type?: "TEXT" | "IMAGE" | "VIDEO" | "FILE";
  mediaUrls?: string[];
}

export interface TypingEvent {
  conversationId: string;
  userId: string;
  isTyping: boolean;
}
