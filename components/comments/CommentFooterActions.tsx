export function CommentFooterActions({ comment, onReplyClick }: any) {
  return (
    <div className="flex items-center gap-3 mt-1 ml-1">
      <button
        className="text-[11px] font-bold text-stone-400 hover:text-amber-500 transition-colors"
        onClick={() => console.log("like", comment.id)}
      >
        მოწონება
      </button>
      <div className="w-[1px] h-3 bg-stone-800" />
      <button
        onClick={onReplyClick}
        className="text-[11px] font-bold text-stone-400 hover:text-amber-500 transition-colors"
      >
        პასუხი
      </button>

      {comment.likesCount > 0 && (
        <div className="ml-auto flex items-center gap-1">
          <span className="text-[10px] text-stone-500">
            {comment.likesCount} მოწონება
          </span>
        </div>
      )}
    </div>
  );
}
