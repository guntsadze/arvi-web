"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, Terminal, Video, ImageIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { z } from "zod";
import FileUploader from "../ui/FileUploader";
import { postsService } from "@/services/posts/posts.service";

const createPostSchema = z.object({
  content: z.string().min(1).max(5000),
  images: z.array(z.any()).default([]),
  videos: z.array(z.any()).default([]),
});

export function PostForm({ refresh }: { refresh: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const { register, handleSubmit, control, watch, reset } = useForm({
    resolver: zodResolver(createPostSchema),
    defaultValues: { content: "", images: [], videos: [] },
  });

  const [content, images, videos] = watch(["content", "images", "videos"]);

  // ტექსტის სიმაღლის ავტომატური რეგულირება
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "24px"; // საწყისი მინიმალური სიმაღლე
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight + "px";
    }
  }, [content]);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const payload = {
        content: data.content,
        images: data.images?.map((i: any) => i.base64),
        videos: data.videos?.map((v: any) => v.base64),
      };
      await postsService.createPost(payload);
      reset();
      refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const { ref, ...contentRegister } = register("content");

  return (
    <div className="w-full max-w-3xl mx-auto mb-6 px-2">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative flex items-end gap-2 bg-[#1c1917] border border-stone-800 p-2 min-h-[54px] shadow-lg group transition-all"
      >
        {/* Tech Decor */}
        <div className="absolute -top-px -left-px w-1 h-1 bg-amber-500/50" />
        <div className="absolute -bottom-px -right-px w-1 h-1 bg-amber-500/50" />

        {/* Icon Area (stays at the bottom) */}
        <div className="flex items-center justify-center px-1 mb-1.5 border-r border-stone-800/50">
          <Terminal
            size={14}
            className="text-stone-700 group-focus-within:text-amber-600 transition-colors"
          />
        </div>

        {/* Dynamic Textarea */}
        <textarea
          {...contentRegister}
          ref={(e) => {
            ref(e);
            textareaRef.current = e;
          }}
          rows={1}
          placeholder="New status..."
          className="flex-1 bg-transparent border-none outline-none font-mono text-sm text-stone-200 placeholder:text-stone-700 px-2 py-1.5 resize-none overflow-hidden min-h-[24px] max-h-[200px]"
          disabled={isSubmitting}
        />

        {/* Action Buttons */}
        <div className="flex items-center gap-1 mb-0.5">
          <Controller
            name="images"
            control={control}
            render={({ field }) => (
              <FileUploader
                accept="image/*"
                multiple
                onFilesChange={field.onChange}
                showPreview={false}
              >
                <button
                  type="button"
                  className="relative p-2 text-stone-600 hover:text-amber-500 hover:bg-stone-900/50 transition-all rounded"
                >
                  <ImageIcon size={16} />
                  {images?.length > 0 && (
                    <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-amber-600 text-[8px] text-white flex items-center justify-center font-bold rounded-full">
                      {images.length}
                    </span>
                  )}
                </button>
              </FileUploader>
            )}
          />

          <Controller
            name="videos"
            control={control}
            render={({ field }) => (
              <FileUploader
                accept="video/*"
                multiple
                onFilesChange={field.onChange}
                showPreview={false}
              >
                <button
                  type="button"
                  className="relative p-2 text-stone-600 hover:text-blue-500 hover:bg-stone-900/50 transition-all rounded"
                >
                  <Video size={16} />
                  {videos?.length > 0 && (
                    <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-blue-600 text-[8px] text-white flex items-center justify-center font-bold rounded-full">
                      {videos.length}
                    </span>
                  )}
                </button>
              </FileUploader>
            )}
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !content?.trim()}
            className="ml-2 h-9 px-4 bg-amber-600 hover:bg-amber-500 disabled:bg-stone-800/50 disabled:text-stone-600 text-stone-950 font-black text-[10px] tracking-tight uppercase transition-all flex items-center gap-2 clip-path-slant-sm"
          >
            {isSubmitting ? (
              "..."
            ) : (
              <>
                <span className="hidden sm:inline">COMMIT</span>{" "}
                <Send size={12} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
