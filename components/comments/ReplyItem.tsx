import { UserAvatarItem } from "../ui/UserAvatarItem";
import { CommentHeader } from "./CommentHeader";
import { InlineEditForm } from "./InlineEditForm";

interface ReplyItemProps {
  reply: any; // სასურველია მიუთითო შენი Reply ინტერფეისი
  parentId: string;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  onEdit: (
    id: string,
    data: { content: string },
    isReply: boolean,
    parentId: string,
  ) => void;
  onDelete: (id: string, isReply: boolean, parentId: string) => void;
  editForm: any;
}

export function ReplyItem({
  reply,
  parentId,
  editingId,
  setEditingId,
  onEdit,
  onDelete,
  editForm,
}: ReplyItemProps) {
  const isEditing = editingId === reply.id;

  return (
    <div className="flex gap-3 relative group/reply ml-4">
      <div className="absolute -left-6 top-4 w-4 h-px bg-stone-800" />

      <UserAvatarItem user={reply.user} size="sm" showName={false} />

      <div className="flex-1 ml-2">
        <CommentHeader user={reply.user} createdAt={reply.createdAt} isReply />

        {isEditing ? (
          <InlineEditForm
            form={editForm}
            onSubmit={(data) => onEdit(reply.id, data, true, parentId)}
            onCancel={() => {
              setEditingId(null);
              editForm.reset();
            }}
          />
        ) : (
          <>
            <p className="text-xs text-stone-400 font-mono leading-relaxed mt-1">
              {reply.content}
            </p>
            <div className="flex gap-4 mt-2 opacity-0 group-hover/reply:opacity-100 transition-opacity">
              <button
                onClick={() => {
                  editForm.setValue("content", reply.content);
                  setEditingId(reply.id);
                }}
                className="text-[8px] text-stone-300 hover:text-blue-500 uppercase font-bold"
              >
                რედაქტირება
              </button>
              <button
                onClick={() => onDelete(reply.id, true, parentId)}
                className="text-[8px] text-stone-300 hover:text-red-500 uppercase font-bold"
              >
                წაშლა
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
