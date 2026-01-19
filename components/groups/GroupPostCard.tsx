"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ImageSlider } from "../ui/ImageSlider";
import { PostHeader } from "../posts/PostHeader";
import { PostContent } from "../posts/PostContent";
import { PostActions } from "../posts/PostActions";
import { postsService } from "@/services/posts/posts.service";
import { groupsService } from "@/services/groups.service"; // ჯგუფის სერვისი
import { CommentForm } from "../comments/CommentForm";
import { CommentItem } from "../comments/CommentItem";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/store/slices/userSlice";
import { Pin } from "lucide-react";

interface GroupPostCardProps {
  post: any;
  refresh: () => void;
  myRole?: string; // ჯგუფში მომხმარებლის როლი (OWNER, ADMIN, MODERATOR, MEMBER)
}

export function GroupPostCard({ post, refresh, myRole }: GroupPostCardProps) {
  const currentUser = useAppSelector(selectCurrentUser);

  const [state, setState] = useState({
    isLiked: post.isLiked || false,
    likesCount: post.likesCount || 0,
    showComments: false,
    comments: [] as any[],
    editingPost: false,
    isPinned: post.isPinned || false,
  });

  const setPartialState = (partial: Partial<typeof state>) =>
    setState((prev) => ({ ...prev, ...partial }));

  // პერმისიების ლოგიკა
  const isPostAuthor = currentUser?.id === post?.userId;
  const canManagePost =
    isPostAuthor || ["OWNER", "ADMIN", "MODERATOR"].includes(myRole || "");

  const handleLike = async () => {
    try {
      const res = await postsService.likePost(post.id);
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

  const handleAddComment = async (data: { content: string }) => {
    try {
      const newComment = await postsService.addComment(post.id, data.content);
      setPartialState({ comments: [newComment, ...state.comments] });
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
          onEdit={
            isPostAuthor
              ? () => setPartialState({ editingPost: true })
              : undefined
          }
          onDelete={canManagePost ? handleDeletePost : undefined}
          isOwner={isPostAuthor}
          // აქ შეგიძლია დაამატო "Pin" ღილაკი თუ ადმინია
        />

        {/* Pin Button for Admins */}
        {["OWNER", "ADMIN", "MODERATOR"].includes(myRole || "") && (
          <button
            onClick={handlePinPost}
            className={`absolute top-4 right-12 p-1 transition-colors ${state.isPinned ? "text-amber-500" : "text-stone-700 hover:text-stone-400"}`}
          >
            <Pin size={14} />
          </button>
        )}

        <div className="p-4 bg-[#201d1b]">
          <PostContent
            post={post}
            isEditing={state.editingPost}
            onSave={() => {}} // შენი handleUpdatePost ლოგიკა
            onCancel={() => setPartialState({ editingPost: false })}
          />
        </div>

        {post.images && post.images.length > 0 && (
          <div className="border-y border-stone-800/50">
            <ImageSlider images={post.images} aspectRatio="aspect-[16/9]" />
          </div>
        )}

        <PostActions
          likesCount={state.likesCount}
          isLiked={state.isLiked}
          commentsCount={post.commentsCount || 0}
          isSaved={false} // ჯგუფის პოსტებზე თუ გინდა Save
          onLike={handleLike}
          onToggleComments={() =>
            setPartialState({ showComments: !state.showComments })
          }
          onSave={() => {}}
        />

        {state.showComments && (
          <div className="bg-[#151413] border-t border-stone-800 p-6">
            <CommentForm
              onSubmit={handleAddComment}
              placeholder="Append_To_Log..."
              buttonText="Exec"
            />
            {/* აქ კომენტარების მეპი (იგივე რაც PostCard-ში) */}
          </div>
        )}
      </div>
    </div>
  );
}
