import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";

export function CommentFooterActions({
  comment,
  onReplyClick,
  onLikeClick,
}: any) {
  return (
    <div className="flex items-center gap-3 mt-1 ml-1">
      <button
        className="group flex items-center transition-all active:scale-125"
        onClick={onLikeClick}
      >
        <Heart
          size={14}
          className={cn(
            "transition-all duration-200",
            comment.isLiked
              ? "fill-amber-500 text-amber-500 filter drop-shadow-[0_0_3px_rgba(245,158,11,0.6)]"
              : "text-stone-500 group-hover:text-stone-300",
          )}
        />
      </button>

      <div className="w-[1px] h-2.5 bg-stone-800" />

      <button
        onClick={onReplyClick}
        className="text-[11px] font-bold text-stone-500 hover:text-stone-300 transition-colors uppercase tracking-tighter"
      >
        პასუხი
      </button>

      {comment.likesCount > 0 && (
        <div className="ml-auto flex items-center gap-1 bg-stone-900/80 px-2 py-0.5 rounded border border-stone-800 shadow-sm">
          {/* პატარა ვარსკვლავი ან წერტილი */}
          <div
            className={cn(
              "w-1 h-1 rounded-full",
              comment.isLiked ? "bg-amber-500 animate-pulse" : "bg-stone-600",
            )}
          />
          <span className="text-[9px] font-mono text-stone-400">
            {comment.likesCount}
          </span>
        </div>
      )}
    </div>
  );
}
