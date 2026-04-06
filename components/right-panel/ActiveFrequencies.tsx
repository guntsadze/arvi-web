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
      <div className="p-4 space-y-3 border-b border-stone-800/50">
        {/* <h3 className="font-black uppercase text-[10px] tracking-widest text-stone-300 flex items-center gap-2">
          <Radio size={14} className="text-amber-500 animate-pulse" />
        </h3> */}

        <div className="relative group">
          <Search
            size={12}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-600 group-focus-within:text-amber-500 transition-colors"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ძებნა..."
            className="w-full bg-[#12100e] border border-stone-800 pl-8 pr-3 py-1.5 text-[10px] text-stone-300 focus:outline-none focus:border-amber-600/50 transition-all uppercase font-mono"
          />
        </div>
      </div>

      {/* List Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
        {filtered.length === 0 ? (
          <p className="text-[9px] text-stone-600 italic text-center py-10 font-mono">
            ინფორმაცია არ არის
          </p>
        ) : (
          filtered.map((conv: any) => {
            const user = getOtherParticipant(conv);
            return (
              <button
                key={conv.id}
                onClick={() => onOpenChat(conv)}
                className="w-full text-left bg-[#1c1917] border border-stone-800 p-3 hover:border-amber-600/50 transition-all group relative overflow-hidden"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-black text-stone-400 uppercase group-hover:text-amber-500 transition-colors">
                    {user?.username}
                  </span>
                  <div
                    className={`w-1 h-1 rounded-full ${
                      isUserOnline(user?.id)
                        ? "bg-green-500 shadow-[0_0_5px_green]"
                        : "bg-stone-700"
                    }`}
                  />
                </div>
                <p className="text-[9px] font-mono text-stone-600 truncate group-hover:text-stone-300 transition-colors">
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
