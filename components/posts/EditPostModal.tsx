"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { ImageIcon, X, Save, AlertCircle } from "lucide-react";
import FileUploader from "../ui/FileUploader";

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

  const { register, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: {
      content: post.content,
      images: post.images || [],
    },
  });

  const currentImages = watch("images");

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      reset({ content: post.content, images: post.images || [] });
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, post, reset]);

  if (!mounted || !isOpen) return null;

  const handleRemoveImage = (indexToRemove: number) => {
    setValue(
      "images",
      currentImages.filter((_: any, i: number) => i !== indexToRemove)
    );
  };

  const onSubmit = async (data: any) => {
    await onSave(data);
    onClose();
  };

  // Portal Content
  const modalContent = (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-[#1c1917] border border-stone-800 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-[#25211f]">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-amber-600 animate-pulse" />
              <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-stone-300">
                Edit Protocol:{" "}
                <span className="text-amber-600">
                  ID_{post.id.toString().slice(-4)}
                </span>
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-stone-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Text Area Container */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-stone-500 uppercase tracking-widest">
                Post Content
              </label>
              <textarea
                {...register("content")}
                rows={6}
                className="w-full bg-stone-900/50 border border-stone-800 p-4 font-mono text-sm text-[#EBE9E1] focus:outline-none focus:border-amber-600/50 transition-colors resize-none"
                placeholder="Enter log data..."
              />
            </div>

            {/* Media Management */}
            <div className="space-y-3">
              <label className="text-[10px] font-mono text-stone-500 uppercase tracking-widest flex justify-between">
                Attached Media <span>{currentImages.length} Units</span>
              </label>

              <div className="grid grid-cols-4 gap-3 bg-stone-900/30 p-3 border border-dashed border-stone-800 min-h-[100px]">
                {currentImages.map((img: string, index: number) => (
                  <div
                    key={index}
                    className="relative aspect-square group border border-stone-700"
                  >
                    <img
                      src={img}
                      alt="preview"
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-red-900 text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}

                <FileUploader
                  accept="image/*"
                  multiple
                  onFilesChange={(files) => {
                    const newBase64s = files.map((f) => f.base64);
                    setValue("images", [...currentImages, ...newBase64s]);
                  }}
                  showPreview={false}
                >
                  <button
                    type="button"
                    className="w-full h-full flex flex-col items-center justify-center gap-2 border border-dashed border-stone-700 hover:bg-stone-800 text-stone-500 transition-all aspect-square"
                  >
                    <ImageIcon size={20} />
                    <span className="text-[8px] uppercase">Add</span>
                  </button>
                </FileUploader>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-stone-800/50">
              <div className="flex items-center gap-2 text-stone-600">
                <AlertCircle size={14} />
                <span className="text-[9px] font-mono uppercase">
                  Changes will be permanent
                </span>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-[10px] font-mono uppercase text-stone-500 hover:text-white transition-colors"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2 bg-amber-700 text-stone-900 text-[10px] font-bold uppercase tracking-wider hover:bg-amber-600 transition-all"
                >
                  <Save size={14} />
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
