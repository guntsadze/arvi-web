import { MessageCircle } from "lucide-react";

interface MessagesDropdownProps {
  conversations: any[];
  onOpenChat: (conv: any) => void;
  getOtherParticipant: (conv: any) => any;
}

export const MessagesDropdown = ({
  conversations,
  onOpenChat,
  getOtherParticipant,
}: MessagesDropdownProps) => (
  <>
    <div className="p-3 border-b-2 border-stone-800 bg-stone-900/50">
      <h3 className="font-black uppercase text-xs text-stone-300 flex items-center gap-2">
        <MessageCircle size={14} className="text-amber-500" /> Messages
      </h3>
    </div>
    <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
      {conversations.length === 0 ? (
        <div className="p-6 text-center text-stone-600 text-[10px] font-mono italic">
          NO ACTIVE FREQUENCIES
        </div>
      ) : (
        conversations.map((conv) => {
          const other = getOtherParticipant(conv);
          return (
            <div
              key={conv.id}
              onClick={() => onOpenChat(conv)}
              className="p-3 border-b border-stone-800 hover:bg-stone-800/50 cursor-pointer flex gap-3 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-stone-800 border border-stone-700 flex-shrink-0 overflow-hidden">
                {other?.avatar ? (
                  <img
                    src={other.avatar}
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </div>
              <div className="min-w-0">
                <h4 className="text-[11px] font-bold text-stone-200 truncate uppercase">
                  {other?.username}
                </h4>
                <p className="text-[10px] text-stone-500 truncate italic font-mono">
                  {conv.messages?.[0]?.content || "No messages..."}
                </p>
              </div>
            </div>
          );
        })
      )}
    </div>
    <a
      href="/messages"
      className="p-3 text-center text-[10px] font-black text-amber-500 bg-stone-900/50 hover:bg-stone-800 transition-all uppercase"
    >
      Open Comms Center
    </a>
  </>
);
