"use client";

import { PostCard } from "@/components/posts/PostCard";
import { PostForm } from "@/components/posts/PostForm";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { Loader2, Fuel } from "lucide-react";
import { postsService } from "@/services/posts/posts.service";

export default function FeedPage() {
  const {
    data: posts,
    loading,
    refresh,
  } = useInfiniteScroll((page) => postsService.getFeed(page), []);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 min-h-screen  bg-[#1c1917] bg-[radial-gradient(#766b69c2_1px,transparent_1px)] [background-size:20px_20px]">
      {/* Header Decoration */}
      <div className="flex items-center justify-center gap-4 mb-12 opacity-40">
        <div className="h-[2px] flex-1 bg-stone-800" />
        <Fuel className="text-stone-600" size={24} />
        <div className="h-[2px] flex-1 bg-stone-800" />
      </div>

      <PostForm refresh={refresh} />

      <div className="mt-12 space-y-12">
        {posts.map((post: any) => (
          <PostCard key={post.id} post={post} refresh={refresh} />
        ))}

        {loading && (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <Loader2 className="animate-spin text-amber-600" size={40} />
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-stone-600">
              Syncing with server...
            </span>
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div className="text-center py-24 border-4 border-dashed border-stone-800/30 rounded-3xl">
            <p className="text-stone-600 font-serif text-2xl italic">
              "The roads are empty today..."
            </p>
          </div>
        )}
      </div>

      {/* GLOBAL SVG FILTERS (Add this once in your layout or here) */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <filter id="rugged-tear">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04"
              numOctaves="4"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="4"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
