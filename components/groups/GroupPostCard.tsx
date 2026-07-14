"use client";

import { MediaSlider } from "../ui/MediaSlider";
import { PostHeader } from "../posts/PostHeader";
import { PostContent } from "../posts/PostContent";
import { PostActions } from "../posts/PostActions";
import { CommentForm } from "../comments/CommentForm";
import { CommentItem } from "../comments/CommentItem";
import { EditPostModal } from "../posts/EditPostModal";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/store/slices/userSlice";
import { usePresence } from "@/context/PresenceContext";
import { useGroupPostActions } from "@/hooks/useGroupPostActions";
import { usePostEdit } from "@/hooks/usePostEdit";
import { Pin } from "lucide-react";
import { Card } from "../ui/Card";

interface GroupPostCardProps {
  post: any;
  refresh: () => void;
  myRole?: string;
}

export function GroupPostCard({ post, refresh, myRole }: GroupPostCardProps) {
  const currentUser = useAppSelector(selectCurrentUser);
  const { isUserOnline } = usePresence();

  const isPostAuthor = currentUser?.id === post?.userId;
  const canManagePost =
    isPostAuthor || ["OWNER", "ADMIN", "MODERATOR"].includes(myRole || "");

  const actions = useGroupPostActions(post, refresh);

  const edit = usePostEdit(post.id, refresh, "group");

  return (
    <>
      <EditPostModal
        post={edit.postData}
        isOpen={edit.isOpen}
        isLoading={edit.isLoading}
        onClose={edit.closeModal}
        onSave={edit.handleSave}
      />

      <div
        className={`relative mb-8 group/card transition-all ${actions.isPinned ? "ring-1 ring-accent/50" : ""}`}
      >
        {actions.isPinned && (
          <div className="absolute -top-3 left-4 z-20 bg-accent px-2 py-0.5 flex items-center gap-1">
            <Pin size={10} className="text-background fill-background" />
            <span className="font-mono text-[8px] text-background font-bold uppercase tracking-widest">
              Pinned_Entry
            </span>
          </div>
        )}

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />

          <PostHeader
            user={post.user}
            createdAt={post.createdAt}
            onEdit={edit.openModal}
            onDelete={actions.handleDeletePost}
            isOwner={canManagePost}
            online={isUserOnline(post.user.id)}
          />

          {["OWNER", "ADMIN", "MODERATOR"].includes(myRole || "") && (
            <button
              onClick={actions.handlePin}
              className={`absolute top-4 right-12 p-1 transition-colors ${
                actions.isPinned
                  ? "text-accent"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              <Pin size={14} />
            </button>
          )}

          <div className="p-4">
            <PostContent post={post} />
          </div>

          {post.media?.length > 0 && (
            <div className="border-y border-border/50">
              <MediaSlider media={post.media} aspectRatio="aspect-[16/9]" />
            </div>
          )}

          <PostActions
            likesCount={actions.likesCount}
            isLiked={actions.isLiked}
            commentsCount={post._count?.comments || 0}
            isSaved={false}
            onLike={actions.handleLike}
            onToggleComments={actions.toggleComments}
            onSave={() => {}}
          />

          {actions.showComments && (
            <div className="bg-surface-2 border-t border-border p-6">
              <CommentForm
                onSubmit={(data) => actions.handleAddComment(data)}
                placeholder="..."
                buttonText="დამატება"
              />
              <div className="space-y-8 mt-8 pl-2">
                {actions.comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    replyTo={actions.replyTo}
                    setReplyTo={actions.setReplyTo}
                    editingId={actions.editingCommentId}
                    setEditingId={actions.setEditingCommentId}
                    onEdit={actions.handleEditComment}
                    onDelete={actions.handleDeleteComment}
                    editForm={actions.editCommentForm}
                    onAddReply={actions.handleAddComment}
                  />
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
