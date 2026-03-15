"use client";

import Link from "next/link";
import MessageButton from "@/app/(main)/profile/[username]/MessageButton";
import FollowButton from "./FollowButton";
import { UserAvatarItem } from "../ui/UserAvatarItem";

type Follower = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar: string;
  bio: string | null;
  isFollowing: boolean;
  followersCount: number;
};

type Props = {
  follower: Follower;
};

export default function FollowerCard({ follower }: Props) {
  return (
    <Link href={`/profile/${follower.username}`}>
      <div className="group bg-[#292524] border border-stone-700 rounded-xl p-4 hover:border-orange-500/50 transition-all duration-200 cursor-pointer h-full flex flex-col">
        {/* Avatar + Name */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-shrink-0">
            <UserAvatarItem user={follower} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-sm text-stone-100 truncate group-hover:text-orange-400 transition-colors">
              {follower.firstName} {follower.lastName}
            </h3>
            <p className="text-xs text-orange-500 font-mono truncate">
              @{follower.username}
            </p>
          </div>
        </div>

        {/* Bio */}
        <div className="flex-1 mb-3">
          {follower.bio ? (
            <p className="text-xs text-stone-400 leading-relaxed line-clamp-2">
              {follower.bio}
            </p>
          ) : (
            <p className="text-xs text-stone-600 italic">No bio yet.</p>
          )}
        </div>

        {/* Followers count */}
        <p className="text-[10px] font-mono text-stone-500 mb-3">
          {follower.followersCount.toLocaleString()}{" "}
          {follower.followersCount === 1 ? "follower" : "followers"}
        </p>

        {/* Buttons */}
        <div
          className="flex gap-2"
          onClick={(e) => e.preventDefault()} // Link-ის შიგნითაა, click არ გადავიდეს
        >
          <div className="flex-1">
            <FollowButton
              userId={follower.id}
              initialFollowing={follower.isFollowing ?? false}
              followersCount={follower.followersCount ?? 0}
            />
          </div>
          <MessageButton userId={follower.id} />
        </div>
      </div>
    </Link>
  );
}
