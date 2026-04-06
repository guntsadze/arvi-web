"use client";

import React, { use, useEffect } from "react";
import { groupsService } from "@/services/groups.service";
import { GroupHeader } from "@/components/groups/GroupHeader";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { Loader2, Terminal } from "lucide-react";
import { UnifiedPostForm } from "@/components/shared/forms/UnifiedPostForm";
import { GroupPostCard } from "@/components/groups/GroupPostCard";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/store/slices/userSlice";

export default function GroupPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const currentUser = useAppSelector(selectCurrentUser);

  const [group, setGroup] = React.useState<any>(null);

  useEffect(() => {
    groupsService.getGroupBySlug(slug).then((res) => setGroup(res.data || res));
  }, [slug]);

  const {
    data: posts,
    loading,
    refresh,
  } = useInfiniteScroll(
    (page) => groupsService.getGroupPosts([group?.id], { page, limit: 10 }),
    [group?.id],
  );

  if (!group)
    return (
      <div className="min-h-screen bg-[#1c1917] flex items-center justify-center">
        <Loader2 className="animate-spin text-amber-700" size={40} />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#1c1917] relative">
      {/* BACKGROUND DECORATIONS */}
      <div
        className="fixed inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #44403c 1px, transparent 1px), linear-gradient(to bottom, #44403c 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
      <div className="fixed top-0 left-0 w-full h-1 bg-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.3)] animate-scan opacity-20 pointer-events-none z-50" />

      <GroupHeader group={group} isOwner={currentUser?.id === group.ownerId} />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* <div className="grid gap-12">
          {/* <div className="lg:col-span-2 space-y-10"> */}
        <div className="flex justify-center">
          <div className="w-full lg:w-[60%] space-y-10">
            <UnifiedPostForm
              storageFolder="group-posts"
              placeholder="გაგვიზიარე..."
              onSave={async (data) => {
                await groupsService.createGroupPost(group.id, data);
              }}
              onSuccess={() => refresh()}
            />

            {/* POSTS LIST */}
            <div className="space-y-8">
              {[...posts]
                .sort((a, b) => Number(b.isPinned) - Number(a.isPinned))
                .map((post: any) => (
                  <GroupPostCard
                    key={post.id}
                    post={post}
                    refresh={refresh}
                    myRole={group.myRole}
                  />
                ))}

              {loading && (
                <div className="flex flex-col items-center py-10 gap-3">
                  <Loader2 className="animate-spin text-amber-800" size={30} />
                  <span className="font-mono text-[10px] text-stone-300 uppercase tracking-widest">
                    Syncing_Node_Data...
                  </span>
                </div>
              )}

              {!loading && posts.length === 0 && (
                <div className="border border-stone-800 bg-[#201d1b] p-20 text-center">
                  <Terminal className="mx-auto mb-4 text-stone-800" size={30} />
                  <p className="font-mono text-stone-600 text-sm uppercase tracking-widest">
                    // Sector_Manifest_Empty
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
