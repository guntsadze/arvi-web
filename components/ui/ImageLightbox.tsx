"use client";

import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, Trash2, Loader2, ZoomIn, Download } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { usersService } from "@/services/user/user.service";
import { groupsService } from "@/services/groups.service";
import FileUploader, { UploadedFile } from "../ui/FileUploader";

interface ImageLightboxProps {
  src: string | null;
  alt?: string;
  isOpen: boolean;
  onClose: () => void;
  // edit props — optional, მხოლოდ owner-ს გადაეცემა
  editable?: boolean;
  id?: string;
  type?: "avatar" | "cover";
  context?: "user" | "group";
}

export const ImageLightbox = ({
  src,
  alt = "Image",
  isOpen,
  onClose,
  editable = false,
  id,
  type,
  context,
}: ImageLightboxProps) => {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const router = useRouter();

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });

  const handleUpload = async (files: UploadedFile[]) => {
    if (!files.length || !id || !type || !context) return;
    setUploading(true);
    try {
      const base64 = await fileToBase64(files[0].file);
      if (context === "user") {
        await usersService.uploadMedia(id, type, { file: base64 });
      } else {
        await groupsService.uploadMedia(id, type, { file: base64 });
      }
      router.refresh();
      onClose();
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !type || !context) return;
    setDeleting(true);
    try {
      if (context === "user") {
        await usersService.deleteUserMedia(id, type);
      } else {
        await groupsService.deleteMedia(id, type);
      }
      router.refresh();
      onClose();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const handleDownload = () => {
    if (!src) return;
    const a = document.createElement("a");
    a.href = src;
    a.download = alt;
    a.target = "_blank";
    a.click();
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex flex-col">
          {/* ── BACKDROP ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/95 backdrop-blur-md"
          />

          {/* ── TOP BAR ── */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ delay: 0.05 }}
            className="relative z-10 flex items-center justify-between px-5 py-3 border-b border-white/5"
          >
            {/* Label */}
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-orange-500 animate-pulse" />
              <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-stone-500">
                {type ? `${type}_preview` : "preview"}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Download */}
              {src && (
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-stone-800 text-stone-500 hover:text-stone-200 hover:border-stone-600 transition-all font-mono text-[9px] uppercase tracking-wider"
                >
                  <Download size={11} />
                  Save
                </button>
              )}

              {/* Close */}
              <button
                onClick={onClose}
                className="p-2 border border-stone-800 text-stone-500 hover:text-white hover:border-stone-600 transition-all"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>

          {/* ── IMAGE ── */}
          <div className="relative flex-1 flex items-center justify-center p-6 z-10">
            {src ? (
              <motion.img
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ type: "spring", damping: 26, stiffness: 280 }}
                src={src}
                alt={alt}
                className={`max-h-full max-w-full object-contain shadow-2xl ${
                  type === "avatar"
                    ? "rounded-xl max-h-[70vh] max-w-[70vw]"
                    : "rounded-lg max-h-[75vh] max-w-full w-full"
                }`}
                style={{ boxShadow: "0 0 80px rgba(0,0,0,0.8)" }}
              />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-40 h-40 border-2 border-dashed border-stone-800 flex items-center justify-center"
              >
                <ZoomIn size={32} className="text-stone-700" />
              </motion.div>
            )}
          </div>

          {/* ── BOTTOM EDIT BAR (owner only) ── */}
          {editable && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ delay: 0.08 }}
              className="relative z-10 border-t border-white/5 bg-black/40 backdrop-blur-sm"
            >
              <div className="max-w-lg mx-auto px-5 py-4">
                <AnimatePresence mode="wait">
                  {/* ── NORMAL STATE ── */}
                  {!confirmDelete && (
                    <motion.div
                      key="normal"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-3"
                    >
                      {/* Upload new */}
                      <FileUploader
                        accept="image/*"
                        multiple={false}
                        showPreview={false}
                        onFilesChange={handleUpload}
                      >
                        <button
                          disabled={uploading}
                          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-orange-500/10 border border-orange-500/40 hover:bg-orange-500 text-orange-400 hover:text-black font-mono text-[10px] uppercase tracking-wider transition-all group disabled:opacity-50"
                        >
                          {uploading ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <Camera
                              size={13}
                              className="group-hover:scale-110 transition-transform"
                            />
                          )}
                          {uploading ? "Uploading..." : `Change ${type}`}
                        </button>
                      </FileUploader>

                      {/* Delete trigger */}
                      {src && (
                        <button
                          onClick={() => setConfirmDelete(true)}
                          className="flex items-center gap-2 px-4 py-3 border border-red-900/40 text-red-700 hover:border-red-700/60 hover:text-red-500 font-mono text-[10px] uppercase tracking-wider transition-all"
                        >
                          <Trash2 size={13} />
                          Remove
                        </button>
                      )}
                    </motion.div>
                  )}

                  {/* ── CONFIRM DELETE STATE ── */}
                  {confirmDelete && (
                    <motion.div
                      key="confirm"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="flex items-center gap-3"
                    >
                      <div className="flex-1 flex items-center gap-2 px-3 py-2 border border-red-900/40 bg-red-950/20">
                        <div className="w-1.5 h-1.5 bg-red-500" />
                        <span className="text-[9px] font-mono text-red-400 uppercase tracking-wider">
                          Permanently remove this {type}?
                        </span>
                      </div>
                      <button
                        onClick={() => setConfirmDelete(false)}
                        className="px-4 py-2.5 border border-stone-700 text-stone-500 hover:text-stone-200 font-mono text-[9px] uppercase tracking-wider transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="flex items-center gap-2 px-4 py-2.5 bg-red-900/40 border border-red-700/50 hover:bg-red-700 text-red-400 hover:text-white font-mono text-[9px] uppercase tracking-wider transition-all disabled:opacity-60"
                      >
                        {deleting ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <Trash2 size={12} />
                        )}
                        {deleting ? "Removing..." : "Confirm"}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
};
