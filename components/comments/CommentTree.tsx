import { useMemo } from "react";
import { buildCommentTree } from "@/lib/utils";
import { CommentItem } from "./CommentItem";

export function CommentTree({ comments, actions }: any) {
  const tree = useMemo(() => buildCommentTree(comments), [comments]);

  return (
    <div className="space-y-2">
      {tree.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          replyTo={actions.replyTo}
          setReplyTo={actions.setReplyTo}
          editingId={actions.editingCommentId}
          setEditingId={actions.setEditingCommentId}
          onEdit={actions.handleEditComment}
          onDelete={actions.handleDeleteComment}
          editForm={actions.editCommentForm}
          onAddReply={actions.handleAddComment}
        />
      ))}
    </div>
  );
}
