"use client";

import { useState, useRef, useEffect } from "react";
import { Edit2, Trash2, MoreHorizontal, AlertCircle, Flag } from "lucide-react";

interface ActivityMenuProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onReport?: () => void;
  isOwner?: boolean;
  // მომავალში: share, pin, etc.
}

export function ActivityMenu({
  onEdit,
  onDelete,
  onReport,
  isOwner = false,
}: ActivityMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // არ არის owner — მარტო Report ჩანს
  // არც report — საერთოდ არ გამოჩნდეს
  const hasAnyAction = isOwner || onReport;
  if (!hasAnyAction) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 hover:bg-stone-800 rounded-sm transition-colors"
      >
        <MoreHorizontal
          size={20}
          className={
            isOpen ? "text-amber-500" : "text-[#EBE9E1] hover:text-amber-600"
          }
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[#1c1917] border border-stone-800 shadow-xl z-50 overflow-hidden">
          <div className="flex flex-col">
            {/* Owner-only actions */}
            {isOwner && onEdit && (
              <button
                onClick={() => {
                  onEdit();
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 text-[10px] font-mono uppercase text-stone-400 hover:bg-stone-800 hover:text-amber-500 transition-colors border-b border-stone-800/50"
              >
                <Edit2 size={14} />
                რედაქტირება
              </button>
            )}

            {isOwner && onDelete && (
              <button
                onClick={() => {
                  onDelete();
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 text-[10px] font-mono uppercase text-stone-300 hover:bg-red-950/30 hover:text-red-500 transition-colors border-b border-stone-800/50"
              >
                <Trash2 size={14} />
                წაშლა
              </button>
            )}

            {/* Everyone sees Report */}
            <button
              onClick={() => {
                onReport?.();
                setIsOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3 text-[10px] font-mono uppercase text-[#EBE9E1] hover:bg-stone-800 hover:text-orange-500 transition-colors"
            >
              <Flag size={14} />
              დარეპორტება
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
