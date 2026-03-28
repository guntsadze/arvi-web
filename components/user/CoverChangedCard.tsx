"use client";

import { ActivityHeader } from "../shared/ActivityHeader";
import { ActivityMenu } from "../shared/ActivityMenu";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/store/slices/userSlice";
import { usePresence } from "@/context/PresenceContext";

interface CoverChangedCardProps {
  activity: any;
  refresh: () => void;
}

export function CoverChangedCard({ activity, refresh }: CoverChangedCardProps) {
  const currentUser = useAppSelector(selectCurrentUser);
  const { isUserOnline } = usePresence();
  const online = isUserOnline(activity.user.id);
  const isOwner = currentUser?.id === activity.user.id;

  const newCoverUrl =
    activity.metadata?.newUrl ?? activity.user.coverPhoto?.url;

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
          variant="cover_changed"
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

        {/* Cover preview */}
        <div className="relative w-full aspect-[3/1] bg-[#1a1714] border-b border-stone-800 overflow-hidden">
          {newCoverUrl ? (
            <>
              <img
                src={newCoverUrl}
                alt="cover"
                className="w-full h-full object-cover"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#201d1b]/60 to-transparent" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-stone-700 text-[10px] font-mono uppercase tracking-widest">
                No cover image
              </span>
            </div>
          )}

          {/* Corner decorations */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-600/60" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-600/60" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-600/60" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-600/60" />
        </div>

        {/* Info */}
        <div className="p-4 bg-[#201d1b]">
          <p className="text-stone-500 text-[10px] font-mono uppercase tracking-widest text-center">
            Cover photo updated
          </p>
        </div>
      </div>
    </div>
  );
}
