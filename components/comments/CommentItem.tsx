import { cn } from "@/lib/utils";
import { CommentForm } from "./CommentForm";
import { UserAvatarItem } from "../ui/UserAvatarItem";
import { CommentBubble } from "./CommentBubble";
import { CommentFooterActions } from "./CommentFooterActions";

interface CommentItemProps {
  comment: any;
  replyTo?: string;
  setReplyTo?: any;
  onLikeClick?: any;
  editingId?: string;
  setEditingId?: any;
  onEdit?: any;
  onDelete?: any;
  editForm?: any;
  onAddReply?: any;
  depth?: number;
}

export function CommentItem({
  comment,
  replyTo,
  setReplyTo,
  onLikeClick,
  editingId,
  setEditingId,
  onEdit,
  onDelete,
  editForm,
  onAddReply,
  depth = 0,
}: CommentItemProps) {
  const isEditing = editingId === comment.id;

  return (
    <div
      className={cn(
        "relative group/comment",
        depth > 0 ? "mt-2 ml-8 md:ml-10" : "mb-4",
      )}
    >
      {/* ── Thread Line (Linkedln Style) ─────────────────────────── */}
      {depth > 0 && (
        <div
          className="absolute -left-5 top-0 w-5"
          style={{ height: "24px" }} // ეს სიმაღლე განსაზღვრავს მოხრის წერტილს
        >
          {/* მოხრილი "L" ნაწილი */}
          <div className="absolute left-0 bottom-0 w-full h-full border-l-[1.5px] border-b-[1.5px] border-stone-700/50 rounded-bl-xl" />
        </div>
      )}

      <div className="flex gap-2 relative">
        {/* ავატარის კონტეინერი */}
        <div className="flex-shrink-0 z-10 pt-1">
          <UserAvatarItem
            user={comment.user}
            size={depth > 0 ? "exsm" : "sm"}
            showName={false}
            // Ring-ი აუცილებელია! ის ფარავს ხაზის ნარჩენებს
            className="ring-[6px] ring-[#1a1817] rounded-full bg-[#1a1817]"
          />
        </div>

        <div className="flex-1 min-w-0">
          <CommentBubble
            comment={comment}
            isEditing={isEditing}
            onEdit={onEdit}
            onDelete={onDelete}
            setEditingId={setEditingId}
            editForm={editForm}
          />

          {/* აქციების ღილაკები (Like, Reply) */}
          {!isEditing && (
            <CommentFooterActions
              comment={comment}
              onReplyClick={() => setReplyTo(comment.id)}
              onLikeClick={() =>
                onLikeClick(comment.id, depth > 0, comment.parentId)
              }
            />
          )}

          {/* Reply Form */}
          {replyTo === comment.id && (
            <div className="mt-2 ml-2">
              <CommentForm
                onSubmit={(data: any) => {
                  onAddReply(data, comment.id);
                  setReplyTo(null);
                }}
                autoFocus
              />
            </div>
          )}

          {/* რეკურსიული რეპლაები */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2 relative">
              {comment.replies.map((reply: any) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  depth={depth + 1}
                  replyTo={replyTo}
                  onLikeClick={onLikeClick}
                  setReplyTo={setReplyTo}
                  editingId={editingId}
                  setEditingId={setEditingId}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  editForm={editForm}
                  onAddReply={onAddReply}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
