"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { Loader2, Activity } from "lucide-react";
import { postsService } from "@/services/posts/posts.service";
import { UnifiedPostForm } from "@/components/shared/forms/UnifiedPostForm";
import { activityService } from "@/services/activity.service";
import { FeedItem } from "@/components/feed/FeedItem";
import { EmptyGarageCard } from "@/components/feed/EmptyGarageCard";
import { ProfileCompletenessWidget } from "@/components/profile/ProfileCompletenessWidget";

export default function FeedPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const {
    data: activities,
    loading,
    refresh,
  } = useInfiniteScroll(
    (page) => activityService.getFeed({ page, limit: 10 }),
    [],
  );

  useEffect(() => {
    if (searchParams.get("restored") === "true") {
      toast.success("კეთილი იყოს დაბრუნება! თქვენი ანგარიში აღდგენილია");
      router.replace(pathname);
    }
  }, [searchParams, router, pathname]);

  return (
    <div className="min-h-screen bg-background relative">
      {/* SCANLINE EFFECT */}
      <div className="fixed top-0 left-0 w-full h-1 bg-accent/20 shadow-[0_0_20px_rgba(245,158,11,0.3)] animate-scan opacity-20 pointer-events-none z-50" />

      <div className="relative z-10 max-w-3xl mx-auto py-10 px-4">
        {/* Header Decoration */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border" />
          <div className="flex flex-col items-center gap-1">
            <Activity className="text-accent" size={20} />
            <span className="text-[8px] font-mono text-text-primary uppercase tracking-[0.4em]">
              Live Feed
            </span>
          </div>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border" />
        </div>

        <ProfileCompletenessWidget />

        <EmptyGarageCard />

        <UnifiedPostForm
          storageFolder="posts"
          placeholder="გაგვიზიარე..."
          onSave={async (data) => {
            await postsService.createPost(data);
          }}
          onSuccess={() => refresh()}
        />

        <div className="mt-16 space-y-8">
          {activities.map((activity: any) => (
            <FeedItem key={activity.id} activity={activity} refresh={refresh} />
          ))}

          {loading && (
            <div className="flex flex-col items-center justify-center py-12 gap-4 border-t border-border border-dashed">
              <Loader2 className="animate-spin text-accent" size={32} />
            </div>
            // <GlobalLoader />
          )}

          {!loading && activities.length === 0 && (
            <div className="text-center py-24 border border-border bg-surface-1">
              <p className="text-text-secondary font-mono text-sm uppercase tracking-wider">
                // System Log Empty
              </p>
              <p className="text-text-secondary text-xs mt-2">
                No activity recorded in the sector.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
