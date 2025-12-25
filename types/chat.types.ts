export interface FloatingChat {
  id: string;
  conversationId: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    avatar?: string;
    isVerified?: boolean;
  };
  isMinimized: boolean;
  unreadCount?: number;
}
