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
    <div className="grid grid-cols-4 border-t border-stone-800 bg-[#181615]">
      <button
        onClick={onLike}
        className={`flex items-center justify-center gap-2 py-3 text-xs font-mono uppercase transition-colors hover:bg-stone-800 ${
          isLiked ? "text-red-500" : "text-stone-500"
        }`}
      >
        <Heart size={16} className={isLiked ? "fill-current" : ""} />
        <span>{likesCount}</span>
      </button>

      <button
        onClick={onToggleComments}
        className="flex items-center justify-center gap-2 py-3 text-xs font-mono uppercase text-stone-500 hover:text-amber-500 hover:bg-stone-800 border-l border-stone-800"
      >
        <MessageCircle size={16} />
        <span>{commentsCount}</span>
      </button>

      <button className="flex items-center justify-center gap-2 py-3 text-xs font-mono uppercase text-stone-500 hover:text-blue-500 hover:bg-stone-800 border-l border-stone-800">
        <Share2 size={16} />
      </button>

      <button
        onClick={onSave}
        className={`flex items-center justify-center gap-2 py-3 border-l border-stone-800 hover:bg-stone-800 transition-colors ${
          isSaved ? "text-amber-600" : "text-stone-600"
        }`}
      >
        <Bookmark size={16} className={isSaved ? "fill-current" : ""} />
      </button>
    </div>
  );
}
