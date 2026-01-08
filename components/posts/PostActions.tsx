import {
  Heart,
  MessageCircle,
  Share2,
  Edit2,
  Trash2,
  Bookmark,
} from "lucide-react";

interface PostActionsProps {
  likesCount: number;
  isLiked: boolean;
  isSaved: boolean;
  commentsCount: number;
  onLike: () => void;
  onToggleComments: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onSave: () => void;
}

export function PostActions({
  likesCount,
  isLiked,
  isSaved,
  commentsCount,
  onLike,
  onToggleComments,
  onEdit,
  onDelete,
  onSave,
}: PostActionsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 border-t border-stone-800 bg-[#181615]">
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

      <div className="flex items-center justify-center gap-4 py-3 border-l border-stone-800 hover:bg-stone-800">
        <button
          onClick={onEdit}
          className="text-stone-600 hover:text-stone-300"
        >
          <Edit2 size={14} />
        </button>
        <button
          onClick={onDelete}
          className="text-stone-600 hover:text-red-900"
        >
          <Trash2 size={14} />
        </button>
        <button
          onClick={onSave}
          className={isSaved ? "text-amber-600" : "text-stone-600"}
        >
          <Bookmark size={14} className={isSaved ? "fill-current" : ""} />
        </button>
      </div>
    </div>
  );
}
