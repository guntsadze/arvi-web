import { PostCard } from "@/components/posts/PostCard";
import { CarAddedCard } from "../cars/CarAddedCard";
import { AvatarChangedCard } from "../user/AvatarChangedCard";
import { CoverChangedCard } from "../user/CoverChangedCard";
import { ListingCard } from "../marketplace/ListingCard";

export function FeedItem({
  activity,
  refresh,
}: {
  activity: any;
  refresh: () => void;
}) {
  console.log("🚀 ~ FeedItem ~ activity:", activity);
  switch (activity.type) {
    case "POST_CREATED":
      return <PostCard activity={activity} refresh={refresh} />;

    case "POST_UPDATED":
      return <PostCard activity={activity} refresh={refresh} />;

    case "CAR_ADDED":
      return <CarAddedCard activity={activity} refresh={refresh} />;

    case "CAR_UPDATED":
      return <CarAddedCard activity={activity} refresh={refresh} />;

    case "AVATAR_CHANGED":
      return <AvatarChangedCard activity={activity} refresh={refresh} />;

    case "COVER_CHANGED":
      return <CoverChangedCard activity={activity} refresh={refresh} />;

    case "LISTING_CREATED":
      return <ListingCard activity={activity} refresh={refresh} />;

    case "LISTING_UPDATED":
      return <ListingCard activity={activity} refresh={refresh} />;

    case "MODIFICATION_ADDED":
      return (
        <div className="border border-stone-800 bg-[#201d1b] p-5 rounded">
          <div className="flex items-center gap-3 mb-3">
            <img
              src={activity.user.avatar?.url}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-stone-300 text-sm font-mono">
              {activity.user.username}
            </span>
            <span className="text-stone-500 text-xs">added a modification</span>
          </div>
          <p className="text-amber-500 font-mono">
            🔧 {activity.modification.name}
          </p>
          {activity.modification.hpGain && (
            <p className="text-green-500 text-xs mt-1">
              +{activity.modification.hpGain} HP
            </p>
          )}
        </div>
      );

    case "FOLLOW":
      return (
        <div className="border border-stone-800 bg-[#201d1b] p-4 rounded flex items-center gap-3">
          <img
            src={activity.user.avatar?.url}
            className="w-8 h-8 rounded-full object-cover"
          />
          <p className="text-stone-400 text-sm font-mono">
            <span className="text-stone-200">{activity.user.username}</span>{" "}
            started following{" "}
            <span className="text-stone-200">
              {activity.targetUser.username}
            </span>
          </p>
        </div>
      );

    default:
      return null;
  }
}
