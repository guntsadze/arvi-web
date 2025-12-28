"use client";

import { useState, useEffect } from "react";
import { usersService } from "@/services/user/user.service";
import FollowerCard from "./FollowerCard";
import { Users, Loader2 } from "lucide-react";

type Follower = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar: { url: string } | null;
  bio: string | null;
  isFollowing: boolean;
  followersCount: number;
};

type Props = {
  userId: string;
};

const FOLLOWERS_PER_PAGE = 12;

export function UserFollowers({ userId }: Props) {
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    loadFollowers(1, true);
  }, [userId]);

  const loadFollowers = async (pageNum: number, isInitial = false) => {
    try {
      isInitial ? setLoading(true) : setLoadingMore(true);

      const response = await usersService.getFollowers(userId, {
        page: pageNum,
        limit: FOLLOWERS_PER_PAGE,
      });

      const followers = response?.data ?? [];

      if (isInitial) {
        setFollowers(followers);
      } else {
        setFollowers((prev) => [...prev, ...followers]);
      }

      setTotalCount(response?.totalCount ?? 0);
      setHasMore(followers.length === FOLLOWERS_PER_PAGE);
      setPage(pageNum);
    } catch (error) {
      console.error("Failed to load followers:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadFollowers(page + 1);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!followers || followers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-neutral-900 border-2 border-neutral-800 flex items-center justify-center mb-4">
          <Users className="w-10 h-10 text-neutral-600" />
        </div>
        <h3 className="text-xl font-bold text-neutral-400 mb-2">
          No Followers Yet
        </h3>
        <p className="text-sm text-neutral-600 max-w-md">
          This driver hasn't collected any fans on the track yet. Be the first
          to follow and show support!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-orange-500" />
          <h2 className="text-sm font-bold text-orange-500 uppercase tracking-[0.2em]">
            Pit Crew
          </h2>
        </div>
        <span className="text-xs font-mono text-neutral-500">
          {totalCount} {totalCount === 1 ? "Follower" : "Followers"}
        </span>
      </div>

      {/* Followers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {followers.map((follower) => (
          <FollowerCard key={follower.id} follower={follower} />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center pt-6">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="px-8 py-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-orange-500/50 rounded-lg text-sm font-mono uppercase tracking-wider text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loadingMore ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>Load More Fans</>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
