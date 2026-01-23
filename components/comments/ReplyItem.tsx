import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { ka } from "date-fns/locale";
import Link from "next/link";
import { UserAvatarItem } from "../ui/UserAvatarItem";

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
    <div className="flex gap-3 relative group/reply">
      {/* დაკავშირების ხაზი */}
      <div className="absolute -left-6 top-4 w-4 h-px bg-stone-800" />

      <div className="relative h-6 w-6 min-w-6">
        <UserAvatarItem
          key={reply.user.id}
          user={reply.user}
          size="sm"
          showName={false}
        />
      </div>

      <div className="flex-1 ml-4">
        <div className="flex items-baseline gap-2">
          <span className="text-[9px] font-bold text-amber-700/80 uppercase">
            {reply.user.firstName} {reply.user.lastName}
          </span>
          <span className="text-[8px] text-stone-600 font-mono">
            {formatDistanceToNow(new Date(reply.createdAt), {
              addSuffix: true,
              locale: ka,
            })}
          </span>
        </div>

        {isEditing ? (
          <form
            onSubmit={editForm.handleSubmit((data: { content: string }) =>
              onEdit(reply.id, data, true, parentId),
            )}
            className="mt-2 flex gap-2"
          >
            <input
              {...editForm.register("content")}
              className="flex-1 bg-stone-800 border border-stone-700 text-[#EBE9E1] text-[11px] px-2 py-1 focus:outline-none rounded"
              autoFocus
            />
            <button
              type="submit"
              className="text-amber-600 text-[10px] uppercase font-bold"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                editForm.reset();
              }}
              className="text-stone-500 text-[10px] uppercase"
            >
              Cancel
            </button>
          </form>
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
                className="text-[8px] text-stone-600 hover:text-blue-500 uppercase"
              >
                [Edit]
              </button>
              <button
                onClick={() => onDelete(reply.id, true, parentId)}
                className="text-[8px] text-stone-600 hover:text-red-500 uppercase"
              >
                [Del]
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
