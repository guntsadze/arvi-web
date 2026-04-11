"use client";

import { useState } from "react";
import { Plus, Search, Network, Terminal, Loader2 } from "lucide-react";
import { groupsService } from "@/services/groups.service";
import { GroupCard } from "@/components/groups/GroupCard";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { GroupForm } from "@/components/groups/groupForm/GroupForm";

export default function GroupsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: groups,
    loading,
    refresh,
  } = useInfiniteScroll(
    (page) => groupsService.getGroups(page, 12, searchQuery),
    [searchQuery],
  );

  return (
    <div className="min-h-screen bg-[#1c1917] relative">
      {isModalOpen && (
        <GroupForm
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            refresh(); // წარმატების შემთხვევაში დაარეფრეშებს სიას
          }}
        />
      )}
      {/* GLOBAL BACKGROUND GRID */}
      <div
        className="fixed inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #44403c 1px, transparent 1px),
            linear-gradient(to bottom, #44403c 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* SCANLINE EFFECT */}
      <div className="fixed top-0 left-0 w-full h-1 bg-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.3)] animate-scan opacity-20 pointer-events-none z-50" />

      <div className="relative z-10 max-w-6xl mx-auto py-10 px-4">
        {/* HEADER DECORATION */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-stone-700" />
          <div className="flex flex-col items-center gap-1">
            <Network className="text-amber-700" size={20} />
            <span className="text-[8px] font-mono text-stone-300 uppercase tracking-[0.4em]">
              Network Nodes
            </span>
          </div>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-stone-700" />
        </div>

        {/* SEARCH & CREATE BAR (Styled like PostForm) */}
        <div className="mb-16 bg-[#201d1b] border border-stone-800 p-6 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-700/50" />

          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300"
                size={18}
              />
              <input
                type="text"
                placeholder="ძებნა..."
                className="w-full bg-[#1c1917] border border-stone-800 py-3 pl-10 pr-4 text-stone-300 font-mono text-sm focus:outline-none focus:border-amber-900/50 transition-colors placeholder:text-stone-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="w-full md:w-auto">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 px-6 py-3 transition-all group/btn relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-amber-500/5 translate-y-full group-hover/btn:translate-y-0 transition-transform" />
                <Plus size={18} className="text-amber-700" />
                <span className="font-mono text-xs uppercase tracking-widest">
                  ჯგუფის დამატება
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* GROUPS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group: any) => (
            <div
              key={group.id}
              className="transform transition-transform hover:-translate-y-1"
            >
              <GroupCard group={group} />
            </div>
          ))}
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="animate-spin text-amber-700" size={32} />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#EBE9E1] animate-pulse">
              ...
            </span>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && groups.length === 0 && (
          <div className="text-center py-32 border border-stone-800 bg-[#201d1b] relative">
            <div className="absolute top-2 left-2">
              <Terminal size={14} className="text-stone-300" />
            </div>
            <p className="text-stone-300 font-mono text-sm uppercase tracking-[0.2em]">
              ინფორმაცია არ არის
            </p>
            <p className="text-stone-300 text-[10px] mt-4 font-mono uppercase">
              Sector {searchQuery ? `"${searchQuery}"` : "0-0"} is currently
              desolate.
            </p>
          </div>
        )}

        {/* FOOTER DECORATION (Optional) */}
        {!loading && groups.length > 0 && (
          <div className="mt-20 flex flex-col items-center opacity-30">
            <div className="w-1 h-12 bg-gradient-to-b from-amber-700 to-transparent" />
            <span className="text-[10px] font-mono text-stone-300 mt-2 tracking-[0.5em]">
              EOF
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
