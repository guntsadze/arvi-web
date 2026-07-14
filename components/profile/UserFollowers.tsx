"use client";

import { usersService } from "@/services/user/user.service";
import FollowerCard from "./FollowerCard";
import { Users, Loader2 } from "lucide-react";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
type Props = {
  userId: string;
};

const FOLLOWERS_PER_PAGE = 12;

export function UserFollowers({ userId }: Props) {
  const {
    data: followers,
    loading,
    refresh,
  } = useInfiniteScroll(
    (page) =>
      usersService.getFollowers(userId, { page, limit: FOLLOWERS_PER_PAGE }),
    [userId],
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      {/* <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-accent" />
          <h2 className="text-sm font-bold text-accent uppercase tracking-[0.2em]">
            Pit Crew
          </h2>
        </div>
        <span className="text-xs font-mono text-text-muted">
          {followers.followersCount}{" "}
          {followers.followersCount === 1 ? "Follower" : "Followers"}
        </span>
      </div> */}

      {/* Followers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {followers.map((follower: any) => (
          <FollowerCard key={follower.id} follower={follower} />
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      )}

      {!loading && followers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-surface-1 border-2 border-border flex items-center justify-center mb-4">
            <Users className="w-10 h-10 text-text-muted" />
          </div>
          <h3 className="text-xl font-bold text-text-secondary mb-2">
            გამომწერები არ არის ჯერ
          </h3>
          <p className="text-sm text-text-muted max-w-md">
            ავტომოყვარულს ჯერ არ ყავს ტრასაზე არცერთი გულშემატკივარი. იყავით
            პირველი, ვინც გამოიწერს და მხარდაჭერას გამოხატავს!
          </p>
        </div>
      )}
    </div>
  );
}
