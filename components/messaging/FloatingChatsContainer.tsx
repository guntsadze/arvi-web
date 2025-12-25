"use client";

import { useAppSelector } from "@/store/hooks";
import { selectOpenChats } from "@/store/slices/floatingChatsSlice";
import { FloatingChatWindow } from "./FloatingChatWindow";

export const FloatingChatsContainer = () => {
  const openChats = useAppSelector(selectOpenChats);

  console.log(openChats);
  return (
    <>
      {openChats.map((chat, index) => (
        <FloatingChatWindow key={chat.id} chat={chat} index={index} />
      ))}
    </>
  );
};
