"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ImageSlider } from "../ui/ImageSlider";
import { PostHeader } from "./PostHeader";
import { PostContent } from "./PostContent";
import { PostActions } from "./PostActions";
import { postsService } from "@/services/posts/posts.service";
import { CommentForm } from "../comments/CommentForm";
import { CommentItem } from "../comments/CommentItem";

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
  refresh: () => void;
  currentUserId?: string;
}

export function PostCard({ post, refresh, currentUserId }: PostCardProps) {
  const [state, setState] = useState({
    isLiked: post.isLiked || false,
    isSaved: post.isSaved || false,
    likesCount: post.likesCount || 0,
    showComments: false,
    replyTo: null as string | null,
    comments: [] as Comment[],
    editingPost: false,
    editingCommentId: null as string | null,
  });

  const commentForm = useForm<{ content: string }>();
  const editPostForm = useForm<{ content: string }>({
    defaultValues: { content: post.content },
  });
  const editCommentForm = useForm<{ content: string }>();

  const setPartialState = (partial: Partial<typeof state>) =>
    setState((prev) => ({ ...prev, ...partial }));

  const isOwner = currentUserId === post.user.id; // ან post.userId

  useEffect(() => {
    if (state.showComments) fetchComments();
  }, [state.showComments]);

  const fetchComments = async () => {
    try {
      const res = await postsService.getComments(post.id.toString());
      const data = Array.isArray(res) ? res : res.data || [];
      setPartialState({ comments: data });
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleLike = async () => {
    try {
      const res = await postsService.likePost(post.id);
      setPartialState({
        isLiked: res.liked,
        likesCount: res.likesCount,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    try {
      const res = await postsService.savePost(post.id);
      setPartialState({ isSaved: res.saved });
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

  const handleUpdatePost = async (data: { content: string }) => {
    try {
      setPartialState({ editingPost: false });
      post.content = data.content;

      await postsService.updatePost(post.id, data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (
    data: { content: string },
    parentId?: string
  ) => {
    if (!data.content.trim()) return;
    try {
      const newComment = await postsService.addComment(
        post.id,
        data.content,
        parentId
      );
      if (parentId) {
        setPartialState({
          comments: state.comments.map((c) =>
            c.id === parentId
              ? { ...c, replies: [newComment, ...(c.replies || [])] }
              : c
          ),
          replyTo: null,
        });
      } else {
        setPartialState({
          comments: [newComment, ...state.comments],
        });
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
    parentId?: string
  ) => {
    try {
      const updatedComment = await postsService.updateComment(
        commentId,
        data.content
      );

      if (isReply && parentId) {
        setPartialState({
          comments: state.comments.map((c) =>
            c.id === parentId
              ? {
                  ...c,
                  replies: c.replies?.map((r) =>
                    r.id === commentId
                      ? { ...r, content: updatedComment.content }
                      : r
                  ),
                }
              : c
          ),
          editingReplyId: null,
        });
      } else {
        setPartialState({
          comments: state.comments.map((c) =>
            c.id === commentId ? { ...c, content: updatedComment.content } : c
          ),
          editingCommentId: null,
        });
      }
      editCommentForm.reset();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComment = async (
    commentId: string,
    isReply = false,
    parentId?: string
  ) => {
    if (!confirm("Delete comment?")) return;
    try {
      await postsService.deleteComment(commentId);

      if (isReply && parentId) {
        setPartialState({
          comments: state.comments.map((c) =>
            c.id === parentId
              ? { ...c, replies: c.replies?.filter((r) => r.id !== commentId) }
              : c
          ),
        });
      } else {
        setPartialState({
          comments: state.comments.filter((c) => c.id !== commentId),
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative mb-8 group/card">
      <div className="bg-[#201d1b] border border-stone-800 hover:border-stone-600 transition-colors duration-300 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-600 to-transparent opacity-50" />
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-600 to-transparent opacity-50" />

        <PostHeader user={post.user} createdAt={post.createdAt} />

        <div className="p-4 bg-[#201d1b]">
          <PostContent
            content={post.content}
            isEditing={state.editingPost}
            onSave={handleUpdatePost}
            onCancel={() => setPartialState({ editingPost: false })}
          />
        </div>

        {post.images && post.images.length > 0 && (
          <ImageSlider images={post.images} aspectRatio="aspect-[16/9]" />
        )}

        <PostActions
          likesCount={state.likesCount}
          isLiked={state.isLiked}
          commentsCount={post._count?.comments || 0}
          isSaved={state.isSaved}
          isOwner={isOwner}
          onLike={handleLike}
          onToggleComments={() =>
            setPartialState({ showComments: !state.showComments })
          }
          onSave={handleSave}
          onEdit={() => setPartialState({ editingPost: true })}
          onDelete={handleDeletePost}
        />

        {state.showComments && (
          <div className="bg-[#151413] border-t border-stone-800 p-6">
            <CommentForm
              onSubmit={(data) => handleAddComment(data)} // მთავარი კომენტარი
              placeholder="Append comment to log..."
              buttonText="Exec"
            />

            <div className="space-y-8 mt-8 pl-2">
              {state.comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  replyTo={state.replyTo}
                  setReplyTo={(id) => setPartialState({ replyTo: id })}
                  editingId={state.editingCommentId}
                  setEditingId={(id) =>
                    setPartialState({ editingCommentId: id })
                  }
                  onEdit={handleEditComment}
                  onDelete={handleDeleteComment}
                  editForm={editCommentForm}
                  onAddReply={handleAddComment} // ← აქ გადაეცემა parentId!
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
