import { formatDistanceToNowStrict } from "date-fns";
import { ka } from "date-fns/locale";
import { ActivityMenu } from "../shared/ActivityMenu";
import { InlineEditForm } from "./InlineEditForm";

export function CommentBubble({
  comment,
  isEditing,
  onEdit,
  onDelete,
  setEditingId,
  editForm,
}: any) {
  const timeAgo = comment.createdAt
    ? formatDistanceToNowStrict(new Date(comment.createdAt), { locale: ka })
        .replace("წამის", "წმ")
        .replace("წუთის", "წთ")
        .replace("საათის", "სთ")
        .replace("დღის", "დ")
    : "ახლახან";

  return (
    <div className="bg-[#2b2826] rounded-2xl rounded-tl-none p-3 relative group/bubble">
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <span className="text-[12px] font-bold text-[#EBE9E1] hover:underline cursor-pointer">
            {comment.user.firstName} {comment.user.lastName}
          </span>
          <span className="text-[10px] text-stone-500 font-mono">
            {comment.user.headline || "Member"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-stone-500 whitespace-nowrap">
            {timeAgo}
          </span>
          <ActivityMenu
            isOwner={true}
            onEdit={() => {
              editForm.setValue("content", comment.content);
              setEditingId(comment.id);
            }}
            onDelete={() => onDelete(comment.id)}
          />
        </div>
      </div>

      <div className="mt-2">
        {isEditing ? (
          <InlineEditForm
            form={editForm}
            onSubmit={(data: any) => onEdit(comment.id, data)}
            onCancel={() => {
              setEditingId(null);
              editForm.reset();
            }}
          />
        ) : (
          <p className="text-[13px] text-[#dcd8c8] leading-normal break-words">
            {comment.content}
          </p>
        )}
      </div>
    </div>
  );
}
