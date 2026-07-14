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
import {
  selectCurrentUser,
  selectIsAuthenticated,
  selectIsInitialized,
} from "@/store/slices/userSlice";

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
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isInitialized = useAppSelector(selectIsInitialized);

  useEffect(() => {
    // Only open the socket once the session has been verified against the
    // backend (isInitialized) AND that verification succeeded
    // (isAuthenticated). This closes the window where a stale/optimistic
    // currentUser.id could trigger a connect attempt before the real
    // session is confirmed.
    if (!isInitialized || !isAuthenticated || !currentUser?.id) {
      setOnlineUsers([]);
      return;
    }

    const socket = io(`${SOCKET_URL}/presence`, {
      withCredentials: true,
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
  }, [currentUser?.id, isAuthenticated, isInitialized]);

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
