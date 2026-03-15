"use client";
import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { messagingService } from "@/services/messaging.service";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/store/slices/userSlice";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function MessageButton({ userId }: { userId: string }) {
  const currentUser = useAppSelector(selectCurrentUser);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  if (!currentUser || currentUser?.id === userId) return null;

  const handleMessageClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await messagingService.getOrCreateConversation(userId);
      if (res?.id) router.push(`/messages?id=${res.id}`);
    } catch (error) {
      console.error("ჩატის გახსნა ვერ მოხერხდა");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleMessageClick}
      disabled={isLoading}
      className="
        w-[34px] h-[34px] flex items-center justify-center flex-shrink-0
        bg-transparent border border-stone-700 rounded
        text-stone-400 hover:border-stone-500 hover:text-stone-200
        transition-all duration-150
        disabled:opacity-40 disabled:cursor-not-allowed
      "
    >
      {isLoading ? (
        <Loader2 size={13} className="animate-spin" />
      ) : (
        <MessageSquare size={13} />
      )}
    </button>
  );
}
