"use client";

import { useState, useCallback, useEffect } from "react";
import { useSocket } from "@/hooks/useSocket";
import { Message } from "@/types/messaging.types";
import { messagingService } from "@/services/messaging.service";
import { selectCurrentUser } from "@/store/slices/userSlice";
import { useAppSelector } from "@/store/hooks";

interface ExtendedMessage extends Message {
  status?: "pending" | "sent" | "error";
  clientSideId?: string;
}

export const useMessages = (conversationId: string | null) => {
  const [messages, setMessages] = useState<ExtendedMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<{ [key: string]: string }>({});
  const currentUser = useAppSelector(selectCurrentUser);
  const socket = useSocket("/messages");

  // მესიჯების ჩატვირთვა
  const loadMessages = useCallback(async () => {
    if (!conversationId) return;

    try {
      const data = await messagingService.getMessages(conversationId);

      const normalized: ExtendedMessage[] = (
        Array.isArray(data) ? data : []
      ).map((m) => ({
        ...m,
        receiverId: m.receiverId ?? null,
      }));

      setMessages(normalized);
    } catch (err) {
      console.error(err);
    }
  }, [conversationId]);

  useEffect(() => {
    if (!socket || !conversationId) return;

    socket.emit("joinConversation", conversationId);

    // 1. მესიჯების მიღება (დუბლირების საწინააღმდეგო ფილტრით)
    socket.on("newMessage", (msg: ExtendedMessage) => {
      setMessages((prev) => {
        // თუ მოვიდა ჩემი გაგზავნილი (აქვს clientSideId)
        if (msg.clientSideId) {
          const isExisting = prev.some(
            (m) => m.clientSideId === msg.clientSideId,
          );
          if (isExisting) {
            return prev.map((m) =>
              m.clientSideId === msg.clientSideId
                ? { ...msg, status: "sent" }
                : m,
            );
          }
        }
        // თუ მოვიდა სხვისი ან ჩემი, რომელიც უკვე ბაზაშია (id-ით შემოწმება)
        if (prev.some((m) => m.id === msg.id)) return prev;

        return [...prev, msg];
      });
    });

    // 2. წაკითხვის ივენთი
    socket.on("messagesSeen", (data: { readerId: string }) => {
      if (data.readerId !== currentUser?.id) {
        setMessages((prev) =>
          prev.map((m) =>
            m.senderId === currentUser?.id ? { ...m, isRead: true } : m,
          ),
        );
      }
    });

    // 3. წერის ინდიკატორი
    socket.on("userTyping", (data: { userId: string; username: string }) => {
      setTypingUsers((prev) => ({ ...prev, [data.userId]: data.username }));
    });

    socket.on("userStopTyping", (data: { userId: string }) => {
      setTypingUsers((prev) => {
        const newState = { ...prev };
        delete newState[data.userId];
        return newState;
      });
    });

    return () => {
      socket.off("newMessage");
      socket.off("messagesSeen");
      socket.off("userTyping");
      socket.off("userStopTyping");
    };
  }, [socket, conversationId, currentUser?.id]);

  // ფუნქციები ოთახისთვის
  const sendTyping = () => {
    if (!socket || !conversationId || !currentUser) return;
    socket.emit("typing", {
      conversationId,
      userId: currentUser.id,
      username: currentUser.firstName,
    });
  };

  const sendStopTyping = () => {
    if (!socket || !conversationId || !currentUser) return;
    socket.emit("stopTyping", { conversationId, userId: currentUser.id });
  };

  const sendMessage = async (content: string) => {
    if (!conversationId || !content.trim() || !currentUser) return null;
    const clientSideId = `c-${Date.now()}`;
    const tempMessage: ExtendedMessage = {
      id: clientSideId,
      clientSideId,
      conversationId,
      content: content.trim(),
      senderId: currentUser.id,
      receiverId: null,
      type: "TEXT",
      isRead: false,
      createdAt: new Date().toISOString(),
      status: "pending",
      sender: currentUser as any,
    };

    setMessages((prev) => [...prev, tempMessage]);
    sendStopTyping();

    try {
      return await messagingService.sendMessage({
        conversationId,
        content: content.trim(),
        clientSideId,
      });
    } catch (err) {
      setMessages((prev) =>
        prev.filter((m) => m.clientSideId !== clientSideId),
      );
      return null;
    }
  };

  const markAsRead = useCallback(async () => {
    if (!conversationId) return;
    await messagingService.markAsRead(conversationId);
  }, [conversationId]);

  return {
    messages,
    typingUsers,
    sendMessage,
    markAsRead,
    sendTyping,
    sendStopTyping,
    loadMessages,
  };
};
