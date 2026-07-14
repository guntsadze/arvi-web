import { formatDistanceToNowStrict } from "date-fns";
import { ka } from "date-fns/locale";
import { ActivityMenu } from "../shared/ActivityMenu";
import { InlineEditForm } from "./InlineEditForm";
import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export function CommentBubble({
  comment,
  isEditing,
  onEdit,
  onDelete,
  setEditingId,
  editForm,
}: any) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const timeAgo = comment.createdAt
    ? formatDistanceToNowStrict(new Date(comment.createdAt), { locale: ka })
        .replace("წამის", "წმ")
        .replace("წუთის", "წთ")
        .replace("საათის", "სთ")
        .replace("დღის", "დ")
    : "ახლახან";

  const images = comment.media;

  return (
    <div className="bg-surface-2 p-2 relative group/bubble">
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 flex-wrap hover:underline cursor-pointer">
            <p className="font-bold text-text-primary tracking-wide text-xs">
              {comment.user?.firstName} {comment.user?.lastName}
            </p>
            <span className="text-[10px] text-text-primary font-mono">
              @{comment.user?.username}
            </span>
          </div>
          <span className="text-[10px] text-text-muted font-mono">
            {comment.user.headline}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-text-muted whitespace-nowrap">
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
          <p className="text-[13px] text-text-primary leading-normal break-words">
            {comment.content}
          </p>
        )}
      </div>

      {/* მედია გალერეა */}
      {images.length > 0 && (
        <div
          className={`mt-2 grid gap-1 ${
            images.length === 1
              ? "grid-cols-1"
              : images.length === 2
                ? "grid-cols-2"
                : "grid-cols-3"
          }`}
        >
          {images.map((m: any, i: number) => (
            <div
              key={m.id ?? i}
              className="relative aspect-square overflow-hidden rounded cursor-pointer group/img"
              onClick={() => setLightboxIndex(i)}
            >
              <img
                src={m.url}
                alt=""
                className="w-full h-full object-cover transition-transform duration-200 group-hover/img:scale-105"
              />
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightboxIndex(null)}
        >
          {/* დახურვა */}
          <button
            className="absolute top-4 right-4 text-white hover:text-text-secondary transition-colors"
            onClick={() => setLightboxIndex(null)}
          >
            <X size={28} />
          </button>

          {/* წინა */}
          {images.length > 1 && lightboxIndex > 0 && (
            <button
              className="absolute left-4 text-white hover:text-text-secondary transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(lightboxIndex - 1);
              }}
            >
              <ChevronLeft size={36} />
            </button>
          )}

          {/* სურათი */}
          <img
            src={images[lightboxIndex].url}
            alt=""
            className="max-h-[90vh] max-w-[90vw] object-contain rounded"
            onClick={(e) => e.stopPropagation()}
          />

          {/* შემდეგი */}
          {images.length > 1 && lightboxIndex < images.length - 1 && (
            <button
              className="absolute right-4 text-white hover:text-text-secondary transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(lightboxIndex + 1);
              }}
            >
              <ChevronRight size={36} />
            </button>
          )}

          {/* Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 text-text-secondary text-sm">
              {lightboxIndex + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
