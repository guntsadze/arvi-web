"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, Terminal, Video, ImageIcon, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { z } from "zod";
import FileUploader from "../ui/FileUploader";
import { postsService } from "@/services/posts/posts.service";
import { storageService } from "@/services/storage.service";

const postSchema = z.object({
  content: z.string().min(1).max(5000),
  media: z.array(z.any()).default([]),
});

export function PostForm({ refresh }: { refresh: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const { register, handleSubmit, control, watch, reset } = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: { content: "", media: [] },
  });

  const content = watch("content");

  // ტექსტის სიმაღლის ავტომატური რეგულირება
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "24px";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  const onSubmit = async (data: z.infer<typeof postSchema>) => {
    console.log("🚀 ~ onSubmit ~ data:", data);
    setIsSubmitting(true);
    try {
      let uploadedMedia = [];

      if (data.media.length > 0) {
        // პარალელური ატვირთვა
        const results = await Promise.all(
          data.media.map((m: any) =>
            storageService.uploadFile(m.file, "posts"),
          ),
        );

        // ბექენდისთვის ფორმატირება
        uploadedMedia = results.map((res, i) => ({
          ...res,
          mediaType: data.media[i].type.toUpperCase(), // "IMAGE" ან "VIDEO"
        }));
      }

      await postsService.createPost({
        content: data.content,
      });
      reset();
      refresh();
    } catch (e) {
      console.error("Upload error:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  // დამხმარე კომპონენტი აიქონებისთვის
  const MediaButton = ({ type, icon: Icon, count, colorClass }: any) => (
    <button
      type="button"
      className={`relative p-2 transition-all rounded hover:bg-stone-900/50 ${colorClass}`}
    >
      <Icon size={16} />
      {count > 0 && (
        <span
          className={`absolute -top-0.5 -right-0.5 w-3.5 h-3.5 text-[8px] text-white flex items-center justify-center font-bold rounded-full border border-[#1c1917] ${type === "image" ? "bg-amber-600" : "bg-blue-600"}`}
        >
          {count}
        </span>
      )}
    </button>
  );

  const { ref, ...rest } = register("content");

  return (
    <div className="w-full max-w-3xl mx-auto mb-6 px-2">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative flex items-end gap-2 bg-[#1c1917] border border-stone-800 p-2 min-h-[54px] shadow-lg group focus-within:border-stone-700 transition-all"
      >
        {/* Tech Decor */}
        <div className="absolute -top-px -left-px w-1 h-1 bg-amber-500/50" />
        <div className="absolute -bottom-px -right-px w-1 h-1 bg-amber-500/50" />

        <div className="flex items-center justify-center px-1 mb-1.5 border-r border-stone-800/50">
          <Terminal
            size={14}
            className={
              isSubmitting
                ? "animate-pulse text-amber-500"
                : "text-stone-700 group-focus-within:text-amber-600"
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
          placeholder="New status..."
          className="flex-1 bg-transparent border-none outline-none font-mono text-sm text-stone-200 placeholder:text-stone-700 px-2 py-1.5 resize-none overflow-hidden max-h-[200px]"
          disabled={isSubmitting}
        />

        <div className="flex items-center gap-1 mb-0.5">
          <Controller
            name="media"
            control={control}
            render={({ field }) => (
              <>
                <FileUploader
                  accept="image/*"
                  multiple
                  showPreview={false}
                  onFilesChange={(files) =>
                    field.onChange([...field.value, ...files])
                  }
                >
                  <MediaButton
                    type="image"
                    icon={ImageIcon}
                    count={
                      field.value.filter((m: any) => m.type === "image").length
                    }
                    colorClass="text-[#EBE9E1] hover:text-amber-500"
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
                  <MediaButton
                    type="video"
                    icon={Video}
                    count={
                      field.value.filter((m: any) => m.type === "video").length
                    }
                    colorClass="text-[#EBE9E1] hover:text-blue-500"
                  />
                </FileUploader>
              </>
            )}
          />

          <button
            type="submit"
            disabled={isSubmitting || !content?.trim()}
            className="ml-2 h-9 px-4 bg-amber-600 hover:bg-amber-500 disabled:bg-stone-800/50 disabled:text-[#EBE9E1] text-stone-950 font-black text-[10px] tracking-tight uppercase transition-all flex items-center gap-2"
            style={{ clipPath: "polygon(10% 0, 100% 0, 100% 100%, 0 100%)" }}
          >
            {isSubmitting ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <>
                <span className="hidden sm:inline"></span> <Send size={12} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
