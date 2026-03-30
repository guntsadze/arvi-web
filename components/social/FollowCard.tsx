"use client";

import { ActivityHeader } from "../shared/ActivityHeader";
import { ActivityMenu } from "../shared/ActivityMenu";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/store/slices/userSlice";
import { usePresence } from "@/context/PresenceContext";
import { UserPlus, Users } from "lucide-react";
import { UserAvatarItem } from "../ui/UserAvatarItem";

interface FollowCardProps {
  activity: any;
  refresh: () => void;
}

export function FollowCard({ activity, refresh }: FollowCardProps) {
  const currentUser = useAppSelector(selectCurrentUser);
  const { isUserOnline } = usePresence();
  const online = isUserOnline(activity.user.id);
  const isOwner = currentUser?.id === activity.user.id;

  const follower = activity.user;
  const following = activity.targetUser;

  const isFollowerOnline = isUserOnline(follower?.id);
  const isFollowingOnline = isUserOnline(following?.id);

  if (!follower || !following) return null;

  return (
    <div className="relative mb-8 group/card">
      <div className="bg-[#201d1b] border border-stone-800 hover:border-stone-600 transition-colors duration-300 overflow-hidden">
        {/* Top accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-600 to-transparent opacity-50 z-10" />
        {/* Bottom accent */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-600 to-transparent opacity-50 z-10" />

        {/* Header */}
        <ActivityHeader
          user={follower}
          createdAt={activity.createdAt}
          variant="follow"
          online={online}
          menu={<ActivityMenu isOwner={isOwner} onDelete={() => {}} />}
        />

        {/* Follow visual */}
        <div className="p-6 bg-[#1a1714] border-b border-stone-800">
          <div className="flex items-center justify-center gap-6">
            {/* Follower */}
            <UserAvatarItem user={follower} isOnline={isFollowerOnline} />

            {/* Arrow */}
            <div className="flex flex-col items-center gap-1">
              <UserPlus size={18} className="text-amber-600" />
              <div className="flex items-center gap-1">
                <div className="w-6 h-px bg-stone-700" />
                <div className="w-1.5 h-1.5 rotate-45 border-t border-r border-stone-600" />
              </div>
              <span className="text-[9px] font-mono text-stone-600 uppercase tracking-widest">
                follows
              </span>
            </div>

            {/* Following */}
            <UserAvatarItem user={following} isOnline={isFollowingOnline} />
          </div>
        </div>

        {/* Stats footer */}
        <div className="px-4 py-3 flex items-center justify-center gap-6">
          <div className="flex items-center gap-1.5 text-stone-500">
            <Users size={12} />
            <span className="text-[10px] font-mono">
              {following.followersCount ?? 0} followers
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
