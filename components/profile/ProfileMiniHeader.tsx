"use client";

import { useState } from "react";
import Image from "next/image";
import { ShieldCheck, Info } from "lucide-react";
import { UserAvatarItem } from "@/components/ui/UserAvatarItem";
import FollowButton from "@/components/profile/FollowButton";
import MessageButton from "@/app/(main)/profile/[username]/MessageButton";
import { ProfileDetailsDrawer } from "@/components/profile/ProfileDetailsDrawer";
import type { User } from "@/types/user";

interface ProfileMiniHeaderProps {
  user: User;
  isOwner: boolean;
  isOnline: boolean;
  /** Owner-only — preserves the old hero's click-to-manage-photo affordance. */
  onAvatarClick?: () => void;
  onCoverClick?: () => void;
}

/**
 * Thin, compact replacement for the old 350-450px cover-photo/avatar hero —
 * a short banner strip with an overlapping identity row underneath. Not
 * wired into ProfilePage.tsx yet; standalone/presentational only, sized to
 * accept the same `user` shape ProfilePage.tsx already has.
 */
export function ProfileMiniHeader({
  user,
  isOwner,
  isOnline,
  onAvatarClick,
  onCoverClick,
}: ProfileMiniHeaderProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);

  const fullName = `${user.firstName} ${user.lastName}`.trim();

  return (
    <div className="relative w-full select-none">
      {/* ── BANNER STRIP ── */}
      <div
        className={`relative h-20 md:h-28 w-full overflow-hidden ${isOwner && onCoverClick ? "cursor-pointer" : ""}`}
        onClick={isOwner ? onCoverClick : undefined}
      >
        {user.cover ? (
          <Image
            src={user.cover}
            alt="Cover"
            fill
            priority
            className="object-cover opacity-40"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-surface-2 to-background" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/10" />
      </div>

      {/* ── COMPACT IDENTITY ROW ── */}
      <div className="relative -mt-8 md:-mt-9 px-4 md:px-8">
        <div className="flex items-center gap-3 max-w-7xl mx-auto">
          <UserAvatarItem
            user={user}
            size="sm"
            showName={false}
            isOnline={isOnline}
            disableLink
            onClick={isOwner ? onAvatarClick : undefined}
          />

          <div className="min-w-0 flex-1 flex items-center gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm md:text-base font-black uppercase tracking-tight text-text-primary truncate">
                  {fullName}
                </h1>
                {user.isVerified && (
                  <ShieldCheck
                    className="text-info shrink-0"
                    size={14}
                    aria-label="ვერიფიცირებული"
                  />
                )}
              </div>
              <span className="text-accent font-mono text-[11px] font-bold truncate block">
                @{user.username ?? "user"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* FollowButton/MessageButton already return null for the
                owner's own profile — passing through unconditionally per
                the existing ProfilePage.tsx usage pattern. FollowButton's
                own class includes flex-1 (sized for the old full-width
                hero's action bar) — a plain, non-flex wrapper div keeps that
                class from stretching it inside this compact row, since
                flex-1 only takes effect when the button's direct parent is
                itself a flex container. */}
            <div>
              <FollowButton
                userId={user.id}
                initialFollowing={user.isFollowing ?? false}
                followersCount={user.followersCount}
              />
            </div>
            <MessageButton userId={user.id} />

            <button
              onClick={() => setDetailsOpen(true)}
              className="w-[34px] h-[34px] flex items-center justify-center flex-shrink-0 bg-transparent border border-border rounded text-text-secondary hover:border-accent/50 hover:text-accent transition-all duration-150"
              aria-label="პროფილის დეტალები"
            >
              <Info size={14} />
            </button>
          </div>
        </div>
      </div>

      <ProfileDetailsDrawer
        user={user}
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
      />
    </div>
  );
}
