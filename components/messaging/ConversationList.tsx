import { Conversation } from "@/types/messaging.types";
import { ConversationItem } from "./ConversationItem";
import { Hash } from "lucide-react";

interface ConversationListProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelectConversation: (id: string) => void;
  loading?: boolean;
}

export const ConversationList = ({
  conversations,
  activeId,
  onSelectConversation,
  loading = false,
}: ConversationListProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-neutral-400">იტვირთება...</div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <Hash className="w-12 h-12 text-neutral-600 mb-4" />
        <p className="text-neutral-400">საუბრები არ მოიძებნა</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-neutral-800">
        <div className="flex items-center gap-2 text-neutral-400">
          <Hash className="w-5 h-5" />
          <span className="text-sm font-medium">Active Channels</span>
        </div>
      </div>
      <div className="overflow-y-auto flex-1">
        {conversations.map((conv) => (
          <ConversationItem
            key={conv.id}
            conversation={conv}
            isActive={activeId === conv.id}
            onClick={() => onSelectConversation(conv.id)}
          />
        ))}
      </div>
    </div>
  );
};
