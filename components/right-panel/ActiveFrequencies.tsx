import { usePresence } from "@/context/PresenceContext";
import { Radio, Search } from "lucide-react";
import { useState } from "react";

export const ActiveFrequencies = ({
  conversations,
  onOpenChat,
  getOtherParticipant,
}: any) => {
  const [query, setQuery] = useState("");
  const { isUserOnline } = usePresence();

  // ფილტრაცია პირდაპირ რენდერში
  const filtered = conversations.filter((conv: any) => {
    const user = getOtherParticipant(conv);
    const searchTarget =
      `${user?.username} ${conv.messages?.[0]?.content}`.toLowerCase();
    return searchTarget.includes(query.toLowerCase());
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Search Header */}
      <div className="p-4 space-y-3 border-b border-border/50">
        {/* <h3 className="font-black uppercase text-[10px] tracking-widest text-text-secondary flex items-center gap-2">
          <Radio size={14} className="text-accent animate-pulse" />
        </h3> */}

        <div className="relative group">
          <Search
            size={12}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-primary group-focus-within:text-accent transition-colors"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ძებნა..."
            className="w-full bg-surface-1 border border-border pl-8 pr-3 py-1.5 text-[10px] text-text-secondary focus:outline-none focus:border-accent/50 transition-all uppercase font-mono"
          />
        </div>
      </div>

      {/* List Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
        {filtered.length === 0 ? (
          <p className="text-[9px] text-text-primary italic text-center py-10 font-mono">
            ინფორმაცია არ არის
          </p>
        ) : (
          filtered.map((conv: any) => {
            const user = getOtherParticipant(conv);
            return (
              <button
                key={conv.id}
                onClick={() => onOpenChat(conv)}
                className="w-full text-left bg-surface-1 border border-border p-3 hover:border-accent/50 transition-all group relative overflow-hidden"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-black text-text-secondary uppercase group-hover:text-accent transition-colors">
                    {user?.username}
                  </span>
                  <div
                    className={`w-1 h-1 rounded-full ${
                      isUserOnline(user?.id)
                        ? "bg-success shadow-[0_0_5px_green]"
                        : "bg-surface-2"
                    }`}
                  />
                </div>
                <p className="text-[9px] font-mono text-text-primary truncate group-hover:text-text-secondary transition-colors">
                  {conv.messages?.[0]?.content || "NO SIGNAL..."}
                </p>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
