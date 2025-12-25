import { ConversationParticipant } from "@/types/messaging.types";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";

interface ChatHeaderProps {
  partner: ConversationParticipant;
}

export const ChatHeader = ({ partner }: ChatHeaderProps) => {
  const user = partner?.user;
  console.log(user);
  return (
    <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-neutral-900">
      <div className="flex items-center gap-3">
        <Image
          src={user?.avatar?.url || "/default-avatar.png"}
          alt={user?.firstName || "User"}
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-white">
              {user?.firstName} {user?.lastName}
            </span>
            {user?.isVerified && (
              <ShieldCheck className="w-4 h-4 text-orange-500" />
            )}
          </div>
          <div className="text-sm text-neutral-400">@{user?.username}</div>
        </div>
      </div>
      <div className="flex items-center gap-2 text-green-500 text-sm">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span>ENCRYPTED</span>
      </div>
    </div>
  );
};
