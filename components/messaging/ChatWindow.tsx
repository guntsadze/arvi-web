import { useEffect } from "react";
import { Conversation } from "@/types/messaging.types";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { TypingIndicator } from "./TypingIndicator";
import { useMessages } from "@/hooks/useMessages";
import { useTyping } from "@/hooks/useTyping";
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

  const {
    messages,
    loading,
    loadMessages,
    sendMessage,
    addMessage,
    markAsRead,
  } = useMessages(conversation.id);

  const {
    typingUsers,
    handleTypingStart,
    handleTypingStop,
    addTypingUser,
    removeTypingUser,
  } = useTyping(socket, conversation.id);

  // მესიჯების ჩატვირთვა
  useEffect(() => {
    loadMessages();
    markAsRead();
  }, [conversation.id, loadMessages, markAsRead]);

  // Socket listeners
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg: any) => {
      if (msg?.conversationId === conversation.id) {
        addMessage(msg);
        markAsRead();
      }
    };

    const handleUserTyping = (data: { userId: string; isTyping: boolean }) => {
      if (data.userId === partner?.userId) {
        if (data.isTyping) {
          addTypingUser(data.userId);
        } else {
          removeTypingUser(data.userId);
        }
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("userTyping", handleUserTyping);
    socket.emit("joinConversation", conversation.id);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("userTyping", handleUserTyping);
      socket.emit("leaveConversation", conversation.id);
    };
  }, [
    socket,
    conversation.id,
    partner?.userId,
    addMessage,
    markAsRead,
    addTypingUser,
    removeTypingUser,
  ]);

  const handleSend = async (content: string) => {
    await sendMessage(content);
    handleTypingStop();
  };

  const isPartnerTyping = typingUsers.has(partner?.userId || "");

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-neutral-400">იტვირთება...</div>
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
          userName={partner?.user?.firstName || "მომხმარებელი"}
        />
      )}
      <MessageInput onSend={handleSend} onTyping={handleTypingStart} />
    </div>
  );
};
