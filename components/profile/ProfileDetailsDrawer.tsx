"use client";

import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Activity, Zap, Terminal, ShieldCheck } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import type { User } from "@/types/user";

interface ProfileDetailsDrawerProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Slide-over drawer (right edge on desktop, bottom-sheet on mobile) holding
 * the "პროფილის დეტალები" content that used to live in UserProfileContent.tsx's
 * left sidebar — bio, location, website, registry (verification + join date),
 * and the follower/following/posts counts. Copy/labels are reused verbatim
 * from that file rather than reinvented.
 *
 * Portal/overlay mechanics follow ImageLightbox.tsx's established pattern
 * (createPortal into document.body, AnimatePresence, Escape-to-close).
 */
export function ProfileDetailsDrawer({
  user,
  isOpen,
  onClose,
}: ProfileDetailsDrawerProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex font-mono">
          {/* ── BACKDROP ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/90 backdrop-blur-sm"
          />

          {/* ── PANEL ──
              Bottom sheet on mobile, right-edge drawer from sm breakpoint up. */}
          <motion.div
            initial={{ y: "100%", x: 0 }}
            animate={{ y: 0, x: 0 }}
            exit={{ y: "100%", x: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="sm:hidden absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto bg-surface-1 border-t border-border shadow-2xl"
          >
            <DrawerContent user={user} onClose={onClose} />
          </motion.div>

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="hidden sm:block absolute top-0 right-0 bottom-0 w-full max-w-sm overflow-y-auto bg-surface-1 border-l border-border shadow-2xl"
          >
            <DrawerContent user={user} onClose={onClose} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function DrawerContent({
  user,
  onClose,
}: {
  user: User;
  onClose: () => void;
}) {
  return (
    <div className="p-6 relative">
      <div className="absolute top-0 right-0 p-2 opacity-10 text-text-secondary pointer-events-none">
        <Terminal size={40} strokeWidth={1} />
      </div>

      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[10px] font-mono font-black text-accent uppercase tracking-[0.3em] flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-accent animate-pulse" />
          პროფილის დეტალები
        </h3>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-surface-1-hover text-text-muted transition-colors"
          aria-label="დახურვა"
        >
          <X size={16} />
        </button>
      </div>

      <div className="space-y-6 font-mono text-[11px]">
        {/* სექცია: ძირითადი მონაცემები */}
        <div className="space-y-3">
          <DataLine
            label="ფსევდონიმი"
            value={user.username}
            icon={<Users size={12} />}
          />
          <DataLine
            label="ლოკაცია"
            value={user.location}
            icon={<Activity size={12} />}
          />
          <DataLine
            label="ვებ-გვერდი"
            value={user.website}
            isLink
            icon={<Zap size={12} />}
          />
        </div>

        {/* სექცია: ქსელური სტატისტიკა */}
        <div className="space-y-3">
          <p className="text-[9px] text-text-secondary uppercase tracking-widest border-b border-border/50 pb-1">
            აქტივობა
          </p>
          <DataLine
            label="პოსტები"
            value={user.postsCount}
            color="text-accent"
          />
          <DataLine label="გამომწერები" value={user.followersCount} />
          <DataLine label="გამოწერილი" value={user.followingCount} />
        </div>

        {/* სექცია: სისტემური სტატუსი */}
        <div className="space-y-3">
          <p className="text-[9px] text-text-secondary uppercase tracking-widest border-b border-border/50 pb-1">
            რეესტრი
          </p>
          <div className="flex justify-between items-center py-1">
            <span className="text-text-secondary uppercase flex items-center gap-1.5">
              ავტორიზაცია
            </span>
            <span
              className={
                user.isVerified
                  ? "text-info flex items-center gap-1"
                  : "text-text-secondary"
              }
            >
              {user.isVerified && <ShieldCheck size={11} />}
              {user.isVerified ? "ვერიფიცირებული" : "სტანდარტული"}
            </span>
          </div>
        </div>

        {/* ბიოგრაფია */}
        <div className="pt-4 mt-2 border-t border-accent/10">
          <span className="text-accent/50 uppercase block mb-2 text-[9px] tracking-[0.2em]">
            ბიო:
          </span>
          <div className="bg-black/20 p-3 border-l-2 border-accent/30">
            <p className="text-text-secondary leading-relaxed italic text-xs">
              {user.bio ? `"${user.bio}"` : "// ინფორმაცია არ მოიძებნა"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DataLine({
  label,
  value,
  icon,
  isLink,
  color = "text-text-secondary",
}: {
  label: string;
  value: string | number | null | undefined;
  icon?: ReactNode;
  isLink?: boolean;
  color?: string;
}) {
  return (
    <div className="flex justify-between items-center py-0.5 group/line">
      <div className="flex items-center gap-2 text-text-secondary">
        {icon && <span className="opacity-50">{icon}</span>}
        <span className="uppercase">{label}</span>
      </div>
      <span
        className={`${color} font-bold ${isLink ? "hover:text-accent cursor-pointer underline decoration-accent/30 transition-colors" : ""}`}
      >
        {value || "// ცარიელი"}
      </span>
    </div>
  );
}
