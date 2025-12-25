"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSocket } from "@/hooks/useSocket";
import { useConversations } from "@/hooks/useConversations";
import { messagingService } from "@/services/messaging.service";
import { ConversationList } from "@/components/messaging/ConversationList";
import { ChatWindow } from "@/components/messaging/ChatWindow";
import { EmptyState } from "@/components/messaging/EmptyState";
import { Conversation } from "@/types/messaging.types";

export default function MessagingPage() {
  const searchParams = useSearchParams();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);

  const { conversations, loading, addOrUpdateConversation } =
    useConversations();
  const socket = useSocket(activeId || undefined);

  // URL-დან ID-ის აღება
  useEffect(() => {
    const idFromQuery = searchParams.get("id");
    if (idFromQuery) setActiveId(idFromQuery);
  }, [searchParams]);

  // აქტიური ჩატის სინქრონიზაცია
  useEffect(() => {
    if (!activeId) {
      setActiveConv(null);
      return;
    }

    const syncActiveConversation = async () => {
      // ჯერ ვეძებთ სიაში
      const foundInList = conversations.find((c) => c.id === activeId);

      if (foundInList) {
        setActiveConv(foundInList);
      } else {
        // თუ არ არის სიაში, ვქმნით API request-ს
        try {
          const data = await messagingService.getConversationById(activeId);
          if (data) {
            setActiveConv(data);
            addOrUpdateConversation(data);
          }
        } catch (error) {
          console.error("ჩატის დეტალები ვერ ჩაიტვირთა", error);
        }
      }
    };

    syncActiveConversation();
  }, [activeId, conversations, addOrUpdateConversation]);

  return (
    <div className="flex h-screen bg-neutral-950">
      {/* SIDEBAR */}
      <div className="w-80 border-r border-neutral-800 bg-neutral-900">
        <ConversationList
          conversations={conversations}
          activeId={activeId}
          onSelectConversation={setActiveId}
          loading={loading}
        />
      </div>

      {/* CHAT WINDOW */}
      <div className="flex-1">
        {activeConv ? (
          <ChatWindow conversation={activeConv} socket={socket} />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
