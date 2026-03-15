"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useForm, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { ImageIcon, X, Save, AlertCircle, Loader2, Play } from "lucide-react";
import FileUploader from "../ui/FileUploader";
import { storageService } from "@/services/storage.service";
import Image from "next/image";

interface EditPostModalProps {
  post: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

export function EditPostModal({
  post,
  isOpen,
  onClose,
  onSave,
}: EditPostModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, setValue, reset, control } = useForm({
    defaultValues: { content: "", media: [] as any[] },
  });

  const currentMedia = watch("media");

  useEffect(() => {
    setMounted(true);
    if (isOpen && post) {
      reset({ content: post.content, media: post.media || [] });
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, post, reset]);

  if (!mounted || !isOpen) return null;

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const existingMedia = data.media.filter((m: any) => !m.file);
      const newFiles = data.media.filter((m: any) => m.file);

      let newlyUploaded = [];
      if (newFiles.length > 0) {
        const uploadPromises = newFiles.map((m: any) =>
          storageService.uploadFile(m.file, "posts"),
        );
        const results = await Promise.all(uploadPromises);

        newlyUploaded = results.map((res, i) => ({
          url: res.url,
          publicId: res.public_id || res.publicId,
          bytes: res.bytes || 0,
          format: res.format || "jpg",
          mediaType: newFiles[i].type?.toUpperCase().includes("VIDEO")
            ? "VIDEO"
            : "IMAGE",
        }));
      }

      const finalMedia = [
        ...existingMedia.map((m: any) => ({
          url: m.url,
          publicId: m.publicId,
          mediaType: m.mediaType || "IMAGE",
          bytes: Number(m.bytes) || 0,
          format: m.format || "jpg",
        })),
        ...newlyUploaded,
      ];

      console.log("🔵 existingMedia:", existingMedia);
      console.log("🟢 newFiles:", newFiles);
      console.log("🟡 finalMedia:", finalMedia);

      // ვალიდაცია: თუ რაღაც სასწაულით publicId მაინც undefined-ია, არ გავატაროთ
      const validMedia = finalMedia.filter((m) => m.publicId && m.url);

      await onSave({
        content: data.content,
        media: validMedia,
      });

      onClose();
    } catch (error) {
      console.error("Update error:", error);
      alert("პოსტის განახლება ვერ მოხერხდა");
    } finally {
      setIsSubmitting(false);
    }
  };

  const MediaItem = ({ m, index }: { m: any; index: number }) => {
    const isVid =
      m.mediaType === "VIDEO" || m.type === "video" || m.url?.endsWith(".mp4");

    return (
      <div className="relative aspect-square border border-stone-800 bg-stone-900 group overflow-hidden">
        {isVid ? (
          <video
            src={m.url || m.preview}
            className="w-full h-full object-cover opacity-60"
          />
        ) : (
          <Image
            src={m.url || m.preview}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            alt=""
          />
        )}

        {/* ინდიკატორები */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {isVid && (
            <Play
              size={16}
              className="text-white/50 group-hover:text-white transition-colors"
            />
          )}
        </div>

        <button
          type="button"
          onClick={() =>
            setValue(
              "media",
              currentMedia.filter((_, i) => i !== index),
            )
          }
          className="absolute top-1 right-1 bg-red-600/80 hover:bg-red-600 text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          <X size={12} />
        </button>
      </div>
    );
  };

  const modalContent = (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/90 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl bg-[#1c1917] border border-stone-800 shadow-2xl"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-[#25211f]">
            <h2 className="text-[10px] font-mono uppercase tracking-widest text-stone-400">
              Update Protocol:{" "}
              <span className="text-amber-600">POST_{post.id.slice(-6)}</span>
            </h2>
            <button
              onClick={onClose}
              className="text-stone-500 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <textarea
              {...register("content")}
              className="w-full bg-stone-900/50 border border-stone-800 p-4 font-mono text-sm text-stone-200 focus:border-amber-600/50 outline-none resize-none min-h-[120px]"
            />

            <div className="space-y-3">
              <label className="text-[9px] font-mono text-stone-500 uppercase flex justify-between">
                Media Assets <span>{currentMedia.length} / 10</span>
              </label>

              <div className="grid grid-cols-4 gap-3">
                {currentMedia.map((m, i) => (
                  <MediaItem key={i} m={m} index={i} />
                ))}

                <Controller
                  name="media"
                  control={control}
                  render={({ field }) => (
                    <FileUploader
                      accept="image/*,video/*"
                      multiple
                      showPreview={false}
                      onFilesChange={(newFiles) =>
                        field.onChange([...currentMedia, ...newFiles])
                      }
                    >
                      <button
                        type="button"
                        className="w-full aspect-square flex flex-col items-center justify-center gap-2 border border-dashed border-stone-800 hover:border-stone-600 hover:bg-stone-900/50 text-stone-600 transition-all"
                      >
                        <ImageIcon size={20} />
                        <span className="text-[8px] uppercase">Add Media</span>
                      </button>
                    </FileUploader>
                  )}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-stone-800">
              <div className="flex items-center gap-2 text-stone-600 text-[9px] font-mono uppercase">
                <AlertCircle size={14} />{" "}
                <span>Buffer modification active</span>
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-[10px] font-mono uppercase text-stone-500 hover:text-stone-300"
                >
                  Abort
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2 bg-amber-600 text-stone-950 text-[10px] font-bold uppercase hover:bg-amber-500 disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={14} />
                  ) : (
                    <Save size={14} />
                  )}
                  Execute Update
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
