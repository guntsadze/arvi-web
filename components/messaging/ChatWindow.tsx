import { useEffect, useState } from "react";
import { useSocket } from "@/hooks/useSocket";
import { messagingService } from "@/services/messaging.service";

export const ChatWindow = ({
  conversationId,
  currentUser,
}: {
  conversationId: string;
  currentUser: any;
}) => {
  const [messages, setMessages] = useState([]);
  const socket = useSocket(conversationId); // სოკეტთან კავშირი

  // საწყისი მესიჯების წამოღება
  useEffect(() => {
    messagingService.getMessages(conversationId).then((data) => {
      setMessages(data.reverse());
    });
  }, [conversationId]);

  // რეალურ დროში ახალი მესიჯების მოსმენა
  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
      // წავიკითხოთ ავტომატურად თუ ამ ჩატში ვართ
      messagingService.markAsRead(conversationId);
    });

    return () => {
      socket.off("newMessage");
    };
  }, [socket, conversationId]);

  // გაგზავნის ფუნქცია (იგივე რჩება, რადგან Backend აგვარებს სოკეტში გადაცემას)
  const handleSend = async (content: string) => {
    await messagingService.sendMessage({ conversationId, content });
  };

  // ... (UI კოდი იგივეა რაც წინა პასუხში)
};
