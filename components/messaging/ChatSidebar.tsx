import { Conversation } from "@/services/messaging.service";
import { formatDistanceToNow } from "date-fns";
import { ka } from "date-fns/locale";
import { UserAvatarItem } from "../ui/UserAvatarItem";

export const ChatSidebar = ({
  conversations,
  activeId,
  onSelect,
}: {
  conversations: Conversation[];
  activeId?: string;
  onSelect: (c: Conversation) => void;
}) => {
  return (
    <div className="w-full md:w-80 border-r h-full overflow-y-auto bg-white">
      <div className="p-4 font-bold text-xl border-b">შეტყობინებები</div>
      {conversations?.map((conv) => {
        const otherUser = conv.participants[0]?.user;
        const lastMsg = conv.messages[0];

        return (
          <div
            key={conv.id}
            onClick={() => onSelect(conv)}
            className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-surface-1-hover transition ${
              activeId === conv.id ? "bg-info/10" : ""
            }`}
          >
            <div className="relative">
              <UserAvatarItem key={otherUser?.id} user={otherUser} />
              {conv.unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-error text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center">
                  {conv.unreadCount}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <h4 className="font-semibold truncate">
                  {otherUser?.firstName} {otherUser?.lastName}
                </h4>
                <span className="text-[10px] text-text-muted">
                  {formatDistanceToNow(new Date(conv.lastMessageAt), {
                    locale: ka,
                  })}
                </span>
              </div>
              <p className="text-sm text-text-muted truncate">
                {lastMsg?.content || "სურათი/ფაილი"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
