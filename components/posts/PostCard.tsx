"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ka } from "date-fns/locale";
import { postsService } from "@/services/posts/posts.service";

interface Comment {
  id: string;
  content: string;
  user: {
    firstName: string;
    lastName: string;
    username: string;
    avatar?: string;
  };
  createdAt: string;
  parentId?: string;
}

interface PostCardProps {
  post: any;
  onUpdate?: () => void;
}

export function PostCard({ post, onUpdate }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [isSaved, setIsSaved] = useState(post.isSaved || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments]);

  const fetchComments = async () => {
    try {
      const res = await postsService.getComments(post.id);
      setComments(res.data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleLike = async () => {
    try {
      await postsService.likePost(post.id);
      setIsLiked(!isLiked);
      setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleSave = async () => {
    try {
      await postsService.savePost(post.id);
      setIsSaved(!isSaved);
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      console.log(post.id);

      const res = await postsService.addComment(post.id, newComment);
      console.log(post.id, newComment, res);
      setComments([res.data, ...comments]); // პირდაპირ UI-ში ვამატებთ ახალ კომენტარს
      setNewComment("");
      post.commentsCount += 1; // კომენტარის count-საც განვაახლებთ
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow mb-4">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <Link
          href={`/profile/${post.user.username}`}
          className="flex items-center gap-3"
        >
          <Image
            src={post.user.avatar || "/default-avatar.png"}
            alt={post.user.firstName}
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <p className="font-semibold flex items-center gap-1">
              {post.user.firstName} {post.user.lastName}
              {post.user.isVerified && <span className="text-blue-500">✓</span>}
            </p>
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
                locale: ka,
              })}
            </p>
          </div>
        </Link>
      </div>

      {/* Content */}
      {post.content && (
        <div className="px-4 pb-3">
          <p className="whitespace-pre-wrap">{post.content}</p>
        </div>
      )}

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className="flex items-center gap-1 hover:text-red-500 transition"
            >
              <Heart
                className={isLiked ? "fill-red-500 text-red-500" : ""}
                size={24}
              />
              <span>{likesCount}</span>
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-1 hover:text-blue-500 transition"
            >
              <MessageCircle size={24} />
              <span>{post.commentsCount}</span>
            </button>

            <button className="hover:text-green-500 transition">
              <Share2 size={24} />
            </button>
          </div>

          <button
            onClick={handleSave}
            className="hover:text-yellow-500 transition"
          >
            <Bookmark
              className={isSaved ? "fill-yellow-500 text-yellow-500" : ""}
              size={24}
            />
          </button>
        </div>

        {/* Comments section */}
        {showComments && (
          <div className="mt-4 border-t pt-4 space-y-2">
            {/* Add comment */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="კომენტარის დამატება..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 border rounded px-2 py-1 text-sm"
              />
              <button
                onClick={handleAddComment}
                className="bg-blue-500 text-white px-3 rounded"
              >
                დამატება
              </button>
            </div>

            {/* Comments list */}
            {comments.map((c) => (
              <div key={c.id} className="flex items-start gap-2">
                <Image
                  src={c.user.avatar || "/default-avatar.png"}
                  alt={c.user.firstName}
                  width={30}
                  height={30}
                  className="rounded-full"
                />
                <div className="bg-gray-100 rounded px-2 py-1 text-sm">
                  <p className="font-semibold">
                    {c.user.firstName} {c.user.lastName}
                  </p>
                  <p>{c.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
