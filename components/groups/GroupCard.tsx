"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Users, Globe, Lock, ArrowUpRight, Loader2, Plus } from "lucide-react";
import { Group } from "@/types/groups.types";
import { groupsService } from "@/services/groups.service";

export const GroupCard = ({ group }: { group: Group }) => {
  const [isJoining, setIsJoining] = useState(false);
  const [joined, setJoined] = useState(false); // იდეალურ შემთხვევაში ბექენდიდან უნდა მოდიოდეს group.isJoined

  const handleJoin = async (e: React.MouseEvent) => {
    e.preventDefault(); // რომ ლინკზე არ გადავიდეს
    e.stopPropagation();

    setIsJoining(true);
    try {
      await groupsService.joinGroup(group.id);
      setJoined(true);
    } catch (error) {
      console.error("JOIN_PROTOCOL_FAILED:", error);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="group relative bg-[#201d1b] border border-stone-800 p-5 shadow-2xl hover:border-stone-700 transition-all duration-500 overflow-hidden">
      {/* Visual Accents */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-stone-700 to-transparent opacity-30" />
      <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-amber-700 transition-all duration-500" />

      <Link href={`/groups/${group.slug}`} className="block space-y-5">
        {/* Header Area */}
        <div className="flex justify-between items-start">
          <div className="relative">
            <div className="w-14 h-14 bg-stone-900 border border-stone-800 p-1 relative z-10">
              {group.avatar ? (
                <img
                  src={group.avatar}
                  alt={group.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-stone-950">
                  <span className="text-[10px] font-mono text-stone-700 uppercase">
                    n_a
                  </span>
                </div>
              )}
            </div>
            {/* Shadow decoration */}
            <div className="absolute -bottom-1 -right-1 w-14 h-14 border border-stone-800/50 -z-0" />
          </div>

          <div className="text-right space-y-1">
            <div className="flex items-center justify-end gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-stone-500">
              {group.privacy === "PUBLIC" ? (
                <Globe size={10} className="text-emerald-700" />
              ) : (
                <Lock size={10} className="text-amber-700" />
              )}
              {group.privacy}
            </div>
            <div className="text-[8px] font-mono text-stone-800 uppercase tracking-widest">
              Sector_ID: {group.id.slice(-6)}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="space-y-2">
          <h3 className="text-stone-200 font-mono text-sm uppercase tracking-widest group-hover:text-amber-600 transition-colors flex items-center gap-2">
            {group.name}
            <ArrowUpRight
              size={12}
              className="opacity-0 group-hover:opacity-100 transition-all text-stone-600"
            />
          </h3>
          <p className="text-stone-600 font-mono text-[10px] line-clamp-2 leading-relaxed uppercase tracking-tighter">
            {group.description || "// NO_MANIFEST_DATA_AVAILABLE"}
          </p>
        </div>

        {/* Technical Stats */}
        <div className="grid grid-cols-2 gap-4 py-3 border-y border-stone-800/50">
          <div className="flex flex-col">
            <span className="text-[8px] font-mono text-stone-700 uppercase">
              Active_Members
            </span>
            <span className="text-stone-400 font-mono text-xs">
              {group.membersCount}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] font-mono text-stone-700 uppercase">
              Data_Entries
            </span>
            <span className="text-stone-400 font-mono text-xs">
              {group.postsCount}
            </span>
          </div>
        </div>
      </Link>

      {/* Action Area */}
      <div className="mt-5">
        {joined ? (
          <div className="w-full py-2 border border-emerald-900/30 bg-emerald-950/10 text-emerald-600 text-center font-mono text-[10px] uppercase tracking-widest">
            Protocol_Joined
          </div>
        ) : (
          <button
            onClick={handleJoin}
            disabled={isJoining}
            className="w-full group/btn relative overflow-hidden border border-stone-800 bg-stone-900/50 py-2.5 transition-all hover:border-amber-900/50"
          >
            <div className="absolute inset-0 bg-amber-600/5 translate-y-full group-hover/btn:translate-y-0 transition-transform" />
            <div className="relative flex items-center justify-center gap-2">
              {isJoining ? (
                <Loader2 size={14} className="animate-spin text-amber-700" />
              ) : (
                <Plus size={14} className="text-amber-700" />
              )}
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-400 group-hover/btn:text-stone-200">
                {isJoining ? "Connecting..." : "Init_Join_Sequence"}
              </span>
            </div>
          </button>
        )}
      </div>

      {/* Aesthetic terminal bit */}
      <div className="absolute bottom-1 right-2 opacity-10 pointer-events-none">
        <span className="font-mono text-[6px] text-stone-500 uppercase">
          v1.0.4_comm
        </span>
      </div>
    </div>
  );
};
