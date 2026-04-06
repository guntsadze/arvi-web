"use client";

import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { activityService } from "@/services/activity.service";
import { FeedItem } from "../feed/FeedItem";
import { Loader2 } from "lucide-react";

type Props = {
  userId: string;
};

export function UserPosts({ userId }: Props) {
  const {
    data: activities,
    loading,
    refresh,
  } = useInfiniteScroll(
    (page) => activityService.getByUserId(userId, { page, limit: 10 }),
    [userId],
  );

  return (
    <div className="space-y-6">
      {activities.map((activity: any) => (
        <FeedItem key={activity.id} activity={activity} refresh={refresh} />
      ))}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12 gap-4 border-t border-stone-800 border-dashed">
          <Loader2 className="animate-spin text-amber-600" size={32} />
        </div>
      )}
    </div>
  );
}
