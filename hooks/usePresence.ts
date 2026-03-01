import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/store/slices/userSlice";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL;

export const usePresence = () => {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  console.log("🚀 ~ usePresence ~ onlineUsers:", onlineUsers);
  const currentUser = useAppSelector(selectCurrentUser);

  useEffect(() => {
    if (!currentUser) return;

    const socket = io(`${SOCKET_URL}/presence`, {
      auth: { userId: currentUser.id },
      transports: ["websocket"],
    });

    socket.on("onlineUsersList", (users: string[]) => {
      setOnlineUsers(users);
    });

    socket.on("userOnline", (userId: string) => {
      setOnlineUsers((prev) => [...new Set([...prev, userId])]);
    });

    socket.on("userOffline", (userId: string) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
    });

    return () => {
      socket.disconnect();
    };
  }, [currentUser]);

  const isUserOnline = (userId: string) => onlineUsers.includes(userId);

  return { onlineUsers, isUserOnline };
};
