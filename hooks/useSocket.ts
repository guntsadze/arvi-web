import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const useSocket = (conversationId?: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  // 1. Socket-ის შექმნა და authentication (მხოლოდ ერთხელ)
  useEffect(() => {
    const token = document.cookie.match(/(^| )token=([^;]+)/);

    if (!token) {
      console.warn("No auth token found");
      return;
    }

    const socketInstance = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"], // უკეთესი კავშირისთვის
    });

    socketInstance.on("connect", () => {
      console.log("✅ Socket connected:", socketInstance.id);
    });

    socketInstance.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error);
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("🔌 Socket disconnected:", reason);
    });

    setSocket(socketInstance);

    // Cleanup: socket-ის გათიშვა component unmount-ზე
    return () => {
      console.log("🧹 Cleaning up socket connection");
      socketInstance.disconnect();
    };
  }, []); // ცარიელი dependency array - მხოლოდ ერთხელ შეიქმნას

  // 2. Room-ში შესვლა/გასვლა (როცა conversationId იცვლება)
  useEffect(() => {
    if (!socket || !conversationId) return;

    console.log(`🚪 Joining conversation room: ${conversationId}`);
    socket.emit("joinConversation", conversationId);

    // Cleanup: როცა conversationId იცვლება ან component unmount-დება
    return () => {
      console.log(`🚪 Leaving conversation room: ${conversationId}`);
      socket.emit("leaveConversation", conversationId);
    };
  }, [socket, conversationId]); // მხოლოდ როცა socket ან conversationId იცვლება

  return socket;
};
