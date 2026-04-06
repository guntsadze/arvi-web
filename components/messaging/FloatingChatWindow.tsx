"use client";

import { useState, useEffect, useRef } from "react";
import { X, Minus, Send, Smile } from "lucide-react";
import { FloatingChat } from "@/types/chat.types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeChat, toggleMinimize } from "@/store/slices/floatingChatsSlice";
import { useMessages } from "@/hooks/useMessages";
import { selectCurrentUser } from "@/store/slices/userSlice";
import { UserAvatarItem } from "../ui/UserAvatarItem";
import { cn } from "@/lib/utils";
import { usePresence } from "@/context/PresenceContext";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

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
  const { isUserOnline } = usePresence();
  const online = isUserOnline(chat.user.id);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isTypingSent, setIsTypingSent] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    typingUsers,
    sendMessage,
    markAsRead,
    sendTyping,
    sendStopTyping,
    loadMessages,
  } = useMessages(chat.conversationId);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onEmojiClick = (emojiData: any) => {
    setInputValue((prev) => prev + emojiData.emoji);
  };

  useEffect(() => {
    if (!chat.isMinimized) {
      loadMessages();
      markAsRead();
    }
  }, [chat.conversationId, chat.isMinimized, loadMessages, markAsRead]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.length > 0 && !isTypingSent) {
      // თუ პირველი სიმბოლო დაიწერა
      sendTyping();
      setIsTypingSent(true);
    } else if (value.length === 0 && isTypingSent) {
      // თუ ყველაფერი წაიშალა
      sendStopTyping();
      setIsTypingSent(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const text = inputValue;
      setInputValue("");
      setIsTypingSent(false);
      await sendMessage(text);
    }
  };

  useEffect(() => {
    if (!chat.isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, chat.isMinimized]);

  if (chat.isMinimized) {
    return (
      <div
        className="fixed bottom-0 z-50 transition-all duration-300 group"
        style={{ right: `${24 + index * 180}px` }} // გავზარდეთ დაშორება, რადგან ტაბი უფრო განიერია
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            dispatch(closeChat(chat.id));
          }}
          className="absolute -top-2 -right-1 z-20 bg-red-600 text-white p-0.5 opacity-0 group-hover:opacity-100 transition-opacity border border-black shadow-lg"
        >
          <X size={10} />
        </button>

        {/* Minimized Tab UI */}
        <div
          onClick={() => dispatch(toggleMinimize(chat.id))}
          className={cn(
            "cursor-pointer w-[160px] h-10 bg-stone-950 border-t-2 border-x border-stone-800",
            "flex items-center gap-2 px-2 hover:bg-stone-900 transition-all relative overflow-hidden",
            "border-t-amber-600 shadow-[0_-4px_10px_rgba(0,0,0,0.5)]",
          )}
        >
          {/* Scanline effect for minimized tab */}
          <div className="absolute inset-0 pointer-events-none opacity-5  bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_2px]" />

          <UserAvatarItem
            user={chat.user}
            size="exsm"
            showName={false}
            disableLink={true}
            className="w-7 h-7 scale-75"
            isOnline={online}
          />

          <div className="flex flex-col flex-1 truncate">
            <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest truncate">
              {chat.user.firstName}
            </span>
          </div>

          {/* Activity light */}
          <div
            className={cn(
              "w-1 h-1 rounded-full",
              online ? "bg-green-500 shadow-[0_0_5px_#22c55e]" : "bg-stone-800",
            )}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "fixed bottom-0 z-50 w-[320px] h-[450px] bg-[#0a0a0a] flex flex-col transition-all duration-300",
        "border-x border-t border-stone-800 shadow-[0_0_50px_rgba(0,0,0,0.8)]",
      )}
      style={{ right: `${24 + index * 340}px` }}
    >
      {/* Top Accent Bar */}
      <div className="h-1 w-full bg-amber-600 shadow-[0_0_10px_rgba(217,119,6,0.5)]" />

      {/* Header - Industrial Style */}
      <div className="p-3 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <UserAvatarItem
              user={chat.user}
              size="sm"
              showName={false}
              isOnline={online}
            />
          </div>
          <div>
            <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-widest leading-none">
              {chat.user.firstName} {chat.user.lastName}
            </h3>
          </div>
        </div>

        <div className="flex items-center">
          <button
            onClick={() => dispatch(toggleMinimize(chat.id))}
            className="p-1.5 hover:bg-stone-800 text-stone-300 hover:text-amber-500 transition-colors"
          >
            <Minus size={14} />
          </button>
          <button
            onClick={() => dispatch(closeChat(chat.id))}
            className="p-1.5 hover:bg-red-900/20 text-stone-300 hover:text-red-500 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Messages Area - Grid Pattern Background */}
      <div
        className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-4 bg-[#0c0c0c] custom-scrollbar"
        style={{
          backgroundImage:
            "linear-gradient(#151515 1px, transparent 1px), linear-gradient(90deg, #151515 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        {messages.map((msg) => {
          const isMine = msg.senderId === currentUser?.id;
          const isPending = msg.status === "pending";
          const isSeen = msg.isRead;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
            >
              <span className="text-[7px] font-mono text-[#EBE9E1] mb-1 uppercase tracking-tighter">
                {isMine ? "Operator" : chat.user.firstName} //
                {isPending
                  ? "TRANSMITTING..."
                  : new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
              </span>

              <div
                className={cn(
                  "relative max-w-[85%] px-3 py-2 text-[11px] font-mono border",
                  isMine
                    ? "bg-amber-600/10 border-amber-600/30 text-amber-500"
                    : "bg-stone-900 border-stone-700 text-stone-300",
                  isPending && "opacity-50",
                )}
              >
                {msg.content}
                {isMine && (
                  <div className="absolute top-0 right-0 w-1 h-1 bg-amber-600" />
                )}
              </div>

              {/* 👁️ SEEN INDICATOR (მხოლოდ ჩემს მესიჯებზე) */}
              {isMine && !isPending && isSeen && (
                <span className="text-[6px] font-mono text-amber-600/60 mt-1 uppercase tracking-widest">
                  // Seen
                </span>
              )}
            </div>
          );
        })}
        {Object.values(typingUsers).length > 0 && (
          <div className="text-[8px] font-mono text-amber-600/50 animate-pulse uppercase">
            // {Object.values(typingUsers).join(", ")} Typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div
            ref={emojiPickerRef}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-[70px] right-4 z-[100] shadow-2xl border border-stone-800 scrollbar-hide"
          >
            <EmojiPicker
              theme={"dark" as any}
              onEmojiClick={onEmojiClick}
              autoFocusSearch={false}
              width={280}
              height={350}
              skinTonesDisabled
              searchDisabled
              previewConfig={{ showPreview: false }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area - Command Line Style */}
      <form
        onSubmit={onSubmit}
        className="p-3 bg-stone-950 border-t border-stone-800"
      >
        <div className="flex items-center gap-2 border border-stone-800 bg-black p-1 transition-all focus-within:border-amber-600/50">
          <div className="pl-1 text-amber-600 font-mono text-[8px]">&gt;_</div>
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={cn(
              "pl-2 transition-colors",
              showEmojiPicker
                ? "text-amber-500"
                : "text-stone-700 hover:text-amber-600",
            )}
          >
            <Smile size={16} />
          </button>
          <input
            type="text"
            value={inputValue}
            autoFocus
            onFocus={markAsRead}
            onChange={handleInputChange}
            placeholder="TYPE_SIGNAL..."
            className="flex-1 bg-transparent py-2 text-[11px] font-mono text-amber-500 focus:outline-none placeholder:text-stone-400 uppercase"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="p-2 bg-stone-900 text-amber-600 hover:bg-amber-600 hover:text-black disabled:opacity-10 transition-all"
          >
            <Send size={12} />
          </button>
        </div>
      </form>

      {/* Bottom status bar */}
      <div className="px-3 py-1 bg-stone-950 border-t border-stone-900 flex justify-between items-center">
        <div className="text-[6px] font-mono text-stone-700 tracking-widest uppercase">
          Encrypted Channel // Node_{chat.conversationId.substring(0, 4)}
        </div>
        <div className="flex gap-1">
          <div className="w-1 h-1 bg-amber-600/30" />
          <div className="w-1 h-1 bg-amber-600/30" />
        </div>
      </div>
    </div>
  );
};
