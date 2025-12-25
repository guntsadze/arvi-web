import { useState, useCallback, useEffect } from "react";
import { Message } from "@/types/messaging.types";
import { messagingService } from "@/services/messaging.service";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/store/slices/userSlice";

export const useMessages = (conversationId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentUser = useAppSelector(selectCurrentUser);

  const loadMessages = useCallback(async () => {
    if (!conversationId) return;

    try {
      setLoading(true);
      const data = await messagingService.getMessages(conversationId);
      const msgs = Array.isArray(data) ? data : [];
      setMessages(msgs);
      setError(null);
    } catch (err) {
      console.error("მესიჯების ჩატვირთვა ჩავარდა:", err);
      setError("მესიჯების ჩატვირთვა ვერ მოხერხდა");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  const sendMessage = async (content: string): Promise<Message | null> => {
    if (!conversationId || !content.trim() || !currentUser) return null;

    const tempId = `temp-${Date.now()}`;
    try {
      const newMsg = await messagingService.sendMessage({
        conversationId,
        content: content.trim(),
      });

      if (!newMsg || !newMsg.id) {
        throw new Error("სერვერიდან მესიჯი არ მოვიდა");
      }

      // ვცვლით დროებითს რეალურით
      setMessages((prev) => prev.map((m) => (m.id === tempId ? newMsg : m)));

      return newMsg;
    } catch (err) {
      console.error("მესიჯის გაგზავნა ჩავარდა:", err);
      // ვშლით ოპტიმისტურ მესიჯს
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setError("მესიჯის გაგზავნა ვერ მოხერხდა");
      return null;
    }
  };

  const addMessage = useCallback((message: Message) => {
    setMessages((prev) => {
      // თავიდან ავიცილოთ დუბლიკატები
      if (prev.some((m) => m.id === message.id)) return prev;
      return [...prev, message];
    });
  }, []);

  const markAsRead = useCallback(async () => {
    if (!conversationId) return;
    try {
      await messagingService.markAsRead(conversationId);
    } catch (err) {
      console.error("წაკითხულად მონიშვნა ჩავარდა:", err);
    }
  }, [conversationId]);

  return {
    messages,
    loading,
    error,
    loadMessages,
    sendMessage,
    addMessage,
    markAsRead,
  };
};
