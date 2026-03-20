"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { postsService } from "@/services/posts/posts.service";
import { groupsService } from "@/services/groups.service";
import { Comment } from "@/types/post.types";

export function useGroupPostActions(post: any, refresh: () => void) {
  // ─── Like ──────────────────────────────────────────
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);

  const handleLike = async () => {
    try {
      const res = await postsService.likeGroupPost(post.id);
      setIsLiked(res.liked);
      setLikesCount(res.likesCount);
    } catch (err) {
      console.error(err);
    }
  };

  // ─── Pin (group-სპეციფიკური) ───────────────────────
  const [isPinned, setIsPinned] = useState(post.isPinned || false);

  const handlePin = async () => {
    try {
      await groupsService.pinGroupPost(post.groupId, post.id);
      setIsPinned((prev: boolean) => !prev);
      refresh();
    } catch (err) {
      console.error(err);
    }
  };

  // ─── Delete ────────────────────────────────────────
  const handleDeletePost = async () => {
    if (!confirm("TERMINATE_POST_DATA?")) return;
    try {
      await groupsService.deleteGroupPost(post.groupId, post.id);
      refresh();
    } catch (err) {
      console.error(err);
    }
  };

  // ─── Comments ──────────────────────────────────────
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);

  const commentForm = useForm<{ content: string }>();
  const editCommentForm = useForm<{ content: string }>();

  const toggleComments = async () => {
    const next = !showComments;
    setShowComments(next);
    if (next) {
      try {
        const res = await postsService.getGroupComments(post.id.toString());
        setComments(Array.isArray(res) ? res : res.data || []);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleAddComment = async (
    data: { content: string },
    parentId?: string,
  ) => {
    if (!data.content.trim()) return;
    try {
      const newComment = await postsService.addGroupComment(
        post.id,
        data.content,
        parentId,
      );
      if (parentId) {
        setComments((prev) =>
          prev.map((c) =>
            c.id === parentId
              ? { ...c, replies: [newComment, ...(c.replies || [])] }
              : c,
          ),
        );
        setReplyTo(null);
      } else {
        setComments((prev) => [newComment, ...prev]);
      }
      commentForm.reset();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditComment = async (
    commentId: string,
    data: { content: string },
    isReply = false,
    parentId?: string,
  ) => {
    try {
      const updated = await postsService.updateComment(commentId, data.content);
      if (isReply && parentId) {
        setComments((prev) =>
          prev.map((c) =>
            c.id === parentId
              ? {
                  ...c,
                  replies: c.replies?.map((r) =>
                    r.id === commentId ? { ...r, content: updated.content } : r,
                  ),
                }
              : c,
          ),
        );
      } else {
        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId ? { ...c, content: updated.content } : c,
          ),
        );
      }
      setEditingCommentId(null);
      editCommentForm.reset();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComment = async (
    commentId: string,
    isReply = false,
    parentId?: string,
  ) => {
    if (!confirm("Delete comment?")) return;
    try {
      await postsService.deleteComment(commentId);
      if (isReply && parentId) {
        setComments((prev) =>
          prev.map((c) =>
            c.id === parentId
              ? { ...c, replies: c.replies?.filter((r) => r.id !== commentId) }
              : c,
          ),
        );
      } else {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return {
    // like
    isLiked,
    likesCount,
    handleLike,
    // pin — group-სპეციფიკური
    isPinned,
    handlePin,
    // post
    handleDeletePost,
    // comments
    showComments,
    toggleComments,
    comments,
    replyTo,
    setReplyTo,
    editingCommentId,
    setEditingCommentId,
    commentForm,
    editCommentForm,
    handleAddComment,
    handleEditComment,
    handleDeleteComment,
  };
}
