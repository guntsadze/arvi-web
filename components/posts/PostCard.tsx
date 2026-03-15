"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { MediaSlider } from "../ui/MediaSlider";
import { PostHeader } from "./PostHeader";
import { PostContent } from "./PostContent";
import { PostActions } from "./PostActions";
import { postsService } from "@/services/posts/posts.service";
import { CommentForm } from "../comments/CommentForm";
import { CommentItem } from "../comments/CommentItem";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/store/slices/userSlice";
import { usePresence } from "@/context/PresenceContext";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

interface Comment {
  id: string;
  content: string;
  user: {
    firstName: string;
    lastName: string;
    username: string;
    avatar?: { url: string };
  };
  createdAt: string;
  replies?: Comment[];
}

interface PostCardProps {
  post: any;
}

export function PostCard({ post }: PostCardProps) {
  const currentUser = useAppSelector(selectCurrentUser);
  const { isUserOnline } = usePresence();
  const online = isUserOnline(post.user.id);

  const commentsRef = useRef(null);

  // ── Post UI state ──────────────────────────────────────────
  const [editingPost, setEditingPost] = useState(false);
  const [showComments, setShowComments] = useState(false);

  // ── Like / Save optimistic state ───────────────────────────
  const [isLiked, setIsLiked] = useState<boolean>(post.isLiked ?? false);
  const [likesCount, setLikesCount] = useState<number>(post.likesCount ?? 0);
  const [isSaved, setIsSaved] = useState<boolean>(post.isSaved ?? false);

  // ── Comment UI state ───────────────────────────────────────
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);

  const {
    data: comments,
    loading,
    hasMore,
    refresh,
  } = useInfiniteScroll<Comment>(
    (page) => postsService.getComments(post.id.toString(), { page, limit: 3 }),
    [],
    commentsRef,
  );

  const editCommentForm = useForm<{ content: string }>();

  const isOwner = currentUser?.id === post.user.id;

  // ── Handlers ───────────────────────────────────────────────

  const handleLike = async () => {
    setIsLiked((prev) => !prev);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
    try {
      await postsService.likePost(post.id);
    } catch (err) {
      setIsLiked((prev) => !prev);
      setLikesCount((prev) => (isLiked ? prev + 1 : prev - 1));
      console.error(err);
    }
  };

  const handleSave = async () => {
    setIsSaved((prev) => !prev);
    try {
      await postsService.savePost(post.id);
    } catch (err) {
      setIsSaved((prev) => !prev);
      console.error(err);
    }
  };

  const handleDeletePost = async () => {
    if (!confirm("Confirm Deletion?")) return;
    try {
      await postsService.deletePost(post.id);
      refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdatePost = async (data: { content: string; media: any[] }) => {
    try {
      setEditingPost(false);
      refresh();
    } catch (err) {
      alert("ვერ მოხერხდა პოსტის განახლება");
    }
  };

  const handleAddComment = async (
    data: { content: string },
    parentId?: string,
  ) => {
    if (!data.content.trim()) return;
    try {
      await postsService.addComment(post.id, data.content, parentId);
      refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditComment = async (
    commentId: string,
    data: { content: string },
  ) => {
    try {
      await postsService.updateComment(commentId, data.content);
      editCommentForm.reset();
      setEditingCommentId(null);
      refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Delete comment?")) return;
    try {
      await postsService.deleteComment(commentId);
      refresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative mb-8 group/card">
      <div className="bg-[#201d1b] border border-stone-800 hover:border-stone-600 transition-colors duration-300 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-600 to-transparent opacity-50" />
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-600 to-transparent opacity-50" />

        <PostHeader
          user={post.user}
          createdAt={post.createdAt}
          onEdit={() => setEditingPost(true)}
          onDelete={handleDeletePost}
          isOwner={isOwner}
          online={online}
        />

        <div className="p-4 bg-[#201d1b]">
          <PostContent
            post={post}
            isEditing={editingPost}
            onSave={handleUpdatePost}
            onCancel={() => setEditingPost(false)}
          />
        </div>

        {post.media && post.media.length > 0 && (
          <MediaSlider media={post.media} aspectRatio="aspect-[16/9]" />
        )}

        <PostActions
          likesCount={likesCount}
          isLiked={isLiked}
          commentsCount={post.commentsCount || 0}
          isSaved={isSaved}
          onLike={handleLike}
          onToggleComments={() => setShowComments((prev) => !prev)}
          onSave={handleSave}
        />

        {showComments && (
          <div className="bg-[#151413] border-t border-stone-800 p-6">
            <CommentForm
              onSubmit={(data) => handleAddComment(data)}
              placeholder="Append comment to log..."
              buttonText="Exec"
            />

            <div
              ref={commentsRef}
              className="space-y-8 mt-8 pl-2 overflow-y-auto max-h-[500px]"
            >
              {comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  replyTo={replyTo}
                  setReplyTo={setReplyTo}
                  editingId={editingCommentId}
                  setEditingId={setEditingCommentId}
                  onEdit={handleEditComment}
                  onDelete={handleDeleteComment}
                  editForm={editCommentForm}
                  onAddReply={handleAddComment}
                />
              ))}

              {loading && (
                <p className="text-stone-500 text-sm text-center py-2">
                  Loading...
                </p>
              )}
              {!hasMore && comments.length > 0 && (
                <p className="text-stone-600 text-xs text-center py-2">
                  — end of comments —
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
