interface CommentActionsProps {
  onReply: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const CommentActions = ({
  onReply,
  onEdit,
  onDelete,
}: CommentActionsProps) => (
  <div className="flex gap-4 opacity-40 group-hover/comment:opacity-100 transition-opacity">
    <button
      onClick={onReply}
      className="text-[9px] uppercase font-bold text-stone-300 hover:text-amber-600 transition-colors"
    >
      პასუხი
    </button>
    <button
      onClick={onEdit}
      className="text-[9px] uppercase font-bold text-stone-300 hover:text-blue-500 transition-colors"
    >
      რედაქტირება
    </button>
    <button
      onClick={onDelete}
      className="text-[9px] uppercase font-bold text-stone-300 hover:text-red-500 transition-colors"
    >
      წაშლა
    </button>
  </div>
);
