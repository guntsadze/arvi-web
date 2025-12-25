"use client";

import { useState, useEffect, useRef } from "react";
import { X, Minus, Send, Paperclip } from "lucide-react";
import { FloatingChat } from "@/types/chat.types";
import { useAppDispatch } from "@/store/hooks";
import { closeChat, toggleMinimize } from "@/store/slices/floatingChatsSlice";
import { useSocket } from "@/hooks/useSocket";
import { useMessages } from "@/hooks/useMessages";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/store/slices/userSlice";
import Image from "next/image";

interface FloatingChatWindowProps {
  chat: FloatingChat;
  index: number; // რიგითი ნომერი positioning-ისთვის
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

  // Load messages on mount
  useEffect(() => {
    if (!chat.isMinimized) {
      loadMessages();
      markAsRead();
    }
  }, [chat.conversationId, chat.isMinimized, loadMessages, markAsRead]);

  // Socket listeners
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg: any) => {
      if (msg?.conversationId === chat.conversationId) {
        addMessage(msg);
        if (!chat.isMinimized) {
          markAsRead();
        }
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.emit("joinConversation", chat.conversationId);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.emit("leaveConversation", chat.conversationId);
    };
  }, [socket, chat.conversationId, chat.isMinimized, addMessage, markAsRead]);

  // Auto scroll to bottom
  useEffect(() => {
    if (!chat.isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, chat.isMinimized]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    await sendMessage(inputValue);
    setInputValue("");
  };

  const handleClose = () => {
    dispatch(closeChat(chat.id));
  };

  const handleToggleMinimize = () => {
    dispatch(toggleMinimize(chat.id));
  };

  // Position calculation - Facebook style
  const rightPosition = 16 + index * 330; // 16px base + 330px per chat

  return (
    <div
      className="fixed bottom-0 z-50 bg-[#1c1917] border-2 border-stone-800 shadow-2xl flex flex-col transition-all duration-300"
      style={{
        right: `${rightPosition}px`,
        width: "320px",
        height: chat.isMinimized ? "52px" : "450px",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between p-3 bg-stone-900 border-b-2 border-stone-800 cursor-pointer"
        onClick={handleToggleMinimize}
      >
        <div className="flex items-center gap-2">
          <Image
            src={chat.user?.avatar?.url || "/default-avatar.png"}
            alt={chat.user.firstName}
            width={32}
            height={32}
            className="rounded-full border-2 border-stone-700"
          />
          <div>
            <h3 className="text-xs font-black text-stone-200 uppercase tracking-wider">
              {chat.user.firstName} {chat.user.lastName}
            </h3>
            <span className="text-[9px] font-mono text-green-500">ONLINE</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleMinimize();
            }}
            className="p-1 hover:bg-stone-800 text-stone-400 hover:text-amber-500 transition-colors"
          >
            <Minus size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            className="p-1 hover:bg-stone-800 text-stone-400 hover:text-red-500 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Messages - only visible when not minimized */}
      {!chat.isMinimized && (
        <>
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-[#11100f] custom-scrollbar">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <span className="text-stone-500 text-xs">Loading...</span>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <span className="text-stone-500 text-xs">No messages yet</span>
              </div>
            ) : (
              messages.map((msg) => {
                const isMine = msg.senderId === currentUser?.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${
                      isMine ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] px-3 py-2 text-[11px] font-mono ${
                        isMine
                          ? "bg-amber-600 text-stone-900 border-2 border-amber-800"
                          : "bg-stone-800 text-stone-200 border-2 border-stone-700"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSend}
            className="p-2 bg-[#1a1918] border-t-2 border-stone-800"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="TYPE MESSAGE..."
                className="flex-1 bg-stone-900 border-2 border-stone-800 px-2 py-1 text-[10px] font-mono text-amber-500 focus:outline-none focus:border-amber-600 uppercase"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="p-2 bg-amber-600 border-2 border-amber-800 text-stone-900 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send size={14} />
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};
