"use client";

import { useState, useEffect, useRef } from "react";
import { X, Minus, Send } from "lucide-react";
import { FloatingChat } from "@/types/chat.types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeChat, toggleMinimize } from "@/store/slices/floatingChatsSlice";
import { useSocket } from "@/hooks/useSocket";
import { useMessages } from "@/hooks/useMessages";
import { selectCurrentUser } from "@/store/slices/userSlice";
import { UserAvatarItem } from "../ui/UserAvatarItem";
import { cn } from "@/lib/utils";

interface FloatingChatWindowProps {
  chat: FloatingChat;
  index: number;
}

export const FloatingChatWindow = ({
  chat,
  index,
}: FloatingChatWindowProps) => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const socket = useSocket(chat.conversationId);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    loading,
    loadMessages,
    sendMessage,
    addMessage,
    markAsRead,
  } = useMessages(chat.conversationId);

  useEffect(() => {
    if (!chat.isMinimized) {
      loadMessages();
      markAsRead();
    }
  }, [chat.conversationId, chat.isMinimized, loadMessages, markAsRead]);

  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = (msg: any) => {
      if (msg?.conversationId === chat.conversationId) {
        addMessage(msg);
        if (!chat.isMinimized) markAsRead();
      }
    };
    socket.on("newMessage", handleNewMessage);
    socket.emit("joinConversation", chat.conversationId);
    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.emit("leaveConversation", chat.conversationId);
    };
  }, [socket, chat.conversationId, chat.isMinimized, addMessage, markAsRead]);

  useEffect(() => {
    if (!chat.isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, chat.isMinimized]);

  const rightPosition = 24 + index * 80; // როცა მინიმალისტურია, უფრო ახლოს არიან

  // --- მინიმალისტური მრგვალი ბუშტი ---
  if (chat.isMinimized) {
    return (
      <div
        className="fixed bottom-6 z-50 transition-all duration-500 ease-in-out group"
        style={{ right: `${rightPosition}px` }}
      >
        {/* Close Button on Hover */}
        <button
          onClick={() => dispatch(closeChat(chat.id))}
          className="absolute -top-1 -right-1 z-10 bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity border-2 border-[#1c1917]"
        >
          <X size={10} />
        </button>

        {/* Bubble Avatar */}
        <div
          onClick={() => dispatch(toggleMinimize(chat.id))}
          className="cursor-pointer relative transform hover:scale-110 transition-transform active:scale-95"
        >
          <UserAvatarItem user={chat.user} size="sm" showName={false} />
          {/* Online Status Dot */}
          <div className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1c1917]" />
        </div>
      </div>
    );
  }

  // --- სრულად გახსნილი ფანჯარა ---
  return (
    <div
      className={cn(
        "fixed bottom-6 z-50 w-[340px] h-[480px] bg-[#1c1917] shadow-[0_20px_50px_rgba(0,0,0,0.5)]",
        "flex flex-col border-2 border-stone-800 rounded-[24px] overflow-hidden transition-all duration-300"
      )}
      style={{ right: `${24 + index * 360}px` }}
    >
      {/* Header - უფრო მრგვალი და სუფთა */}
      <div className="p-4 bg-stone-900/50 backdrop-blur-md border-b border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <UserAvatarItem user={chat.user} size="sm" showName={false} />
          <div>
            <h3 className="text-[11px] font-black text-stone-200 uppercase tracking-tighter leading-none">
              {chat.user.firstName}
            </h3>
            <span className="text-[9px] font-mono text-amber-500/60 uppercase">
              Frequency Active
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => dispatch(toggleMinimize(chat.id))}
            className="p-2 hover:bg-stone-800 rounded-full text-stone-500 transition-colors"
          >
            <Minus size={16} />
          </button>
          <button
            onClick={() => dispatch(closeChat(chat.id))}
            className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-full text-stone-500 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Messages Area - მომრგვალებული მესიჯებით */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#11100f] custom-scrollbar">
        {messages.map((msg) => {
          const isMine = msg.senderId === currentUser?.id;
          return (
            <div
              key={msg.id}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={cn(
                  "max-w-[75%] px-4 py-2.5 text-[11px] font-medium leading-relaxed",
                  isMine
                    ? "bg-amber-600 text-stone-950 rounded-[18px] rounded-br-none shadow-lg shadow-amber-600/10"
                    : "bg-stone-800 text-stone-200 rounded-[18px] rounded-bl-none"
                )}
              >
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - მრგვალი ინფუთით */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (inputValue.trim()) {
            sendMessage(inputValue);
            setInputValue("");
          }
        }}
        className="p-4 bg-stone-900/30 border-t border-stone-800"
      >
        <div className="flex items-center gap-2 bg-stone-900 rounded-full border border-stone-800 p-1 pl-4 focus-within:border-amber-600/50 transition-all">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Signal message..."
            className="flex-1 bg-transparent py-2 text-[11px] font-mono text-stone-200 focus:outline-none placeholder:text-stone-700"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-amber-600 text-stone-900 hover:bg-amber-500 disabled:opacity-20 transition-all"
          >
            <Send size={14} />
          </button>
        </div>
      </form>
    </div>
  );
};
