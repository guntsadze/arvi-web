"use client";

import { MediaSlider } from "../ui/MediaSlider";
import { PostHeader } from "./PostHeader";
import { PostContent } from "./PostContent";
import { PostActions } from "./PostActions";
import { CommentForm } from "../comments/CommentForm";
import { CommentItem } from "../comments/CommentItem";
import { EditPostModal } from "./EditPostModal";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/store/slices/userSlice";
import { usePresence } from "@/context/PresenceContext";
import { usePostActions } from "@/hooks/usePostActions";
import { usePostEdit } from "@/hooks/usePostEdit";
import { Post } from "@/types/post.types";

interface PostCardProps {
  post: Post;
  refresh: () => void;
}

export function PostCard({ post, refresh }: PostCardProps) {
  const currentUser = useAppSelector(selectCurrentUser);
  const { isUserOnline } = usePresence();
  const online = isUserOnline(post.user.id);
  const isOwner = currentUser?.id === post.user.id;

  // ყველა like/save/comment ლოგიკა
  const actions = usePostActions(post, refresh);

  // edit modal — API fetch + form
  const edit = usePostEdit(post.id, refresh);

  return (
    <>
      {/* Edit Modal — PostCard-ის გარეთ რენდერდება */}
      <EditPostModal
        post={edit.postData}
        isOpen={edit.isOpen}
        isLoading={edit.isLoading}
        onClose={edit.closeModal}
        onSave={edit.handleSave}
      />

      <div className="relative mb-8 group/card">
        <div className="bg-[#201d1b] border border-stone-800 hover:border-stone-600 transition-colors duration-300 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-600 to-transparent opacity-50" />
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-600 to-transparent opacity-50" />

          <PostHeader
            user={post.user}
            createdAt={post.createdAt}
            onEdit={edit.openModal}
            onDelete={actions.handleDeletePost}
            isOwner={isOwner}
            online={online}
          />

          <div className="p-4 bg-[#201d1b]">
            <PostContent post={post} />
          </div>

          {post.media?.length > 0 && (
            <MediaSlider media={post.media} aspectRatio="aspect-[16/9]" />
          )}

          <PostActions
            likesCount={actions.likesCount}
            isLiked={actions.isLiked}
            commentsCount={post.commentsCount}
            isSaved={actions.isSaved}
            onLike={actions.handleLike}
            onToggleComments={actions.toggleComments}
            onSave={actions.handleSave}
          />

          {actions.showComments && (
            <div className="bg-[#151413] border-t border-stone-800 p-6">
              <CommentForm
                onSubmit={(data) => actions.handleAddComment(data)}
                placeholder="Append comment to log..."
                buttonText="Exec"
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
        </div>
      </div>
    </>
  );
}
