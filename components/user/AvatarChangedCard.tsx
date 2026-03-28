"use client";

import { ActivityHeader } from "../shared/ActivityHeader";
import { ActivityMenu } from "../shared/ActivityMenu";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/store/slices/userSlice";
import { usePresence } from "@/context/PresenceContext";

interface AvatarChangedCardProps {
  activity: any;
  refresh: () => void;
}

export function AvatarChangedCard({
  activity,
  refresh,
}: AvatarChangedCardProps) {
  const currentUser = useAppSelector(selectCurrentUser);
  const { isUserOnline } = usePresence();
  const online = isUserOnline(activity.user.id);
  const isOwner = currentUser?.id === activity.user.id;

  const newAvatarUrl = activity.metadata?.newUrl ?? activity.user.avatar?.url;

  return (
    <div className="relative mb-8 group/card">
      <div className="bg-[#201d1b] border border-stone-800 hover:border-stone-600 transition-colors duration-300 overflow-hidden">
        {/* Top accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-600 to-transparent opacity-50 z-10" />
        {/* Bottom accent */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-600 to-transparent opacity-50 z-10" />

        {/* Header */}
        <ActivityHeader
          user={activity.user}
          createdAt={activity.createdAt}
          variant="avatar_changed"
          online={online}
          menu={
            <ActivityMenu
              isOwner={isOwner}
              onDelete={() => {
                // TODO: handleDelete
              }}
            />
          }
        />

        {/* Avatar preview */}
        <div className="flex items-center justify-center py-10 bg-[#1a1714] border-b border-stone-800">
          <div className="relative">
            {/* Glow */}
            <div className="absolute inset-0 rounded-full bg-amber-500/10 blur-xl scale-150" />

            <img
              src={newAvatarUrl}
              alt={activity.user.username}
              className="relative w-32 h-32 rounded-full object-cover border-2 border-amber-700/50"
            />

            {/* Corner decoration */}
            <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-amber-600/60" />
            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-amber-600/60" />
          </div>
        </div>

        {/* Info */}
        <div className="p-4 bg-[#201d1b]">
          <p className="text-stone-500 text-[10px] font-mono uppercase tracking-widest text-center">
            Profile photo updated
          </p>
        </div>
      </div>
    </div>
  );
}
