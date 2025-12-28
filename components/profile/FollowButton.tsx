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

  if (!currentUser || currentUser.id === userId) {
    return null;
  }

  const { toggleFollow, isLoading, isFollowing } = useToggleFollow(
    userId,
    initialFollowing
  );

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // მნიშვნელოვანია: ბარათში რომ არ გადავიდეს პროფილზე
    e.preventDefault();
    await toggleFollow();
    if (onFollowersChange) {
      onFollowersChange(isFollowing ? followersCount - 1 : followersCount + 1);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 md:py-3 text-xs md:text-sm font-black uppercase italic tracking-tighter transition-all skew-x-[-12deg] ${
        isFollowing
          ? "bg-orange-600 text-black shadow-[3px_3px_0px_0px_#000]"
          : "bg-neutral-800 text-white shadow-[3px_3px_0px_0px_#ea580c]"
      } hover:opacity-90 disabled:opacity-50 active:translate-y-[1px] active:shadow-none min-w-[120px]`}
    >
      <span className="flex items-center gap-2 skew-x-[12deg]">
        {isLoading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : isFollowing ? (
          <UserMinus size={18} />
        ) : (
          <UserPlus size={18} />
        )}
        <span className="whitespace-nowrap">
          {isFollowing ? "Unfollow" : "Follow"}
        </span>
      </span>
    </button>
  );
}
