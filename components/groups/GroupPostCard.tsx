"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MediaSlider } from "../ui/MediaSlider";
import { PostHeader } from "../posts/PostHeader";
import { PostContent } from "../posts/PostContent";
import { PostActions } from "../posts/PostActions";
import { postsService } from "@/services/posts/posts.service";
import { groupsService } from "@/services/groups.service";
import { CommentForm } from "../comments/CommentForm";
import { CommentItem } from "../comments/CommentItem";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/store/slices/userSlice";
import { Pin } from "lucide-react";
import { usePresence } from "@/context/PresenceContext";

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

interface GroupPostCardProps {
  post: any;
  refresh: () => void;
  myRole?: string; // ჯგუფში მომხმარებლის როლი (OWNER, ADMIN, MODERATOR, MEMBER)
}

export function GroupPostCard({ post, refresh, myRole }: GroupPostCardProps) {
  const currentUser = useAppSelector(selectCurrentUser);
  const { isUserOnline } = usePresence();
  const online = isUserOnline(post.user.id);

  const [state, setState] = useState({
    isLiked: post.isLiked || false,
    isSaved: post.isSaved || false,
    likesCount: post.likesCount || 0,
    showComments: false,
    replyTo: null as string | null,
    comments: [] as Comment[],
    editingPost: false,
    editingCommentId: null as string | null,
    isPinned: post.isPinned || false,
  });

  useEffect(() => {
    if (state.showComments) fetchComments();
  }, [state.showComments]);

  const fetchComments = async () => {
    try {
      const res = await postsService.getGroupComments(post.id.toString());
      const data = Array.isArray(res) ? res : res.data || [];
      setPartialState({ comments: data });
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const setPartialState = (partial: Partial<typeof state>) =>
    setState((prev) => ({ ...prev, ...partial }));

  const editCommentForm = useForm<{ content: string }>();

  // პერმისიების ლოგიკა
  const isPostAuthor = currentUser?.id === post?.userId;
  const canManagePost =
    isPostAuthor || ["OWNER", "ADMIN", "MODERATOR"].includes(myRole || "");

  const handleLike = async () => {
    try {
      const res = await postsService.likeGroupPost(post.id);
      setPartialState({ isLiked: res.liked, likesCount: res.likesCount });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePost = async () => {
    if (!confirm("TERMINATE_POST_DATA?")) return;
    try {
      // ვიყენებთ ჯგუფის სერვისს წასაშლელად
      await groupsService.deleteGroupPost(post.groupId, post.id);
      refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePinPost = async () => {
    try {
      await groupsService.pinGroupPost(post.groupId, post.id);
      setPartialState({ isPinned: !state.isPinned });
      refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdatePost = async (data: {
    content: string;
    media: string[];
  }) => {
    try {
      setPartialState({ editingPost: false });

      const payload = {
        content: data.content,
        media: data.media,
      };

      await postsService.updateGroupPost(post.id, payload);

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
      const newComment = await postsService.addGroupComment(
        post.id,
        data.content,
        parentId,
      );
      if (parentId) {
        setPartialState({
          comments: state.comments.map((c) =>
            c.id === parentId
              ? { ...c, replies: [newComment, ...(c.replies || [])] }
              : c,
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

  const handleDeleteComment = async (
    commentId: string,
    isReply = false,
    parentId?: string,
  ) => {
    if (!confirm("Delete comment?")) return;
    try {
      await postsService.deleteComment(commentId);

      if (isReply && parentId) {
        setPartialState({
          comments: state.comments.map((c) =>
            c.id === parentId
              ? { ...c, replies: c.replies?.filter((r) => r.id !== commentId) }
              : c,
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

  const handleEditComment = async (
    commentId: string,
    data: { content: string },
    isReply = false,
    parentId?: string,
  ) => {
    try {
      const updatedComment = await postsService.updateComment(
        commentId,
        data.content,
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
                      : r,
                  ),
                }
              : c,
          ),
          editingReplyId: null,
        });
      } else {
        setPartialState({
          comments: state.comments.map((c) =>
            c.id === commentId ? { ...c, content: updatedComment.content } : c,
          ),
          editingCommentId: null,
        });
      }
      editCommentForm.reset();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className={`relative mb-8 group/card transition-all ${state.isPinned ? "ring-1 ring-amber-900/50" : ""}`}
    >
      {/* Pinned Indicator */}
      {state.isPinned && (
        <div className="absolute -top-3 left-4 z-20 bg-amber-700 px-2 py-0.5 flex items-center gap-1">
          <Pin size={10} className="text-stone-950 fill-stone-950" />
          <span className="font-mono text-[8px] text-stone-950 font-bold uppercase tracking-widest">
            Pinned_Entry
          </span>
        </div>
      )}

      <div className="bg-[#201d1b] border border-stone-800 hover:border-stone-700 transition-colors duration-300 relative overflow-hidden">
        {/* Visual Decoration */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-stone-700 to-transparent opacity-50" />

        <PostHeader
          user={post.user}
          createdAt={post.createdAt}
          onEdit={() => setPartialState({ editingPost: true })}
          onDelete={handleDeletePost}
          isOwner={isPostAuthor}
          online={online}
        />

        {/* Pin Button for Admins */}
        <button
          onClick={handlePinPost}
          className={`absolute top-4 right-12 p-1 transition-colors ${state.isPinned ? "text-amber-500" : "text-stone-700 hover:text-stone-400"}`}
        >
          <Pin size={14} />
        </button>

        <div className="p-4 bg-[#201d1b]">
          <PostContent
            post={post}
            isEditing={state.editingPost}
            onSave={handleUpdatePost}
            onCancel={() => setPartialState({ editingPost: false })}
          />
        </div>

        {post.media && post.media.length > 0 && (
          <div className="border-y border-stone-800/50">
            <MediaSlider media={post.media} aspectRatio="aspect-[16/9]" />
          </div>
        )}

        <PostActions
          likesCount={state.likesCount}
          isLiked={state.isLiked}
          commentsCount={post._count?.comments || 0}
          isSaved={state.isSaved}
          onLike={handleLike}
          onToggleComments={() =>
            setPartialState({ showComments: !state.showComments })
          }
          onSave={() => {}}
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
