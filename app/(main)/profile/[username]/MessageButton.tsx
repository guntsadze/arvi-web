"use client";
import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { messagingService } from "@/services/messaging.service";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/store/slices/userSlice";

export default function MessageButton({ userId }: { userId: string }) {
  const currentUser = useAppSelector(selectCurrentUser);

  if (!currentUser || currentUser?.id === userId) {
    return null;
  }
  const router = useRouter();

  const handleMessageClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      const res = await messagingService.getOrCreateConversation(userId);
      if (res?.id) {
        router.push(`/messages?id=${res.id}`);
      }
    } catch (error) {
      console.error("ჩატის გახსნა ვერ მოხერხდა");
    }
  };

  return (
    <button
      onClick={handleMessageClick}
      className="flex-1 md:flex-none flex items-center justify-center px-6 py-2.5 md:py-3 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white font-black uppercase italic tracking-tighter transition-all skew-x-[-12deg] active:translate-y-[1px]"
    >
      <span className="skew-x-[12deg]">
        <MessageSquare size={18} />
      </span>
    </button>
  );
}
