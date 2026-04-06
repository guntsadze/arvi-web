"use client";

import { usersService } from "@/services/user/user.service";
import FollowerCard from "./FollowerCard";
import { Users, Loader2 } from "lucide-react";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

type Props = {
  userId: string;
};

const FOLLOWERS_PER_PAGE = 12;

export function UserFollowing({ userId }: Props) {
  const {
    data: following,
    loading,
    refresh,
  } = useInfiniteScroll(
    (page) =>
      usersService.getFollowing(userId, { page, limit: FOLLOWERS_PER_PAGE }),
    [userId],
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      {/* <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-orange-500" />
          <h2 className="text-sm font-bold text-orange-500 uppercase tracking-[0.2em]">
            Following
          </h2>
        </div>
        <span className="text-xs font-mono text-neutral-500">
          {following.followersCount}{" "}
          {following.followersCount === 1 ? "Following" : "Following"}
        </span>
      </div> */}

      {/* Following Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {following.map((user: any) => (
          <FollowerCard key={user.id} follower={user} />
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      )}

      {!loading && following.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-neutral-900 border-2 border-neutral-800 flex items-center justify-center mb-4">
            <Users className="w-10 h-10 text-neutral-600" />
          </div>
          <h3 className="text-xl font-bold text-neutral-400 mb-2">
            ინფორმაცია არ არის
          </h3>
          {/* <p className="text-sm text-neutral-600 max-w-md">
            This driver isn't following anyone on the track yet.
          </p> */}
        </div>
      )}
    </div>
  );
}
