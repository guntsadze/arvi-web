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
            ? "bg-orange-500/15 border-orange-500/60 text-orange-300 hover:bg-red-500/10 hover:border-red-500/60 hover:text-red-300"
            : "bg-transparent border-orange-500 text-orange-500 hover:bg-orange-500/10"
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
            "Following"
          ) : (
            "Follow"
          )
        ) : isFollowing ? (
          <span>
            <span className="group-hover:hidden">Following</span>
            <span className="hidden group-hover:inline">Unfollow</span>
          </span>
        ) : (
          "Follow"
        )}
      </span>
    </button>
  );
}
