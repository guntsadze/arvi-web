"use client";

import { useEffect, useState, useCallback } from "react";
import { postsService } from "@/services/posts/posts.service";
import { PostCard } from "./PostCard";
import { Loader2, AlertCircle, GlassWater } from "lucide-react";
import { GlobalLoader } from "../loaders/GlobalLoader";

interface SinglePostViewProps {
  postId: string;
}

export const SinglePostView = ({ postId }: SinglePostViewProps) => {
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("Fetching post with ID:", postId);

      const response = await postsService.getPost(postId);
      console.log("🚀 ~ SinglePostView ~ response:", response);

      const postData = response.data || response;
      setPost(postData);
    } catch (err) {
      console.error("Error fetching single post:", err);
      setError("პოსტი ვერ მოიძებნა ან წაშლილია");
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    if (postId) {
      fetchPost();
    }
  }, [postId, fetchPost]);

  if (isLoading) {
    return <GlobalLoader />;
  }

  if (error || !post) {
    return (
      <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed border-stone-800 bg-stone-900/50">
        <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
        <p className="text-stone-400 font-mono text-xs uppercase">{error}</p>
        <button
          onClick={() => window.history.back()}
          className="mt-4 text-[10px] text-amber-500 underline font-black uppercase"
        >
          Feed - ზე დაბრუნება
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6">
      <PostCard post={post} refresh={fetchPost} />
    </div>
  );
};
