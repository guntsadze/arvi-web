"use client";

import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { activityService } from "@/services/activity.service";
import { FeedItem } from "../feed/FeedItem";
import { GlobalLoader } from "../ui/GlobalLoader";

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
      {loading && <GlobalLoader />}
    </div>
  );
}
