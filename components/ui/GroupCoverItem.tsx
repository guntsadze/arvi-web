"use client";

import { Activity, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import ImageUploader from "./ImageUploader";

interface GroupCoverItemProps {
  group: {
    id: string;
    name: string;
    coverPhoto?: any;
  };
  isOwner?: boolean;
  className?: string;
}

export const GroupCoverItem = ({
  group,
  isOwner = false,
  className,
}: GroupCoverItemProps) => {
  const coverUrl =
    typeof group?.coverPhoto === "string"
      ? group.coverPhoto
      : group?.coverPhoto?.url;

  return (
    <div
      className={cn(
        "h-48 md:h-64 bg-stone-900 relative group/cover overflow-hidden border-b border-stone-800",
        className,
      )}
    >
      {/* 1. Background Image or Pattern */}
      {coverUrl ? (
        <img
          src={coverUrl}
          alt={`${group.name} cover`}
          className="w-full h-full object-cover opacity-50 group-hover/cover:opacity-40 transition-opacity duration-500"
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

      {/* 2. Industrial Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_4px,3px_100%]" />

      {/* 3. Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1c1917] via-transparent to-black/20" />

      {/* 4. Upload UI (Only for Owner on Hover) */}
      {isOwner && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-[2px] opacity-0 group-hover/cover:opacity-100 transition-all duration-300">
          <div className="flex flex-col items-center gap-3">
            <div className="transform scale-125">
              <ImageUploader id={group.id} type="cover" context="group" />
            </div>
            <span className="font-mono text-[10px] text-amber-500 uppercase tracking-[0.2em] bg-black/80 px-3 py-1.5 border border-amber-900/30 shadow-2xl">
              Update_Cover_Protocol
            </span>
          </div>
        </div>
      )}

      {/* 5. Decorative Industrial Corners */}
      <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-stone-700 opacity-50" />
      <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-stone-700 opacity-50" />
      <div className="absolute bottom-4 right-4 flex items-center gap-2 opacity-30">
        <span className="font-mono text-[8px] text-stone-500 uppercase">
          Sector_Background_Buffer
        </span>
        <Activity size={10} className="text-stone-500" />
      </div>
    </div>
  );
};
