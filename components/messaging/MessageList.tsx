import { useEffect, useRef } from "react";
import { Message } from "@/types/messaging.types";
import { MessageItem } from "./MessageItem";

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  loading?: boolean;
}

export const MessageList = ({
  messages,
  currentUserId,
  loading = false,
}: MessageListProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // ყოველ ახალ მესიჯზე scroll ქვემოთ
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-neutral-400">იტვირთება...</div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-neutral-400 text-center">
          <p>შეტყობინებები ჯერ არ არის</p>
          <p className="text-sm mt-2">დაწერეთ პირველი მესიჯი!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto py-4">
      {messages.map((msg) => {
        if (!msg || !msg.id) return null;
        const isMine = msg.senderId === currentUserId;
        return <MessageItem key={msg.id} message={msg} isMine={isMine} />;
      })}
      <div ref={scrollRef} />
    </div>
  );
};
