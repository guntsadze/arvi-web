"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, Terminal, ImageIcon, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { z } from "zod";
import FileUploader from "../ui/FileUploader";
import { groupsService } from "@/services/groups.service";
import { storageService } from "@/services/storage.service";

const createGroupPostSchema = z.object({
  content: z.string().min(1, "Broadcast content required").max(5000),
  media: z.array(z.any()).default([]),
});

interface GroupPostFormProps {
  groupId: string;
  refresh: () => void;
}

export function GroupPostForm({ groupId, refresh }: GroupPostFormProps) {
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
    resolver: zodResolver(createGroupPostSchema),
    defaultValues: { content: "", media: [] },
  });

  const [content, media] = watch(["content", "media"]);

  // ტექსტის სიმაღლის ავტომატური რეგულირება (შენი ლოგიკა)
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "24px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight + "px";
    }
  }, [content]);

    const onSubmit = async (data: any) => {
      setIsSubmitting(true);
      try {
        // 1. ამოვიღოთ მხოლოდ ფაილები (File ობიექტები)
        const imageFiles = data.media?.map((img: any) => img.file) || [];
        const videoFiles = data.videos?.map((vid: any) => vid.file) || [];
        const allFiles = [...imageFiles, ...videoFiles];
  
        let uploadedMedia = [];
  
        // 2. ატვირთვა Cloudinary-ზე
        if (allFiles.length > 0) {
          const uploadPromises = allFiles.map((file) =>
            storageService.uploadFile(file, "groupPosts"),
          );
          uploadedMedia = await Promise.all(uploadPromises);
        }
  
        // 3. ბექენდზე გაგზავნა
        const payload = {
          content: data.content,
          media: uploadedMedia,
        };
  
        await groupsService.createGroupPost(groupId, payload);

        reset();
        refresh();
      } catch (e) {
        console.error("Upload error:", e);
      } finally {
        setIsSubmitting(false);
      }
    };

  const { ref, ...contentRegister } = register("content");

  return (
    <div className="w-full mb-8 relative">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative flex items-end gap-2 bg-[#1c1917] border border-stone-800 p-2 min-h-[54px] shadow-2xl group transition-all focus-within:border-stone-700"
      >
        {/* Tech Accents (Corner Dots) */}
        <div className="absolute -top-px -left-px w-1 h-1 bg-amber-500/50" />
        <div className="absolute -bottom-px -right-px w-1 h-1 bg-amber-500/50" />

        {/* Status Indicator Area */}
        <div className="flex items-center justify-center px-1 mb-1.5 border-r border-stone-800/50">
          <Terminal
            size={14}
            className={`${isSubmitting ? "animate-pulse text-amber-500" : "text-stone-700 group-focus-within:text-amber-600"} transition-colors`}
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
          placeholder="INITIALIZE_BROADCAST..."
          className="flex-1 bg-transparent border-none outline-none font-mono text-sm text-stone-200 placeholder:text-stone-800 px-2 py-1.5 resize-none overflow-hidden min-h-[24px] max-h-[300px]"
          disabled={isSubmitting}
        />

        {/* Action Controls */}
        <div className="flex items-center gap-1 mb-0.5">
          <Controller
            name="media"
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
                  className="relative p-2 text-stone-700 hover:text-amber-500 hover:bg-stone-900/50 transition-all rounded group/icon"
                >
                  <ImageIcon size={16} />
                  {media?.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-600 text-[8px] text-white flex items-center justify-center font-bold rounded-sm border border-[#1c1917]">
                      {media.length}
                    </span>
                  )}
                </button>
              </FileUploader>
            )}
          />

          {/* Submit Button (Slanted style) */}
          <button
            type="submit"
            disabled={isSubmitting || !content?.trim()}
            className="ml-2 h-9 px-5 bg-amber-600 hover:bg-amber-500 disabled:bg-stone-900 disabled:text-stone-800 text-stone-950 font-black text-[10px] tracking-widest uppercase transition-all flex items-center gap-2"
            style={{
              clipPath: "polygon(10% 0, 100% 0, 100% 100%, 0 100%)",
            }}
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

      {/* Visual Feedback for Errors */}
      {errors.content && (
        <span className="absolute -bottom-5 left-0 font-mono text-[8px] text-red-900 uppercase tracking-widest">
          Error: {errors.content.message}
        </span>
      )}
    </div>
  );
}
