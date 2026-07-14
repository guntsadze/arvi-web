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
      className="text-[9px] uppercase font-bold text-text-secondary hover:text-accent transition-colors"
    >
      პასუხი
    </button>
    <button
      onClick={onEdit}
      className="text-[9px] uppercase font-bold text-text-secondary hover:text-info transition-colors"
    >
      რედაქტირება
    </button>
    <button
      onClick={onDelete}
      className="text-[9px] uppercase font-bold text-text-secondary hover:text-error transition-colors"
    >
      წაშლა
    </button>
  </div>
);
