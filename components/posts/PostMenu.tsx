"use client";

import { useState, useRef, useEffect } from "react";
import { Edit2, Trash2, MoreHorizontal, AlertCircle } from "lucide-react";

interface PostMenuProps {
  onEdit: () => void;
  onDelete: () => void;
  isOwner: boolean;
}

export function PostMenu({ onEdit, onDelete, isOwner }: PostMenuProps) {
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

  if (!isOwner) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 hover:bg-surface-1-hover rounded-sm transition-colors"
      >
        <MoreHorizontal
          className={`${
            isOpen ? "text-accent" : "text-text-primary"
          } hover:text-accent`}
          size={20}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-surface-1 border border-border shadow-xl z-50 overflow-hidden">
          <div className="flex flex-col">
            <button
              onClick={() => {
                onEdit();
                setIsOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3 text-[10px] font-mono uppercase text-text-secondary hover:bg-surface-1-hover hover:text-accent transition-colors border-b border-border/50"
            >
              <Edit2 size={14} />
              Edit Records
            </button>

            <button
              onClick={() => {
                onDelete();
                setIsOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3 text-[10px] font-mono uppercase text-text-secondary hover:bg-error/10/30 hover:text-error transition-colors"
            >
              <Trash2 size={14} />
              Delete Entry
            </button>

            {/* აქ შეგიძლიათ მომავალში დაამატოთ სხვა ღილაკებიც */}
            <button className="flex items-center gap-3 px-4 py-3 text-[10px] font-mono uppercase text-text-primary hover:bg-surface-1-hover transition-colors">
              <AlertCircle size={14} />
              Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
