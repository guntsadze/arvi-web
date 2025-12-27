import { Conversation } from "@/types/messaging.types";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

export const ConversationItem = ({
  conversation,
  isActive,
  onClick,
}: ConversationItemProps) => {
  const partner = conversation.participants[0];
  const user = partner?.user;

  if (!user) return null;

  return (
    <div
      onClick={onClick}
      className={`p-4 border-b border-neutral-800/50 cursor-pointer transition-all hover:bg-orange-500/10 ${
        isActive ? "bg-orange-500/20 border-r-4 border-r-orange-500" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <Image
            src={user.avatar?.url}
            alt={user.firstName}
            width={48}
            height={48}
            className="rounded-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-white truncate">
              {user.firstName} {user.lastName}
            </span>
            {user.isVerified && (
              <ShieldCheck className="w-4 h-4 text-orange-500 flex-shrink-0" />
            )}
          </div>
          <div className="text-sm text-neutral-400 truncate">
            @{user.username}
          </div>
        </div>
        {conversation.unreadCount && conversation.unreadCount > 0 && (
          <div className="bg-orange-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
            {conversation.unreadCount}
          </div>
        )}
      </div>
    </div>
  );
};
