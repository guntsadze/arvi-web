import { Conversation } from "@/services/messaging.service";
import { formatDistanceToNow } from "date-fns";
import { ka } from "date-fns/locale";

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
            className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition ${
              activeId === conv.id ? "bg-blue-50" : ""
            }`}
          >
            <div className="relative">
              <img
                src={otherUser?.avatar || "/default-avatar.png"}
                className="w-12 h-12 rounded-full object-cover"
                alt="avatar"
              />
              {conv.unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center">
                  {conv.unreadCount}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <h4 className="font-semibold truncate">
                  {otherUser?.firstName} {otherUser?.lastName}
                </h4>
                <span className="text-[10px] text-gray-500">
                  {formatDistanceToNow(new Date(conv.lastMessageAt), {
                    locale: ka,
                  })}
                </span>
              </div>
              <p className="text-sm text-gray-500 truncate">
                {lastMsg?.content || "სურათი/ფაილი"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
