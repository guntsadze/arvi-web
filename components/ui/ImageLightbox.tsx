"use client";

import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Camera,
  Trash2,
  Loader2,
  Maximize2,
  Download,
  ShieldCheck,
  Cpu,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usersService } from "@/services/user/user.service";
import { groupsService } from "@/services/groups.service";
import FileUploader, { UploadedFile } from "../ui/FileUploader";
import Image from "next/image";

interface ImageLightboxProps {
  src: string | null;
  alt?: string;
  isOpen: boolean;
  onClose: () => void;
  editable?: boolean;
  id?: string;
  type?: "avatar" | "cover";
  context?: "user" | "group";
}

export const ImageLightbox = ({
  src,
  alt = "IMAGE",
  isOpen,
  onClose,
  editable = false,
  id,
  type,
  context,
}: ImageLightboxProps) => {
  console.log("🚀 ~ ImageLightbox ~ src:", src);
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

  // Keyboard support for closing
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex flex-col font-mono overflow-hidden">
          {/* ── BACKDROP ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/95 backdrop-blur-xl"
          />

          {/* ── SCANLINE EFFECT ── */}
          <div className="absolute inset-0 pointer-events-none z-10 opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

          {/* ── HEADER ── */}
          <motion.header
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            className="relative z-20 flex items-center justify-between px-6 py-4 border-b border-border bg-black/40"
          >
            <div className="flex items-center gap-4">
              {/* <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <Cpu size={12} className="text-accent" />
                  <span className="text-[10px] text-accent font-black tracking-[0.3em] uppercase">
                    Visual_Buffer_v2.0
                  </span>
                </div>
                <span className="text-[8px] text-text-secondary mt-1 uppercase tracking-tighter">
                  ID: {id?.slice(0, 12)}... // Status: ESTABLISHED
                </span>
              </div> */}
            </div>

            <div className="flex items-center gap-3">
              {src && (
                <button
                  onClick={() => window.open(src, "_blank")}
                  className="hidden md:flex items-center gap-2 px-3 py-1.5 border border-border text-text-secondary hover:text-accent hover:border-accent/50 transition-all text-[9px] uppercase tracking-widest"
                >
                  <Download size={12} />
                  სურათის ჩამოტვირთვა
                </button>
              )}
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center border border-border text-text-secondary hover:bg-error/10 hover:text-error hover:border-error/50 transition-all group"
              >
                <X size={20} className="group-rotate-90 transition-transform" />
              </button>
            </div>
          </motion.header>

          {/* ── VIEWPORT ── */}
          <div className="relative flex-1 flex items-center justify-center p-4 md:p-12 z-20">
            {/* Corner Brackets */}
            <div className="absolute inset-10 pointer-events-none opacity-20 border-l border-t border-border w-20 h-20" />
            <div className="absolute top-10 right-10 pointer-events-none opacity-20 border-r border-t border-border w-20 h-20" />
            <div className="absolute bottom-10 left-10 pointer-events-none opacity-20 border-l border-b border-border w-20 h-20" />
            <div className="absolute bottom-10 right-10 pointer-events-none opacity-20 border-r border-b border-border w-20 h-20" />

            <div className="relative group">
              {src ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", damping: 20 }}
                  className={`relative p-1 bg-surface-1 border border-border shadow-[0_0_50px_rgba(0,0,0,0.5)] 
                  ${
                    type === "avatar"
                      ? "w-[300px] h-[300px] md:w-[500px] md:h-[500px]"
                      : "w-[90vw] h-[50vh] md:h-[70vh] max-w-5xl"
                  }`}
                >
                  <Image
                    src={src}
                    alt={alt}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 80vw"
                    className="object-contain"
                  />

                  {/* <div className="absolute -bottom-6 left-0 right-0 flex justify-between px-2 text-[8px] text-text-secondary uppercase">
                    <span>Type: {type || "unknown"}</span>
                    <span>Source: Encrypted_Node</span>
                  </div> */}
                </motion.div>
              ) : (
                <div className="w-64 h-64 border-2 border-dashed border-border flex flex-col items-center justify-center gap-4 text-text-secondary">
                  <Maximize2 size={40} className="animate-pulse" />
                  <span className="text-[10px] tracking-widest">
                    ინფორმაცია არ არის
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ── FOOTER / CONTROLS ── */}
          {editable && (
            <motion.footer
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              className="relative z-30 p-6 bg-background/80 border-t border-border backdrop-blur-md"
            >
              <div className="max-w-2xl mx-auto">
                <AnimatePresence mode="wait">
                  {!confirmDelete ? (
                    <motion.div
                      key="actions"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col md:flex-row gap-4"
                    >
                      <FileUploader
                        accept="image/*"
                        multiple={false}
                        showPreview={false}
                        onFilesChange={handleUpload}
                      >
                        <button
                          disabled={uploading}
                          className="w-full md:w-auto flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-accent/5 border border-accent/20 text-accent hover:bg-primary-hover hover:text-black transition-all group disabled:opacity-50"
                        >
                          {uploading ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Camera
                              size={16}
                              className="group-hover:scale-110 transition-transform"
                            />
                          )}
                          <span className="text-[11px] font-black uppercase tracking-[0.2em]">
                            {uploading ? "რედაქტირება..." : `რედაქტირება`}
                          </span>
                        </button>
                      </FileUploader>

                      {src && (
                        <button
                          onClick={() => setConfirmDelete(true)}
                          className="flex items-center justify-center gap-3 px-6 py-4 border border-error/30 text-error hover:border-error hover:text-error transition-all"
                        >
                          <Trash2 size={16} />
                          <span className="text-[11px] font-black uppercase tracking-[0.2em]">
                            წაშლა
                          </span>
                        </button>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="confirm"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col md:flex-row items-center gap-4 p-4 border border-error/20 bg-error/5"
                    >
                      <div className="flex-1 flex items-center gap-3">
                        <div className="w-2 h-2 bg-error animate-ping" />
                        <span className="text-[10px] text-error font-bold uppercase tracking-widest">
                          ყურადღება: ფოტოსურათი წაიშლება!
                        </span>
                      </div>
                      <div className="flex gap-2 w-full md:w-auto">
                        <button
                          onClick={() => setConfirmDelete(false)}
                          className="flex-1 md:flex-none px-6 py-2 border border-border text-text-secondary hover:text-text-secondary transition-all text-[10px] uppercase"
                        >
                          გაუქმება
                        </button>
                        <button
                          onClick={handleDelete}
                          disabled={deleting}
                          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-error text-white hover:bg-error transition-all text-[10px] font-bold uppercase"
                        >
                          {deleting ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <Trash2 size={12} />
                          )}
                          სურათის წაშლა
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.footer>
          )}
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
};
