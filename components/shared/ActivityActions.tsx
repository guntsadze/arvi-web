import { Heart, MessageCircle, Share2, Bookmark, ThumbsUp } from "lucide-react";

type ActionVariant = "post" | "car" | "minimal";

interface ActivityActionsProps {
  likesCount?: number;
  isLiked?: boolean;
  isSaved?: boolean;
  commentsCount?: number;
  onLike?: () => void;
  onToggleComments?: () => void;
  onSave?: () => void;
  onShare?: () => void;
  variant?: ActionVariant;
}

// variant-ის მიხედვით განსხვავებული config
const LIKE_ICON: Record<ActionVariant, React.ReactNode> = {
  post: <Heart size={16} />,
  car: <ThumbsUp size={16} />,
  minimal: <Heart size={16} />,
};

export function ActivityActions({
  likesCount = 0,
  isLiked = false,
  isSaved = false,
  commentsCount = 0,
  onLike,
  onToggleComments,
  onSave,
  onShare,
  variant = "post",
}: ActivityActionsProps) {
  if (variant === "minimal") {
    // Car card-ისთვის მარტო like
    return (
      <div className="flex items-center gap-4 pt-2 border-t border-stone-800 px-4 pb-3">
        <button
          onClick={onLike}
          className={`flex items-center gap-1.5 transition-colors group/like ${
            isLiked ? "text-amber-500" : "text-stone-500 hover:text-amber-500"
          }`}
        >
          <ThumbsUp size={14} className={isLiked ? "fill-current" : ""} />
          <span className="text-xs font-mono">{likesCount}</span>
          <span className="text-[10px] font-mono uppercase tracking-wider">
            Likes
          </span>
        </button>
      </div>
    );
  }

  // post / car — full actions bar
  const cols = onShare ? "grid-cols-4" : "grid-cols-3";

  return (
    <div className={`grid ${cols} border-t border-stone-800 bg-[#181615]`}>
      {/* Like */}
      <button
        onClick={onLike}
        className={`flex items-center justify-center gap-2 py-3 text-xs font-mono uppercase transition-colors hover:bg-stone-800 ${
          isLiked ? "text-red-500" : "text-stone-500"
        }`}
      >
        {variant === "car" ? (
          <ThumbsUp size={16} className={isLiked ? "fill-current" : ""} />
        ) : (
          <Heart size={16} className={isLiked ? "fill-current" : ""} />
        )}
        <span>{likesCount}</span>
      </button>

      {/* Comments */}
      {onToggleComments && (
        <button
          onClick={onToggleComments}
          className="flex items-center justify-center gap-2 py-3 text-xs font-mono uppercase text-stone-500 hover:text-amber-500 hover:bg-stone-800 border-l border-stone-800"
        >
          <MessageCircle size={16} />
          <span>{commentsCount}</span>
        </button>
      )}

      {/* Share */}
      {onShare && (
        <button
          onClick={onShare}
          className="flex items-center justify-center gap-2 py-3 text-xs font-mono uppercase text-stone-500 hover:text-blue-500 hover:bg-stone-800 border-l border-stone-800"
        >
          <Share2 size={16} />
        </button>
      )}

      {/* Save */}
      {onSave && (
        <button
          onClick={onSave}
          className={`flex items-center justify-center gap-2 py-3 border-l border-stone-800 hover:bg-stone-800 transition-colors ${
            isSaved ? "text-amber-600" : "text-stone-600"
          }`}
        >
          <Bookmark size={16} className={isSaved ? "fill-current" : ""} />
        </button>
      )}
    </div>
  );
}
