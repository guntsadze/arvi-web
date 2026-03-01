import { useState, useCallback } from "react";
import { socialService } from "@/services/social/social.service";

interface UseToggleFollowResult {
  toggleFollow: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  isFollowing: boolean;
  followersCount: number;
  setFollowersCount: (count: number) => void;
  setIsFollowing: (value: boolean) => void;
}

export function useToggleFollow(
  userId: string,
  initialFollowing: boolean = false,
  initialFollowersCount: number = 0,
): UseToggleFollowResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [followersCount, setFollowersCount] = useState(initialFollowersCount);

  const toggleFollow = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    // Save previous state in case of error
    const previousFollowing = isFollowing;
    const previousCount = followersCount;

    // Optimistic update
    const newIsFollowing = !isFollowing;
    const newFollowersCount = newIsFollowing
      ? followersCount + 1
      : followersCount - 1;

    setIsFollowing(newIsFollowing);
    setFollowersCount(newFollowersCount);

    try {
      await socialService.toggleFollow(userId);
      // Success — UI already updated
    } catch (err: any) {
      // Revert on error
      setIsFollowing(previousFollowing);
      setFollowersCount(previousCount);

      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "ვერ მოხერხდა follow-ის შეცვლა";
      setError(errorMessage);
      console.error("Toggle follow error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [userId, isFollowing, followersCount]);

  return {
    toggleFollow,
    isLoading,
    error,
    isFollowing,
    followersCount,
    setFollowersCount,
    setIsFollowing,
  };
}
