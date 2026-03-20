import { useState } from "react";
import { useForm } from "react-hook-form";
import { postsService } from "@/services/posts/posts.service";
import { Comment, Post } from "@/types/post.types";

export function usePostActions(post: Post, refresh: () => void) {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isSaved, setIsSaved] = useState(post.isSaved);
  const [likesCount, setLikesCount] = useState(post.likesCount);

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);

  const commentForm = useForm<{ content: string }>();
  const editCommentForm = useForm<{ content: string }>();

  const fetchComments = async () => {
    try {
      const res = await postsService.getComments(post.id);
      setComments(Array.isArray(res) ? res : res.data || []);
    } catch (err) {
      console.error("Comments fetch error:", err);
    }
  };

  const toggleComments = () => {
    const next = !showComments;
    setShowComments(next);
    if (next) fetchComments();
  };

  const handleLike = async () => {
    try {
      const res = await postsService.likePost(post.id);
      setIsLiked(res.liked);
      setLikesCount(res.likesCount);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    try {
      const res = await postsService.savePost(post.id);
      setIsSaved(res.saved);
    } catch (err) {
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

  const handleAddComment = async (
    data: { content: string },
    parentId?: string,
  ) => {
    if (!data.content.trim()) return;
    try {
      const newComment = await postsService.addComment(
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
        setEditingCommentId(null);
      } else {
        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId ? { ...c, content: updated.content } : c,
          ),
        );
        setEditingCommentId(null);
      }
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
    // like/save
    isLiked,
    isSaved,
    likesCount,
    handleLike,
    handleSave,
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
