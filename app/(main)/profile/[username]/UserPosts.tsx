"use client";

import { PostCard } from "@/components/posts/PostCard";
import { postsService } from "@/services/posts/posts.service";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

type Props = {
  userId: string;
};

export function UserPosts({ userId }: Props) {
  const {
    data: posts,
    loading,
    refresh,
  } = useInfiniteScroll(
    (page) => postsService.getByUserId(userId, page, 10),
    [userId]
  );

  return (
    <div className="space-y-6">
      {posts.map((post: any) => (
        <PostCard key={post.id} post={post} refresh={refresh} />
      ))}
      {loading && <p>Loading...</p>}
    </div>
  );
}
