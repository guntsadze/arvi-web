"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, Terminal, AlertCircle, Video, ImageIcon } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import FileUploader from "../ui/FileUploader";
import { postsService } from "@/services/posts/posts.service";

const createPostSchema = z
  .object({
    content: z
      .string()
      .min(1, "პოსტის ტექსტი სავალდებულოა")
      .max(5000, "პოსტი ძალიან გრძელია (მაქს 5000 სიმბოლო)"),

    carId: z.string().optional(),

    images: z
      .array(
        z.object({
          id: z.string(),
          base64: z.string(),
          preview: z.string(),
          type: z.literal("image"),
        })
      )
      .max(5, "მაქსიმუმ 5 სურათის ატვირთვაა შესაძლებელი")
      .optional()
      .default([]),

    videos: z
      .array(
        z.object({
          id: z.string(),
          base64: z.string(),
          preview: z.string(),
          type: z.literal("video"),
        })
      )
      .max(3, "მაქსიმუმ 3 ვიდეოს ატვირთვაა შესაძლებელი")
      .optional()
      .default([]),
  })
  .refine(
    (data) => {
      return (
        data.content.trim().length > 0 ||
        (data.images && data.images.length > 0) ||
        (data.videos && data.videos.length > 0)
      );
    },
    {
      message: "პოსტი ცარიელია - დაამატე ტექსტი ან მედია ფაილები",
      path: ["content"],
    }
  );

type CreatePostFormData = z.infer<typeof createPostSchema>;

export function PostForm({ refresh }: { refresh: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      content: "",
      images: [],
      videos: [],
      carId: undefined,
    },
    mode: "onChange",
  });

  // Watch form values
  const content = watch("content");
  const images = watch("images");
  const videos = watch("videos");

  const onSubmit = async (data: CreatePostFormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        content: data.content,
        carId: data.carId,
        images: data.images?.map((i) => i.base64),
        videos: data.videos?.map((v) => v.base64),
      };

      await postsService.createPost(payload);

      reset();
      refresh();
    } catch (error) {
      alert("პოსტის შექმნა ვერ მოხერხდა");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate if form has content
  const hasContent =
    content?.trim().length > 0 ||
    (images && images.length > 0) ||
    (videos && videos.length > 0);

  return (
    <div className="relative mb-12 group">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-amber-900/10 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />

      <div className="relative bg-[#201d1b] border border-stone-800 p-1">
        {/* Tech Corners */}
        <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-amber-600/50 group-focus-within:border-amber-500 transition-colors" />
        <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-amber-600/50 group-focus-within:border-amber-500 transition-colors" />
        <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-amber-600/50 group-focus-within:border-amber-500 transition-colors" />
        <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-amber-600/50 group-focus-within:border-amber-500 transition-colors" />

        <div className="bg-[#1c1917] p-5 relative overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4 pb-2 border-b border-stone-800/50">
            <div className="p-1.5 bg-stone-900 border border-stone-700">
              <Terminal size={14} className="text-amber-600" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-stone-500 group-focus-within:text-amber-600 transition-colors">
              // New_Log_Entry
            </span>
            <div className="flex-1 h-px bg-stone-800" />
          </div>

          {/* Content Textarea */}
          <div className="mb-4">
            <textarea
              {...register("content")}
              placeholder="Initialize status update..."
              className={`w-full min-h-[100px] bg-transparent resize-none font-mono text-sm text-[#EBE9E1] placeholder:text-stone-600 outline-none ${
                errors.content ? "border border-red-500/50 rounded p-2" : ""
              }`}
              disabled={isSubmitting}
            />

            {/* Error Message */}
            {errors.content && (
              <div className="flex items-center gap-2 mt-2 text-red-400 text-xs font-mono">
                <AlertCircle size={14} />
                <span>{errors.content.message}</span>
              </div>
            )}

            {/* Character Counter */}
            <div className="text-right mt-1">
              <span
                className={`text-[10px] font-mono ${
                  (content?.length || 0) > 4500
                    ? "text-red-400"
                    : "text-stone-600"
                }`}
              >
                {content?.length || 0} / 5000
              </span>
            </div>
          </div>

          {/* File Uploaders with Controller */}
          <div className="flex gap-2">
            {/* IMAGE BUTTON */}
            <Controller
              name="images"
              control={control}
              render={({ field }) => (
                <FileUploader
                  accept="image/*"
                  multiple
                  onFilesChange={field.onChange}
                  showPreview={true}
                >
                  <button
                    type="button"
                    className="flex items-center gap-2 px-3 py-1.5 bg-stone-900 border border-stone-700 hover:border-amber-600 text-[10px] font-mono uppercase text-stone-500 hover:text-amber-500 transition-all"
                  >
                    <ImageIcon size={12} /> IMG
                  </button>
                </FileUploader>
              )}
            />

            {/* VIDEO BUTTON */}
            <Controller
              name="videos"
              control={control}
              render={({ field }) => (
                <FileUploader
                  accept="video/*"
                  multiple
                  onFilesChange={field.onChange}
                  showPreview={true}
                >
                  <button
                    type="button"
                    className="flex items-center gap-2 px-3 py-1.5 bg-stone-900 border border-stone-700 hover:border-amber-600 text-[10px] font-mono uppercase text-stone-500 hover:text-amber-500 transition-all"
                  >
                    <Video size={12} /> VID
                  </button>
                </FileUploader>
              )}
            />
          </div>

          {/* Footer - Submit Section */}
          <div className="flex items-center justify-between pt-4 border-t border-stone-800 border-dashed">
            {/* Status Indicators */}
            <div className="flex items-center gap-3">
              {images && images.length > 0 && (
                <span className="text-[10px] font-mono text-amber-500 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/30">
                  📸 {images.length} IMG
                </span>
              )}
              {videos && videos.length > 0 && (
                <span className="text-[10px] font-mono text-amber-500 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/30">
                  🎥 {videos.length} VID
                </span>
              )}
              {!hasContent && isDirty && (
                <span className="text-[10px] font-mono text-red-400">
                  ⚠ Empty post
                </span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={!hasContent || isSubmitting || !isDirty}
              className="flex items-center gap-2 px-6 py-2 bg-amber-700 text-stone-900 font-black uppercase text-xs tracking-widest hover:bg-amber-600 disabled:opacity-30 disabled:hover:bg-amber-700 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(180,83,9,0.3)] hover:shadow-[0_0_20px_rgba(245,158,11,0.5)] clip-path-slant"
            >
              {isSubmitting ? "UPLOADING..." : "COMMIT LOG"} <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
