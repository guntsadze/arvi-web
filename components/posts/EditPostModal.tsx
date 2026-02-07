"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useForm, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { ImageIcon, X, Save, AlertCircle, Loader2 } from "lucide-react";
import FileUploader from "../ui/FileUploader";
import { storageService } from "@/services/storage.service";

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
  const [isUploading, setIsUploading] = useState(false);

  const { register, handleSubmit, watch, setValue, reset, control } = useForm({
    defaultValues: {
      content: "",
      media: [] as any[],
    },
  });

  const currentMedia = watch("media");

  useEffect(() => {
    setMounted(true);
    if (isOpen && post) {
      reset({
        content: post.content,
        media: post.media || [],
      });
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, post, reset]);

  if (!mounted || !isOpen) return null;

  const handleRemoveMedia = (indexToRemove: number) => {
    setValue(
      "media",
      currentMedia.filter((_, i) => i !== indexToRemove),
    );
  };

  const onSubmit = async (data: any) => {
    setIsUploading(true);
    try {
      const existingMedia = data.media.filter((m: any) => !m.file);
      const newFiles = data.media
        .filter((m: any) => m.file)
        .map((m: any) => m.file);

      let newlyUploadedMedia = [];
      if (newFiles.length > 0) {
        const uploadPromises = newFiles.map((file: File) =>
          storageService.uploadFile(file, "posts"),
        );
        newlyUploadedMedia = await Promise.all(uploadPromises);
      }

      const finalMedia = [...existingMedia, ...newlyUploadedMedia].map(
        (m: any) => ({
          url: m.url,
          publicId: m.publicId ?? m.public_id ?? "",
          mediaType:
            m.mediaType?.toUpperCase() ??
            (m.resource_type === "video" ? "VIDEO" : "IMAGE"),
          bytes: m.bytes ? Number(m.bytes) : 0,
          format: m.format ?? "",
        }),
      );

      const finalPayload = {
        content: data.content,
        media: finalMedia,
      };

      await onSave(finalPayload);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
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
          className="relative w-full max-w-2xl bg-[#1c1917] border border-stone-800 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-[#25211f]">
            <h2 className="text-xs font-mono uppercase tracking-widest text-stone-300">
              Protocol Update:{" "}
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
              className="w-full bg-stone-900/50 border border-stone-800 p-4 font-mono text-sm text-stone-200 focus:border-amber-600/50 outline-none resize-none"
              rows={5}
            />

            <div className="space-y-3">
              <label className="text-[10px] font-mono text-stone-500 uppercase flex justify-between">
                Media Assets <span>{currentMedia.length} Total</span>
              </label>

              <div className="grid grid-cols-4 gap-3 bg-stone-900/30 p-3 border border-stone-800">
                {currentMedia.map((m: any, index: number) => (
                  <div
                    key={index}
                    className="relative aspect-square border border-stone-700 group"
                  >
                    <img
                      src={m.url || m.preview} // m.url ძველისთვის, m.preview ახლისთვის
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                      alt="media"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveMedia(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white p-1 opacity-0 group-hover:opacity-100"
                    >
                      <X size={12} />
                    </button>
                    {m.mediaType === "VIDEO" && (
                      <div className="absolute bottom-1 left-1 bg-black/60 text-[8px] px-1 text-white">
                        VID
                      </div>
                    )}
                  </div>
                ))}

                <Controller
                  name="media"
                  control={control}
                  render={({ field }) => (
                    <FileUploader
                      accept="image/*,video/*"
                      multiple
                      onFilesChange={(newFiles) =>
                        field.onChange([...currentMedia, ...newFiles])
                      }
                      showPreview={false}
                    >
                      <button
                        type="button"
                        className="w-full h-full flex flex-col items-center justify-center gap-2 border border-dashed border-stone-700 hover:bg-stone-800 text-stone-500 aspect-square"
                      >
                        <ImageIcon size={20} />
                        <span className="text-[8px] uppercase">Add Media</span>
                      </button>
                    </FileUploader>
                  )}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-stone-800">
              <div className="flex items-center gap-2 text-stone-600 text-[9px] font-mono uppercase">
                <AlertCircle size={14} /> <span>Cloud Sync Active</span>
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-[10px] font-mono uppercase text-stone-500"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex items-center gap-2 px-6 py-2 bg-amber-600 text-stone-950 text-[10px] font-bold uppercase hover:bg-amber-500 disabled:opacity-50"
                >
                  {isUploading ? (
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
