import { useState, useRef, useCallback } from "react";
import { Socket } from "socket.io-client";

export const useTyping = (
  socket: Socket | null,
  conversationId: string | null
) => {
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const emitTyping = useCallback(
    (typing: boolean) => {
      if (!socket || !conversationId) return;
      socket.emit("typing", {
        conversationId,
        isTyping: typing,
      });
    },
    [socket, conversationId]
  );

  const handleTypingStart = useCallback(() => {
    if (!isTyping) {
      setIsTyping(true);
      emitTyping(true);
    }

    // Clear timeout-ი და დავაყენოთ ახალი
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      emitTyping(false);
    }, 1000);
  }, [isTyping, emitTyping]);

  const handleTypingStop = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    setIsTyping(false);
    emitTyping(false);
  }, [emitTyping]);

  const addTypingUser = useCallback((userId: string) => {
    setTypingUsers((prev) => new Set(prev).add(userId));
  }, []);

  const removeTypingUser = useCallback((userId: string) => {
    setTypingUsers((prev) => {
      const newSet = new Set(prev);
      newSet.delete(userId);
      return newSet;
    });
  }, []);

  return {
    typingUsers,
    isTyping,
    handleTypingStart,
    handleTypingStop,
    addTypingUser,
    removeTypingUser,
  };
};
