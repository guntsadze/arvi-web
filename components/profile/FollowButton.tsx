"use client";

import { useToggleFollow } from "@/hooks/useToggleFollow";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/store/slices/userSlice";
import { UserPlus, UserMinus, Loader2 } from "lucide-react";

interface FollowButtonProps {
  userId: string;
  initialFollowing: boolean;
  followersCount: number;
  onFollowersChange?: (newCount: number) => void;
}

export default function FollowButton({
  userId,
  initialFollowing,
  followersCount,
  onFollowersChange,
}: FollowButtonProps) {
  const currentUser = useAppSelector(selectCurrentUser);
  const { toggleFollow, isLoading, isFollowing } = useToggleFollow(
    userId,
    initialFollowing,
  );

  if (!currentUser || currentUser?.id === userId) return null;

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    await toggleFollow();
    onFollowersChange?.(isFollowing ? followersCount - 1 : followersCount + 1);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`
        group flex-1 flex items-center justify-center gap-2
        px-4 py-2 rounded
        font-mono text-[11px] uppercase tracking-widest font-semibold
        border transition-all duration-150
        disabled:opacity-40 disabled:cursor-not-allowed
        ${
          isFollowing
            ? "bg-accent/15 border-accent/60 text-accent hover:bg-error/10 hover:border-error/60 hover:text-error"
            : "bg-transparent border-accent text-accent hover:bg-primary-hover/10"
        }
      `}
    >
      {isLoading ? (
        <Loader2 size={13} className="animate-spin" />
      ) : isFollowing ? (
        <UserMinus size={13} className="group-hover:hidden" />
      ) : (
        <UserPlus size={13} />
      )}

      {/* Following → hover-ზე "Unfollow" გამოჩნდეს */}
      <span>
        {isLoading ? (
          isFollowing ? (
            "გამოწერა..."
          ) : (
            "გამოწერა"
          )
        ) : isFollowing ? (
          <span>
            <span className="group-hover:hidden">გამოწერილი</span>
            <span className="hidden group-hover:inline">
              გამოწერის გაუქმება
            </span>
          </span>
        ) : (
          "გამოწერა"
        )}
      </span>
    </button>
  );
}
