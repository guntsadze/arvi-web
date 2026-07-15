"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, Terminal, ImageIcon, Loader2, Video, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { z } from "zod";
import { useMediaUpload } from "@/hooks/useMediaUpload";

const postSchema = z.object({
  content: z.string().min(1, "Required").max(5000),
});

interface UnifiedPostFormProps {
  onSave: (data: { content: string; mediaIds: string[] }) => Promise<void>;
  storageFolder: string;
  placeholder?: string;
  onSuccess?: () => void;
  variant?: "general" | "group";
}

export function UnifiedPostForm({
  onSave,
  storageFolder,
  placeholder = "INITIALIZE_BROADCAST...",
  onSuccess,
  variant = "general",
}: UnifiedPostFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  // Files upload to POST /media the moment they're picked, not on submit —
  // submitting the post is then just sending the finished mediaIds.
  const { items, addFiles, removeItem, mediaIds, isUploading, reset: resetMedia } =
    useMediaUpload(storageFolder);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: { content: "" },
  });

  const content = watch("content");

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "24px";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  const onSubmit = async (data: z.infer<typeof postSchema>) => {
    setIsSubmitting(true);
    try {
      await onSave({
        content: data.content,
        mediaIds,
      });

      reset();
      resetMedia([]);
      if (onSuccess) onSuccess();
    } catch (e) {
      console.error("Post Creation Error:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const imageCount = items.filter((i) => i.kind === "image").length;
  const videoCount = items.filter((i) => i.kind === "video").length;

  const ActionButton = ({ type, icon: Icon, count, activeColor }: any) => (
    <button
      type="button"
      className={`relative p-2 transition-all rounded hover:bg-surface-1-hover/50 text-text-muted hover:${activeColor}`}
    >
      <Icon size={16} />
      {count > 0 && (
        <span
          className={`absolute -top-1 -right-1 w-4 h-4 text-[8px] text-white flex items-center justify-center font-bold rounded-sm border border-surface-1 ${
            type === "image" ? "bg-accent" : "bg-info"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );

  const { ref, ...rest } = register("content");

  return (
    <div className="w-full mb-6 relative">
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {items.map((item) => (
            <div
              key={item.localId}
              className="relative h-14 w-14 overflow-hidden rounded border border-border bg-surface-1"
            >
              {item.kind === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.previewUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <video src={item.previewUrl} className="h-full w-full object-cover" />
              )}
              {item.status === "uploading" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white">
                  <Loader2 size={14} className="animate-spin" />
                </div>
              )}
              {item.status === "error" && (
                <div className="absolute inset-0 flex items-center justify-center bg-error/80 text-white text-[9px] font-medium text-center px-1">
                  ვერ აიტვირთა
                </div>
              )}
              <button
                type="button"
                onClick={() => removeItem(item.localId)}
                className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-error text-white"
              >
                <X size={9} />
              </button>
            </div>
          ))}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative flex items-end gap-2 bg-surface-1 border border-border p-2 min-h-[54px] shadow-2xl focus-within:border-border transition-all"
      >
        <div className="absolute -top-px -left-px w-1 h-1 bg-accent/50" />
        <div className="absolute -bottom-px -right-px w-1 h-1 bg-accent/50" />

        <div className="flex items-center px-1 mb-1.5 border-r border-border/50">
          <Terminal
            size={14}
            className={
              isSubmitting ? "animate-pulse text-accent" : "text-text-muted"
            }
          />
        </div>

        <textarea
          {...rest}
          ref={(e) => {
            ref(e);
            textareaRef.current = e;
          }}
          rows={1}
          placeholder={placeholder}
          className="flex-1 bg-transparent border-none outline-none font-mono text-sm text-text-primary placeholder:text-text-secondary px-2 py-1.5 resize-none overflow-hidden max-h-[300px]"
          disabled={isSubmitting}
        />

        <div className="flex items-center gap-1 mb-0.5">
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) addFiles(Array.from(e.target.files));
              e.target.value = "";
            }}
          />
          <div onClick={() => imageInputRef.current?.click()}>
            <ActionButton
              type="image"
              icon={ImageIcon}
              count={imageCount}
              activeColor="text-accent"
            />
          </div>

          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) addFiles(Array.from(e.target.files));
              e.target.value = "";
            }}
          />
          <div onClick={() => videoInputRef.current?.click()}>
            <ActionButton
              type="video"
              icon={Video}
              count={videoCount}
              activeColor="text-info"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isUploading || !content?.trim()}
            className="ml-2 h-9 px-5 bg-accent hover:bg-primary-hover disabled:bg-surface-1 disabled:text-text-secondary text-background font-black text-[10px] tracking-widest uppercase transition-all flex items-center gap-2"
            style={{ clipPath: "polygon(10% 0, 100% 0, 100% 100%, 0 100%)" }}
          >
            {isSubmitting || isUploading ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <>
                <Send size={12} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
