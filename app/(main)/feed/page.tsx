"use client";

import { PostCard } from "@/components/posts/PostCard";
import { PostForm } from "@/components/posts/PostForm";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { Loader2, Activity } from "lucide-react";
import { postsService } from "@/services/posts/posts.service";

export default function FeedPage() {
  const {
    data: posts,
    loading,
    refresh,
  } = useInfiniteScroll((page) => postsService.getFeed(page), []);

  return (
    <div className="min-h-screen bg-[#1c1917] relative">
      {/* GLOBAL BACKGROUND GRID */}
      <div
        className="fixed inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #44403c 1px, transparent 1px),
            linear-gradient(to bottom, #44403c 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* SCANLINE EFFECT */}
      <div className="fixed top-0 left-0 w-full h-1 bg-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.3)] animate-scan opacity-20 pointer-events-none z-50" />

      <div className="relative z-10 max-w-3xl mx-auto py-10 px-4">
        {/* Header Decoration */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-stone-700" />
          <div className="flex flex-col items-center gap-1">
            <Activity className="text-amber-700" size={20} />
            <span className="text-[8px] font-mono text-stone-600 uppercase tracking-[0.4em]">
              Live Feed
            </span>
          </div>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-stone-700" />
        </div>

        <PostForm refresh={refresh} />

        <div className="mt-16 space-y-8">
          {posts.map((post: any, index: number) => (
            <PostCard key={post.id} post={post} refresh={refresh} />
          ))}

          {loading && (
            <div className="flex flex-col items-center justify-center py-12 gap-4 border-t border-stone-800 border-dashed">
              <Loader2 className="animate-spin text-amber-600" size={32} />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-500 animate-pulse">
                Synchronizing Data...
              </span>
            </div>
          )}

          {!loading && posts.length === 0 && (
            <div className="text-center py-24 border border-stone-800 bg-[#201d1b]">
              <p className="text-stone-600 font-mono text-sm uppercase tracking-wider">
                // System Log Empty
              </p>
              <p className="text-stone-700 text-xs mt-2">
                No activity recorded in the sector.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
