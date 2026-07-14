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

interface MessagingPageProps {
  initialActiveId?: string | null;
}

export default function MessagingPage({ initialActiveId }: MessagingPageProps) {
  console.log(initialActiveId);
  const searchParams = useSearchParams();

  const [activeId, setActiveId] = useState<string | null>(
    initialActiveId || null,
  );
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);

  const { conversations, loading, addOrUpdateConversation } =
    useConversations();
  const socket = useSocket(activeId || undefined);

  // 2. თუ პროპსი გარედან შეიცვალა, სთეითიც განახლდეს
  useEffect(() => {
    if (initialActiveId) {
      setActiveId(initialActiveId);
    }
  }, [initialActiveId]);

  // 3. URL-დან ID-ის აღება (თუ პროპსი არ გვაქვს, URL-ს მიენიჭოს პრიორიტეტი)
  useEffect(() => {
    const idFromQuery = searchParams.get("id");
    if (idFromQuery) {
      setActiveId(idFromQuery);
    }
  }, [searchParams]);

  // 4. აქტიური ჩატის სინქრონიზაცია და მონაცემების წამოღება (ეს ლოგიკა უკვე გაქვთ)
  useEffect(() => {
    if (!activeId) {
      setActiveConv(null);
      return;
    }

    const syncActiveConversation = async () => {
      // ჯერ ვეძებთ უკვე ჩატვირთულ სიაში
      const foundInList = conversations.find((c) => c.id === activeId);

      if (foundInList) {
        setActiveConv(foundInList);
      } else {
        // თუ სიაში არ არის, ვიძახებთ სერვისს კონკრეტული ჩატის ჩანაწერების წამოსაღებად
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
    <div className="flex h-screen bg-background">
      {/* SIDEBAR */}
      <div className="w-80 border-r border-border bg-surface-1">
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
