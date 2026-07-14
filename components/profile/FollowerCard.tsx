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
      <div className="group  border border-border rounded-xl p-3 hover:border-accent/50 transition-all duration-200 cursor-pointer h-full flex flex-col">
        <UserAvatarItem user={follower} variant="card" />
        {/* Bio */}
        <div className="flex-1 mb-3">
          {follower.bio ? (
            <p className="text-xs text-text-secondary leading-relaxed line-clamp-2 pt-2">
              {follower.bio}
            </p>
          ) : (
            <p className="text-xs text-text-primary italic pt-2">
              მძღოლის ინფორმაცია არ არის
            </p>
          )}
        </div>

        {/* Followers count */}
        <p className="text-[10px] font-mono text-text-secondary mb-3">
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
