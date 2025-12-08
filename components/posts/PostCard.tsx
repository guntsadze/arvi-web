"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ka } from "date-fns/locale";
import { postsApi } from "@/services/posts-service";

interface PostCardProps {
  post: any;
  onUpdate?: () => void;
}

export function PostCard({ post, onUpdate }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [isSaved, setIsSaved] = useState(post.isSaved || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [showComments, setShowComments] = useState(false);

  const handleLike = async () => {
    try {
      await postsApi.likePost(post.id);
      setIsLiked(!isLiked);
      setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleSave = async () => {
    try {
      await postsApi.savePost(post.id);
      setIsSaved(!isSaved);
    } catch (error) {
      console.error("Error saving post:", error);
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

      {/* Car info if linked */}
      {post.car && (
        <Link href={`/cars/${post.car.id}`} className="px-4 pb-2">
          <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1 text-sm">
            🚗 {post.car.make} {post.car.model} ({post.car.year})
          </div>
        </Link>
      )}

      {/* Content */}
      {post.content && (
        <div className="px-4 pb-3">
          <p className="whitespace-pre-wrap">{post.content}</p>
        </div>
      )}

      {/* Images */}
      {post.images?.length > 0 && (
        <div
          className={`grid gap-1 ${
            post.images.length === 1
              ? "grid-cols-1"
              : post.images.length === 2
              ? "grid-cols-2"
              : "grid-cols-2"
          }`}
        >
          {post.images.slice(0, 4).map((img: string, idx: number) => (
            <div key={idx} className="relative aspect-square">
              <Image src={img} alt="" fill className="object-cover" />
              {idx === 3 && post.images.length > 4 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    +{post.images.length - 4}
                  </span>
                </div>
              )}
            </div>
          ))}
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
          <div className="mt-4 border-t pt-4">
            {/* Comment form and list would go here */}
            <p className="text-gray-500 text-sm">კომენტარები...</p>
          </div>
        )}
      </div>
    </div>
  );
}
