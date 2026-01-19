"use client";

import { Group } from "@/types/groups.types";
import { Activity, ShieldCheck, Settings } from "lucide-react";

export const GroupHeader = ({ group }: { group: Group }) => {
  return (
    <div className="relative border-b border-stone-800 bg-[#201d1b]/50 backdrop-blur-md overflow-hidden">
      {/* Cover Photo Area */}
      <div className="h-48 md:h-64 bg-stone-900 relative">
        {group.coverPhoto ? (
          <img
            src={group.coverPhoto}
            className="w-full h-full object-cover opacity-40"
          />
        ) : (
          <div
            className="w-full h-full opacity-10"
            style={{
              backgroundImage: `radial-gradient(#44403c 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1c1917] to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto px-4 relative">
        <div className="flex flex-col md:flex-row items-end gap-6 -mt-16 pb-8">
          {/* Avatar */}
          <div className="w-32 h-32 bg-[#201d1b] border-2 border-stone-800 p-1 relative shadow-2xl">
            {group.avatar ? (
              <img src={group.avatar} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-stone-950 flex items-center justify-center font-mono text-stone-800 text-[10px]">
                NO_IMG
              </div>
            )}
            <div className="absolute -bottom-2 -right-2 bg-amber-700 p-1.5 border border-[#1c1917]">
              <Activity size={14} className="text-stone-950" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold font-mono uppercase tracking-tighter text-stone-100">
                {group.name}
              </h1>
              <ShieldCheck size={20} className="text-amber-800 opacity-50" />
            </div>
            <p className="font-mono text-[10px] text-stone-500 uppercase tracking-widest">
              Uptime: {new Date(group.createdAt).toLocaleDateString()} // Nodes:{" "}
              {group.membersCount}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pb-2">
            <button className="bg-amber-700/10 border border-amber-900/30 text-amber-600 px-6 py-2 font-mono text-[10px] uppercase tracking-widest hover:bg-amber-700/20 transition-all">
              Join_Sequence
            </button>
            <button className="bg-stone-900 border border-stone-800 p-2 hover:border-stone-700 transition-all">
              <Settings size={18} className="text-stone-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
