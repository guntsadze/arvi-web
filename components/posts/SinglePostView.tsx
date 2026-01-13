"use client";

import { useEffect, useState, useCallback } from "react";
import { postsService } from "@/services/posts/posts.service";
import { PostCard } from "./PostCard";
import { Loader2, AlertCircle } from "lucide-react";

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
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-4">
        <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
        <p className="text-stone-500 font-mono text-[10px] uppercase tracking-widest">
          Decrypting Signal...
        </p>
      </div>
    );
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
          Go Back to Feed
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
