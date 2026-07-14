import { useEffect, useState } from "react";
import { Conversation } from "@/types/messaging.types";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { TypingIndicator } from "./TypingIndicator";
import { useMessages } from "@/hooks/useMessages";
import { Socket } from "socket.io-client";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/store/slices/userSlice";

interface ChatWindowProps {
  conversation: Conversation;
  socket: Socket | null;
}

export const ChatWindow = ({ conversation, socket }: ChatWindowProps) => {
  const currentUser = useAppSelector(selectCurrentUser);
  const partner = conversation.participants[0];
  const [loading, setLoading] = useState(true);

  const {
    messages,
    typingUsers,
    loadMessages,
    sendMessage,
    markAsRead,
    sendTyping,
    sendStopTyping,
  } = useMessages(conversation.id);

  // მესიჯების ჩატვირთვა
  // (useMessages already owns its own socket subscription for newMessage /
  // typing events internally, so this component just consumes its state.)
  useEffect(() => {
    let active = true;
    setLoading(true);

    Promise.resolve(loadMessages()).finally(() => {
      if (active) setLoading(false);
    });
    markAsRead();

    return () => {
      active = false;
    };
  }, [conversation.id, loadMessages, markAsRead]);

  const handleSend = async (content: string) => {
    await sendMessage(content);
    sendStopTyping();
  };

  const isPartnerTyping = Boolean(
    partner?.userId && typingUsers[partner.userId],
  );

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-text-secondary">იტვირთება...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ChatHeader partner={partner} />
      <MessageList
        messages={messages}
        currentUserId={currentUser.id}
        loading={loading}
      />
      {isPartnerTyping && (
        <TypingIndicator
          userName={
            (partner?.userId && typingUsers[partner.userId]) ||
            partner?.user?.firstName ||
            "მომხმარებელი"
          }
        />
      )}
      <MessageInput onSend={handleSend} onTyping={sendTyping} />
    </div>
  );
};
