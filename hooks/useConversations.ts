import { useState, useEffect } from "react";
import { Conversation } from "@/types/messaging.types";
import { messagingService } from "@/services/messaging.service";

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const data = await messagingService.getConversations();
      setConversations(data || []);
      setError(null);
    } catch (err) {
      console.error("ჩატების ჩატვირთვა ჩავარდა:", err);
      setError("ჩატების ჩატვირთვა ვერ მოხერხდა");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  const addOrUpdateConversation = (conversation: Conversation) => {
    setConversations((prev) => {
      const exists = prev.find((c) => c.id === conversation.id);
      if (exists) {
        return prev.map((c) => (c.id === conversation.id ? conversation : c));
      }
      return [conversation, ...prev];
    });
  };

  return {
    conversations,
    loading,
    error,
    loadConversations,
    addOrUpdateConversation,
  };
};
