import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const useSocket = (namespace: string = "/") => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const token = document.cookie.match(/(^| )token=([^;]+)/)?.at(2);

    if (!token) return;

    // ვუერთდებით კონკრეტულ namespace-ს (მაგ: /notifications)
    const socketInstance = io(`${SOCKET_URL}${namespace}`, {
      auth: { token },
      transports: ["websocket"],
    });

    socketInstance.on("connect", () => {
      console.log(`✅ Connected to namespace: ${namespace}`);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [namespace]);

  return socket;
};
