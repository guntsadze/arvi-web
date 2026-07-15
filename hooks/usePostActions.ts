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

  const handleLikeComment = async (commentId: string) => {
    // 1. ვინახავთ ძველ State-ს, თუ API ჩავარდა რომ დავაბრუნოთ
    const previousComments = [...comments];

    // 2. მომენტალურად ვანახლებთ State-ს (Optimistic Update)
    const toggleLikeInState = (nodes: any[]): any[] => {
      return nodes.map((node) => {
        if (node.id === commentId) {
          const currentlyLiked = node.isLiked;
          return {
            ...node,
            isLiked: !currentlyLiked,
            likesCount: currentlyLiked
              ? node.likesCount - 1
              : node.likesCount + 1,
          };
        }
        if (node.replies?.length > 0) {
          return { ...node, replies: toggleLikeInState(node.replies) };
        }
        return node;
      });
    };

    setComments((prev) => toggleLikeInState(prev));

    try {
      // 3. ვაგზავნით რეალურ მოთხოვნას ბექენდზე
      await postsService.likeComment(commentId);
    } catch (err) {
      // 4. თუ მოთხოვნა ჩავარდა, ვაბრუნებთ ძველ მდგომარეობას
      setComments(previousComments);
      console.error("Like failed, rolling back:", err);
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

  // `data.mediaIds` already points at files uploaded via POST /media by the
  // CommentForm's own useMediaUpload — nothing left to upload here.
  const handleAddComment = async (
    data: { content: string; mediaIds: string[] },
    parentId?: string,
  ) => {
    try {
      await postsService.addComment(post.id, data, parentId);

      await fetchComments();
      setReplyTo(null);
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
      await postsService.updateComment(commentId, data.content);
      await fetchComments();
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
      await fetchComments();
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
    handleLikeComment,
  };
}
