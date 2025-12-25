// კომპონენტი: MessageButton.tsx
"use client";
import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { messagingService } from "@/services/messaging.service";

export default function MessageButton({ userId }: { userId: string }) {
  const router = useRouter();

  const handleMessageClick = async () => {
    try {
      const res = await messagingService.getOrCreateConversation(userId);

      // res არის ის ობიექტი, რომელიც ბექენდმა დააბრუნა
      if (res && res.id) {
        console.log("წარმატება! გადავდივართ ID-ზე:", res.id);
        router.push(`/messages?id=${res.id}`);
      } else {
        console.error("ბექენდმა დააბრუნა პასუხი ID-ის გარეშე:", res);
      }
    } catch (error: any) {
      // უსაფრთხო ლოგირება
      const errorMsg =
        error?.response?.data?.message || error?.message || "Unknown error";
      console.error("ჩატის გახსნა ვერ მოხერხდა:", errorMsg);
    }
  };

  return (
    <button
      onClick={handleMessageClick}
      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 font-black uppercase italic tracking-tighter transition-all skew-x-[-12deg]"
    >
      <span className="inline-block skew-x-[12deg]">
        <MessageSquare size={18} />
      </span>
    </button>
  );
}
