"use client";

import Image from "next/image";
import Link from "next/link";
import MessageButton from "@/app/(main)/profile/[username]/MessageButton";
import FollowButton from "./FollowButton";

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
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5 hover:border-orange-500/50 transition-all group cursor-pointer">
        {/* Avatar & Info */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-neutral-800 group-hover:border-orange-500/30 transition-colors">
              <Image
                src={follower.avatar || "/default-avatar.png"}
                alt={follower.username}
                width={64}
                height={64}
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white truncate group-hover:text-orange-500 transition-colors">
              {follower.firstName} {follower.lastName}
            </h3>
            <p className="text-sm text-orange-500 font-mono truncate">
              @{follower.username}
            </p>
          </div>
        </div>

        {/* Bio */}
        {follower.bio && (
          <p className="text-sm text-neutral-400 leading-relaxed mb-4 line-clamp-2">
            {follower.bio}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <FollowButton
            userId={follower.id}
            initialFollowing={follower.isFollowing || false}
            followersCount={follower.followersCount || 0}
            // onFollowersChange={(newCount) => {
            //   // თუ გინდა რომ StatCard-ში followers რიცხვი მაშინვე განახლდეს (optimistic update)
            //   // შეგიძლია state გამოიყენო parent-ში, მაგრამ მარტივად რომ იყოს – უბრალოდ დატოვე
            // }}
          />

          <MessageButton userId={follower.id} />
        </div>
      </div>
    </Link>
  );
}
