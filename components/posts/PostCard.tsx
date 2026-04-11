"use client";

import { MediaSlider } from "../ui/MediaSlider";
import { PostContent } from "./PostContent";
import { CommentForm } from "../comments/CommentForm";
import { EditPostModal } from "./EditPostModal";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/store/slices/userSlice";
import { usePresence } from "@/context/PresenceContext";
import { usePostActions } from "@/hooks/usePostActions";
import { usePostEdit } from "@/hooks/usePostEdit";
import { Post } from "@/types/post.types";
import { ActivityHeader, ActivityVariant } from "../shared/ActivityHeader";
import { ActivityMenu } from "../shared/ActivityMenu";
import { ActivityActions } from "../shared/ActivityActions";
import { useLikeAction } from "@/hooks/useLikeAction";
import { CommentTree } from "../comments/CommentTree";

interface PostCardProps {
  activity?: any;
  post?: Post;
  refresh: () => void;
}

export function PostCard({ activity, post, refresh }: PostCardProps) {
  const currentUser = useAppSelector(selectCurrentUser);
  const { isUserOnline } = usePresence();

  const content = post || activity?.post;
  if (!content) return null;

  const online = isUserOnline(content.user.id);
  const isOwner = currentUser?.id === content.user.id;

  // პოსტის ძირითადი აქციები (delete, save, comment fetch)
  const actions = usePostActions(content, refresh);

  // ლაიქის ლოგიკა
  const { isLiked, likesCount, handleLike } = useLikeAction({
    id: content.id,
    type: "posts",
    initialIsLiked: content.isLiked || content.likes?.length > 0,
    initialCount: content.likesCount,
  });

  // ედიტირების მართვა
  const edit = usePostEdit(content.id, refresh);
  const variant = activity?.type.toLowerCase() as ActivityVariant;

  return (
    <>
      <EditPostModal
        post={edit.postData}
        isOpen={edit.isOpen}
        isLoading={edit.isLoading}
        onClose={edit.closeModal}
        onSave={edit.handleSave}
      />

      <div className="relative mb-6 group/card">
        <div className="bg-[#1a1817] border border-stone-800/60 hover:border-stone-700 transition-all duration-300 overflow-hidden rounded-sm">
          {/* დეკორატიული ხაზები */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-600/30 to-transparent" />

          <ActivityHeader
            user={content.user}
            createdAt={content.createdAt}
            variant={variant}
            online={online}
            menu={
              <ActivityMenu
                isOwner={isOwner}
                onEdit={edit.openModal}
                onDelete={actions.handleDeletePost}
              />
            }
          />

          <div className="px-4 py-2">
            <PostContent post={content} />
          </div>

          {content.media?.length > 0 && (
            <div className="mt-2">
              <MediaSlider media={content.media} aspectRatio="aspect-[16/9]" />
            </div>
          )}

          <ActivityActions
            variant="post"
            likesCount={likesCount}
            isLiked={isLiked}
            commentsCount={content.commentsCount}
            isSaved={actions.isSaved}
            onLike={handleLike}
            onToggleComments={actions.toggleComments}
            onSave={actions.handleSave}
          />

          {/* კომენტარების სექცია - იხსნება მხოლოდ toggle-ზე */}
          {actions.showComments && (
            <div className="border-t border-stone-800/50 bg-[#1e1c1b]/30 pb-4">
              <CommentForm
                onSubmit={(data) => actions.handleAddComment(data)}
                placeholder="დაწერე კომენტარი..."
                autoFocus={true}
              />

              {actions.comments && actions.comments.length > 0 && (
                <div className="px-4 mt-2">
                  <CommentTree comments={actions.comments} actions={actions} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
