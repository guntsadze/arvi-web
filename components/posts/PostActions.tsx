import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";

interface PostActionsProps {
  likesCount: number;
  isLiked: boolean;
  isSaved: boolean;
  commentsCount: number;
  onLike: () => void;
  onToggleComments: () => void;
  onSave: () => void;
}

export function PostActions({
  likesCount,
  isLiked,
  isSaved,
  commentsCount,
  onLike,
  onToggleComments,
  onSave,
}: PostActionsProps) {
  return (
    <div className="grid grid-cols-4 border-t border-border bg-surface-2">
      <button
        onClick={onLike}
        className={`flex items-center justify-center gap-2 py-3 text-xs font-mono uppercase transition-colors hover:bg-surface-1-hover ${
          isLiked ? "text-error" : "text-text-secondary"
        }`}
      >
        <Heart size={16} className={isLiked ? "fill-current" : ""} />
        <span>{likesCount}</span>
      </button>

      <button
        onClick={onToggleComments}
        className="flex items-center justify-center gap-2 py-3 text-xs font-mono uppercase text-text-secondary hover:text-accent hover:bg-surface-1-hover border-l border-border"
      >
        <MessageCircle size={16} />
        <span>{commentsCount}</span>
      </button>

      <button className="flex items-center justify-center gap-2 py-3 text-xs font-mono uppercase text-text-secondary hover:text-info hover:bg-surface-1-hover border-l border-border">
        <Share2 size={16} />
      </button>

      <button
        onClick={onSave}
        className={`flex items-center justify-center gap-2 py-3 border-l border-border hover:bg-surface-1-hover transition-colors ${
          isSaved ? "text-accent" : "text-text-primary"
        }`}
      >
        <Bookmark size={16} className={isSaved ? "fill-current" : ""} />
      </button>
    </div>
  );
}
