import { apiClient } from "@/lib/api-client";
import { BaseApiService } from "@/services/common/base-api.service";

// შეტყობინების გამომგზავნის ინტერფეისი (Prisma-ს select-ის მიხედვით)
export interface NotificationSender {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  avatar?: string;
  isVerified: boolean;
}

// შეტყობინების ძირითადი ინტერფეისი
export interface Notification {
  id: string;
  receiverId: string;
  senderId?: string;
  sender?: NotificationSender;
  type: string;
  title: string;
  message?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  // დამატებითი აიდები, რაც ბექენდში გაქვს
  postId?: string;
  commentId?: string;
  userId?: string;
  groupId?: string;
  eventId?: string;
  listingId?: string;
}

class NotificationsService extends BaseApiService<Notification> {
  protected endpoint = "/notifications";

  /**
   * მიიღებს იუზერის ყველა შეტყობინებას პაგინაციით
   */
  async getNotifications(
    params: { page?: number; limit?: number } = { page: 1, limit: 20 }
  ) {
    const query = new URLSearchParams(params as any).toString();
    return apiClient.get(`${this.endpoint}?${query}`);
  }

  /**
   * წაუკითხავი შეტყობინებების რაოდენობა
   */
  async getUnreadCount() {
    return apiClient.get(`${this.endpoint}/unread/count`);
  }

  /**
   * კონკრეტული შეტყობინების წაკითხულად მონიშვნა
   */
  async markAsRead(id: string) {
    return apiClient.post(`${this.endpoint}/${id}/read`, {});
  }

  /**
   * ყველა შეტყობინების წაკითხულად მონიშვნა
   */
  async markAllAsRead() {
    return apiClient.post(`${this.endpoint}/mark-all-read`, {});
  }

  /**
   * შეტყობინების წაშლა
   */
  async remove(id: string) {
    return apiClient.delete(`${this.endpoint}/${id}`);
  }
}

export const notificationsService = new NotificationsService();
