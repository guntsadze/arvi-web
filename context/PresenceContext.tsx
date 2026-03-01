"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { io } from "socket.io-client";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/store/slices/userSlice";
import Cookie from "js-cookie";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface PresenceContextType {
  onlineUsers: string[];
  isUserOnline: (userId: string) => boolean;
}

const PresenceContext = createContext<PresenceContextType | undefined>(
  undefined,
);

export const PresenceProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const currentUser = useAppSelector(selectCurrentUser);

  useEffect(() => {
    const token = Cookie.get("token");
    console.log("🚀 ~ PresenceProvider ~ token:", token);

    // თუ იუზერი არ არის ან ტოკენი არ გვაქვს, არ ვუკავშირდებით
    if (!currentUser?.id || !token) {
      setOnlineUsers([]);
      return;
    }

    const socket = io(`${SOCKET_URL}/presence`, {
      auth: { token, userId: currentUser.id },
      transports: ["websocket"],
    });

    socket.on("onlineUsersList", (users: string[]) => setOnlineUsers(users));
    socket.on("userOnline", (userId: string) => {
      setOnlineUsers((prev) => Array.from(new Set([...prev, userId])));
    });
    socket.on("userOffline", (userId: string) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
    });

    return () => {
      socket.disconnect();
    };
  }, [currentUser?.id]); // 👈 მხოლოდ ID-ზე დამოკიდებულება

  const isUserOnline = useCallback(
    (userId: string) => onlineUsers.includes(userId),
    [onlineUsers],
  );

  const value = useMemo(
    () => ({ onlineUsers, isUserOnline }),
    [onlineUsers, isUserOnline],
  );

  return (
    <PresenceContext.Provider value={value}>
      {children}
    </PresenceContext.Provider>
  );
};

export const usePresence = () => {
  const context = useContext(PresenceContext);
  if (!context)
    throw new Error("usePresence must be used within PresenceProvider");
  return context;
};
