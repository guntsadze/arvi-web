import { apiClient } from "@/lib/api-client";
import { BaseApiService } from "@/services/common/base-api.service";

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId?: string;
  content: string;
  type: "TEXT" | "IMAGE" | "VIDEO" | "FILE";
  mediaUrls: string[];
  isRead: boolean;
  createdAt: string;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    avatar?: string;
  };
}

export interface Conversation {
  id: string;
  type: "DIRECT" | "GROUP";
  lastMessageAt: string;
  unreadCount: number;
  isMuted: boolean;
  isPinned: boolean;
  participants: Array<{
    user: {
      id: string;
      firstName: string;
      lastName: string;
      username: string;
      avatar?: string;
      isVerified: boolean;
    };
  }>;
  messages: Message[];
}

class MessagingService extends BaseApiService<any> {
  protected endpoint = "/messages";

  async getConversationById(id: string) {
    try {
      // მივმართავთ ახალ ენდპოინტს: /messages/details/ID
      const res = await apiClient.get(`${this.endpoint}/details/${id}`);

      // ვაბრუნებთ პირდაპირ პასუხს (შენი apiClient-ის ლოგიკით)
      return res;
    } catch (error) {
      console.error("Error fetching conversation details:", error);
      throw error;
    }
  }

  // საუბრების სიის წამოღება
  async getConversations() {
    const { data } = await apiClient.get(`${this.endpoint}/conversations`);
    return data as Conversation[];
  }

  // კონკრეტული საუბრის მესიჯები
  async getMessages(
    conversationId: string,
    page: number = 1,
    limit: number = 20
  ) {
    const data = await apiClient.get(`${this.endpoint}/${conversationId}`);
    console.log(data);
    return data as Message[];
  }

  async getOrCreateConversation(userId: string) {
    try {
      const res = await apiClient.get(
        `${this.endpoint}/conversation/${userId}`
      );

      return res; // დააბრუნე პირდაპირ მიღებული პასუხი
    } catch (error) {
      console.error("სერვისის შეცდომა:", error);
      throw error;
    }
  }

  // 2. კონკრეტულ საუბარში მესიჯის გაგზავნა
  async sendMessage(payload: { conversationId: string; content: string }) {
    const { data } = await apiClient.post(
      `${this.endpoint}/${payload.conversationId}`,
      { content: payload.content }
    );
    return data;
  }

  // წაკითხულად მონიშვნა
  async markAsRead(conversationId: string) {
    const { data } = await apiClient.post(
      `${this.endpoint}/${conversationId}/read`
    );
    return data;
  }
}

export const messagingService = new MessagingService();
