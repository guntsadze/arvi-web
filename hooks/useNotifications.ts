import { notificationsService } from "@/services/notifications.service";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

export const useNotifications = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log(notifications);
  // 1. შეტყობინებების და წაუკითხავი რაოდენობის წამოღება
  const fetchNotifications = useCallback(async (page = 1, limit = 20) => {
    try {
      setIsLoading(true);

      // პარალელურად წამოვიღოთ სია და რაოდენობა
      const [notificationsRes, countRes] = await Promise.all([
        notificationsService.getNotifications({ page, limit }),
        notificationsService.getUnreadCount(),
      ]);

      // მონაცემების დასეტვა (apiClient-ის სტრუქტურის გათვალისწინებით)
      setNotifications(
        Array.isArray(notificationsRes)
          ? notificationsRes
          : (notificationsRes as any).data || [],
      );
      setUnreadCount(countRes.count || 0);

      setError(null);
    } catch (err) {
      console.error("Error loading notifications:", err);
      setError("შეტყობინებების ჩატვირთვა ვერ მოხერხდა");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 2. წაკითხულად მონიშვნა (ლოკალური სთეითის ოპტიმისტური განახლებით)
  const markAsRead = async (id: string) => {
    try {
      await notificationsService.markAsRead(id);

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );

      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  // 3. ყველას წაკითხულად მონიშვნა
  const markAllAsRead = async () => {
    try {
      await notificationsService.markAllAsRead();

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  };

  // 4. წაშლა
  const removeNotification = async (id: string) => {
    try {
      await notificationsService.remove(id);

      const targetNotification = notifications.find((n) => n.id === id);
      if (targetNotification && !targetNotification.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }

      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  const handleNotificationClick = async (notification: any) => {
    console.log("Handling notification click:", notification);
    // 1. მოვნიშნოთ წაკითხულად (თუ უკვე არ არის წაკითხული)
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }

    // 2. განვსაზღვროთ სად გადავიყვანოთ იუზერი ტიპის მიხედვით
    switch (notification.type) {
      case "COMMENT":
      case "LIKE":
        if (notification.postId) {
          router.push(`/posts/${notification.postId}`);
        }
        break;

      case "FOLLOW":
        if (notification.senderId) {
          router.push(`/profile/${notification.sender.username}`);
        }
        break;

      case "MESSAGE":
        // თუ გაქვს ჩატის აიდი
        router.push(`/messages/${notification.senderId}`);
        break;

      case "EVENT":
        if (notification.eventId) {
          router.push(`/events/${notification.eventId}`);
        }
        break;

      case "LISTING":
        if (notification.listingId) {
          router.push(`/marketplace/${notification.listingId}`);
        }
        break;

      default:
        console.warn("Unknown notification type:", notification.type);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    removeNotification,
    handleNotificationClick,
    refetch: fetchNotifications,
  };
};
