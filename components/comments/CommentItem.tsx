import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { ka } from "date-fns/locale";
import { CommentForm } from "./CommentForm";
import { ReplyItem } from "./ReplyItem";
import Link from "next/link";
import { UserAvatarItem } from "../ui/UserAvatarItem";

export function CommentItem({
  comment,
  replyTo,
  setReplyTo,
  editingId,
  setEditingId,
  onEdit,
  onDelete,
  editForm,
  onAddReply,
}: CommentItemProps) {
  const isEditing = editingId === comment.id;

  return (
    <div className="relative group/comment">
      {/* ვერტიკალური ხაზი შვილებისთვის */}
      <div className="absolute left-4 top-8 bottom-0 w-px bg-stone-800 last:hidden" />

      <div className="flex gap-4">
        <div className="relative h-8 w-8 min-w-8">
          <UserAvatarItem key={comment.user.id} user={comment.user} />
        </div>

        <div className="flex-1">
          {/* Comment Header */}
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-bold text-[10px] uppercase text-stone-400 tracking-wider">
              {comment.user.firstName} {comment.user.lastName}
            </span>
            <span className="text-[9px] text-stone-700 font-mono">
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
                locale: ka,
              })}
            </span>
          </div>

          {/* Comment Body / Edit Form */}
          {isEditing ? (
            <form
              onSubmit={editForm.handleSubmit((data: { content: string }) =>
                onEdit(comment.id, data, false)
              )}
              className="mb-3"
            >
              <div className="flex gap-2">
                <input
                  {...editForm.register("content")}
                  className="flex-1 bg-stone-800 border border-stone-600 text-[#EBE9E1] text-xs px-3 py-1.5 focus:outline-none rounded"
                  autoFocus
                />
                <button
                  type="submit"
                  className="text-amber-600 text-xs uppercase font-bold"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    editForm.reset();
                  }}
                  className="text-stone-500 text-xs uppercase"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <p className="text-xs text-[#dcd8c8] font-mono leading-relaxed mb-3 opacity-90 border-l-2 border-stone-700 pl-3">
              {comment.content}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-4 opacity-40 group-hover/comment:opacity-100 transition-opacity">
            <button
              onClick={() => setReplyTo(comment.id)}
              className="text-[9px] uppercase font-bold text-stone-500 hover:text-amber-600"
            >
              Reply
            </button>
            <button
              onClick={() => {
                editForm.setValue("content", comment.content);
                setEditingId(comment.id);
              }}
              className="text-[9px] uppercase font-bold text-stone-500 hover:text-blue-500"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(comment.id)}
              className="text-[9px] uppercase font-bold text-stone-500 hover:text-red-500"
            >
              Del
            </button>
          </div>

          {/* Reply Form */}
          {replyTo === comment.id && (
            <div className="mt-4 border-l-4 border-amber-600/30 pl-4">
              <CommentForm
                onSubmit={(data) => {
                  onAddReply(data, comment.id);
                  setReplyTo(null);
                }}
                placeholder="Reply to this comment..."
                buttonText="Send"
                autoFocus
              />
            </div>
          )}

          {/* Replies List */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-5 space-y-4 border-l border-stone-800 ml-4 pl-6">
              {comment.replies.map((reply) => (
                <ReplyItem
                  key={reply.id}
                  reply={reply}
                  parentId={comment.id}
                  editingId={editingId}
                  setEditingId={setEditingId}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  editForm={editForm}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
