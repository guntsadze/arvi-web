"use client";

import { useState } from "react";
import { PostCard } from "@/components/posts/PostCard";
import { PostForm } from "@/components/posts/PostForm";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { Loader2 } from "lucide-react";
import { postsApi } from "@/services/posts-service";
import { api } from "@/lib/api";

export default function FeedPage() {
  const {
    data: posts,
    loading,
    refresh,
  } = useInfiniteScroll((page) => postsApi.getFeed(page), []);

  postsApi.getFeed();

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      {/* Create Post */}
      <PostForm onPostCreated={refresh} />

      {/* Feed */}
      <div className="mt-6 space-y-4">
        {posts.map((post: any) => (
          <PostCard key={post.id} post={post} onUpdate={refresh} />
        ))}

        {loading && (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin text-blue-500" size={32} />
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">პოსტები არ მოიძებნა</p>
            <p className="text-sm text-gray-400 mt-2">
              გამოიწერე მეგობრები პოსტების სანახავად
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
