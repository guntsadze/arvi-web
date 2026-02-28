"use client";

import { notificationsService } from "@/services/notifications.service";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/store/slices/userSlice";

export const useNotifications = () => {
  const router = useRouter();
  const currentUser = useAppSelector(selectCurrentUser);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  // ─── 1. HTTP fetch ────────────────────────────────────────────
  const fetchNotifications = useCallback(async (page = 1, limit = 20) => {
    try {
      setIsLoading(true);
      const [notificationsRes, countRes] = await Promise.all([
        notificationsService.getNotifications({ page, limit }),
        notificationsService.getUnreadCount(),
      ]);
      setNotifications(
        Array.isArray(notificationsRes)
          ? notificationsRes
          : (notificationsRes as any).data || []
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

  // ─── 2. WebSocket ─────────────────────────────────────────────
useEffect(() => {
  if (!currentUser?.id) {
    console.log("❌ currentUser არ არის, socket არ იქმნება");
    return;
  }

  console.log("🔌 Socket-ს ვქმნი...", process.env.NEXT_PUBLIC_API_URL);

  const socket = io(`${process.env.NEXT_PUBLIC_API_URL}/notifications`, {
    transports: ["websocket"],
  });

  socketRef.current = socket;

  socket.on("connect", () => {
    console.log("✅ Socket connected!", socket.id);
    socket.emit("joinNotifications", currentUser.id);
    console.log("🏠 joinNotifications გავაგზავნე, userId:", currentUser.id);
  });

  socket.on("connect_error", (err) => {
    console.log("❌ Socket connection error:", err.message);
  });

  socket.on("newNotification", (notification: any) => {
    console.log("🔔 newNotification მივიღე!", notification);
    setNotifications((prev) => [notification, ...prev]);
    setUnreadCount((prev) => prev + 1);
  });

  socket.on("unreadCount", ({ count }: { count: number }) => {
    console.log("📊 unreadCount მივიღე:", count);
    setUnreadCount(count);
  });

  return () => {
    socket.emit("leaveNotifications", currentUser.id);
    socket.disconnect();
  };
}, [currentUser?.id]);

  // ─── 3. პირველი load ──────────────────────────────────────────
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // ─── 4. Actions ───────────────────────────────────────────────
  const markAsRead = async (id: string) => {
    try {
      await notificationsService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  };

  const removeNotification = async (id: string) => {
    try {
      await notificationsService.remove(id);
      const target = notifications.find((n) => n.id === id);
      if (target && !target.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  const handleNotificationClick = async (notification: any) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }

    switch (notification.type) {
      case "COMMENT":
      case "LIKE":
        if (notification.postId) router.push(`/posts/${notification.postId}`);
        break;
      case "FOLLOW":
        if (notification.sender?.username)
          router.push(`/profile/${notification.sender.username}`);
        break;
      case "EVENT":
        if (notification.eventId)
          router.push(`/events/${notification.eventId}`);
        break;
      case "LISTING":
        if (notification.listingId)
          router.push(`/marketplace/${notification.listingId}`);
        break;
      default:
        console.warn("Unknown notification type:", notification.type);
    }
  };

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
