import { Conversation } from "@/types/messaging.types";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import { UserAvatarItem } from "../ui/UserAvatarItem";

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
      className={`p-1 border-b border-border/50 cursor-pointer transition-all hover:bg-primary-hover/10 ${
        isActive ? "bg-accent/20 border-r-4 border-r-accent" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <UserAvatarItem
            key={user?.avatar}
            user={user}
            size="sm"
            showName={false}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-white truncate">
              {user.firstName} {user.lastName}
            </span>
            {user.isVerified && (
              <ShieldCheck className="w-4 h-4 text-accent flex-shrink-0" />
            )}
          </div>
          <div className="text-sm text-text-secondary truncate">
            @{user.username}
          </div>
        </div>
        {conversation.unreadCount && conversation.unreadCount > 0 && (
          <div className="bg-accent text-white text-xs rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
            {conversation.unreadCount}
          </div>
        )}
      </div>
    </div>
  );
};
