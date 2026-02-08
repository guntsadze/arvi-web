"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, Terminal, ImageIcon, Loader2, Video } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { z } from "zod";
import FileUploader from "../../ui/FileUploader";
import { storageService } from "@/services/storage.service";

const postSchema = z.object({
  content: z.string().min(1, "Required").max(5000),
  media: z.array(z.any()).default([]),
});

interface UnifiedPostFormProps {
  onSave: (data: { content: string; media: any[] }) => Promise<void>;
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

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: { content: "", media: [] },
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
      let uploadedMedia: any = [];

      if (data.media.length > 0) {
        const results = await Promise.all(
          data.media.map((m: any) =>
            storageService.uploadFile(m.file, storageFolder),
          ),
        );

        uploadedMedia = results.map((res, i) => ({
          url: res.url,
          publicId: res.publicId,
          bytes: res.bytes,
          format: res.format,
          mediaType: data.media[i].type.toUpperCase().includes("VIDEO")
            ? "VIDEO"
            : "IMAGE",
        }));
      }

      await onSave({
        content: data.content,
        media: uploadedMedia,
      });

      reset();
      if (onSuccess) onSuccess();
    } catch (e) {
      console.error("Post Creation Error:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const ActionButton = ({ type, icon: Icon, count, activeColor }: any) => (
    <button
      type="button"
      className={`relative p-2 transition-all rounded hover:bg-stone-900/50 text-stone-700 hover:${activeColor}`}
    >
      <Icon size={16} />
      {count > 0 && (
        <span
          className={`absolute -top-1 -right-1 w-4 h-4 text-[8px] text-white flex items-center justify-center font-bold rounded-sm border border-[#1c1917] ${
            type === "image" ? "bg-amber-600" : "bg-blue-600"
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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative flex items-end gap-2 bg-[#1c1917] border border-stone-800 p-2 min-h-[54px] shadow-2xl focus-within:border-stone-700 transition-all"
      >
        <div className="absolute -top-px -left-px w-1 h-1 bg-amber-500/50" />
        <div className="absolute -bottom-px -right-px w-1 h-1 bg-amber-500/50" />

        <div className="flex items-center px-1 mb-1.5 border-r border-stone-800/50">
          <Terminal
            size={14}
            className={
              isSubmitting ? "animate-pulse text-amber-500" : "text-stone-700"
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
          className="flex-1 bg-transparent border-none outline-none font-mono text-sm text-stone-200 placeholder:text-stone-800 px-2 py-1.5 resize-none overflow-hidden max-h-[300px]"
          disabled={isSubmitting}
        />

        <div className="flex items-center gap-1 mb-0.5">
          <Controller
            name="media"
            control={control}
            render={({ field }: any) => (
              <>
                <FileUploader
                  accept="image/*"
                  multiple
                  showPreview={false}
                  onFilesChange={(files) =>
                    field.onChange([...field.value, ...files])
                  }
                >
                  <ActionButton
                    type="image"
                    icon={ImageIcon}
                    count={
                      field.value.filter((m: any) => m.type.includes("image"))
                        .length
                    }
                    activeColor="text-amber-500"
                  />
                </FileUploader>

                <FileUploader
                  accept="video/*"
                  multiple
                  showPreview={false}
                  onFilesChange={(files) =>
                    field.onChange([...field.value, ...files])
                  }
                >
                  <ActionButton
                    type="video"
                    icon={Video}
                    count={
                      field.value.filter((m: any) => m.type.includes("video"))
                        .length
                    }
                    activeColor="text-blue-500"
                  />
                </FileUploader>
              </>
            )}
          />

          <button
            type="submit"
            disabled={isSubmitting || !content?.trim()}
            className="ml-2 h-9 px-5 bg-amber-600 hover:bg-amber-500 disabled:bg-stone-900 disabled:text-stone-800 text-stone-950 font-black text-[10px] tracking-widest uppercase transition-all flex items-center gap-2"
            style={{ clipPath: "polygon(10% 0, 100% 0, 100% 100%, 0 100%)" }}
          >
            {isSubmitting ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <>
                COMMIT <Send size={12} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
