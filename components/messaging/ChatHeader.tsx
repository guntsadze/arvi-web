import { ConversationParticipant } from "@/types/messaging.types";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import { UserAvatarItem } from "../ui/UserAvatarItem";

interface ChatHeaderProps {
  partner: ConversationParticipant;
}

export const ChatHeader = ({ partner }: ChatHeaderProps) => {
  const user = partner?.user;
  console.log(user);
  return (
    <div className="flex items-center justify-between p-4 border-b border-border bg-surface-1">
      <div className="flex items-center gap-3">
        <UserAvatarItem key={user?.avatar} user={user} />
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-white">
              {user?.firstName} {user?.lastName}
            </span>
            {user?.isVerified && (
              <ShieldCheck className="w-4 h-4 text-accent" />
            )}
          </div>
          <div className="text-sm text-text-secondary">@{user?.username}</div>
        </div>
      </div>
      <div className="flex items-center gap-2 text-success text-sm">
        <div className="w-2 h-2 bg-success rounded-full"></div>
        <span>ENCRYPTED</span>
      </div>
    </div>
  );
};
