"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Camera, Loader2, Trash2, X, Layout, UserCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usersService } from "@/services/user/user.service";
import { groupsService } from "@/services/groups.service";
import { useRouter } from "next/navigation";
import FileUploader, { UploadedFile } from "../ui/FileUploader";

interface Props {
  id: string;
  context: "user" | "group";
  currentAvatar?: string | null;
  currentCover?: string | null;
}

export default function MediaEditorModal({
  id,
  context,
  currentAvatar,
  currentCover,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState<{ type: "avatar" | "cover" | null }>({
    type: null,
  });
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleUpload = async (
    files: UploadedFile[],
    type: "avatar" | "cover",
  ) => {
    if (files.length === 0) return;
    const fileToUpload = files[0].file;
    setLoading({ type });

    try {
      const base64 = await fileToBase64(fileToUpload);
      if (context === "user") {
        type === "cover"
          ? await usersService.uploadCover(id, { file: base64 })
          : await usersService.uploadAvatar(id, { file: base64 });
      } else {
        await groupsService.uploadMedia(id, type, { file: base64 });
      }
      router.refresh();
    } catch (error) {
      console.error("Upload Error:", error);
    } finally {
      setLoading({ type: null });
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  if (!mounted) return null;

  const ModalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 font-mono">
          {/* Backdrop - Blur & Darken */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-2xl bg-[#0d0d0d] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            {/* Top Accent Line */}
            <div className="h-1 w-full bg-amber-600/50" />

            {/* Scanline Effect Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-amber-500 animate-pulse" />
                <h3 className="text-white text-xs uppercase tracking-[0.3em]">
                  Appearance_Protocol
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="group flex items-center gap-2 text-[10px] text-gray-500 hover:text-white transition-colors"
              >
                CLOSE [X]
              </button>
            </div>

            <div className="p-8 space-y-10">
              {/* Cover Section */}
              <section className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] text-amber-500/70 uppercase tracking-widest leading-none">
                    // Cover_Module
                  </span>
                  <span className="text-[9px] text-gray-600 tracking-tighter">
                    DIM: 1200x400.SYS
                  </span>
                </div>

                <div className="relative h-40 w-full bg-[#111] border border-white/5 flex items-center justify-center overflow-hidden group">
                  {/* Grid Background */}
                  <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:20px_20px]" />

                  {currentCover ? (
                    <img
                      src={currentCover}
                      className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity"
                      alt="Cover"
                    />
                  ) : (
                    <Layout className="text-white/10" size={40} />
                  )}

                  <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
                    <FileUploader
                      accept="image/*"
                      multiple={false}
                      onFilesChange={(f) => handleUpload(f, "cover")}
                    >
                      <button className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-black text-[10px] font-bold uppercase tracking-widest transition-all">
                        {loading.type === "cover"
                          ? "Syncing..."
                          : "Update_Cover"}
                      </button>
                    </FileUploader>
                    {currentCover && (
                      <button
                        onClick={() => {
                          /* delete logic */
                        }}
                        className="p-2 border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </section>

              {/* Avatar Section */}
              <section className="space-y-4">
                <span className="text-[10px] text-amber-500/70 uppercase tracking-widest block leading-none">
                  // Identity_Core
                </span>
                <div className="flex items-center gap-8 p-4 bg-white/[0.02] border border-white/5">
                  <div className="relative w-28 h-28 shrink-0 border border-amber-500/50 p-1 bg-black shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                    <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center overflow-hidden">
                      {currentAvatar ? (
                        <img
                          src={currentAvatar}
                          className="w-full h-full object-cover"
                          alt="Avatar"
                        />
                      ) : (
                        <UserCircle2 className="text-white/10" size={48} />
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <FileUploader
                      accept="image/*"
                      multiple={false}
                      onFilesChange={(f) => handleUpload(f, "avatar")}
                    >
                      <button className="flex items-center gap-3 px-5 py-2.5 border border-white/10 hover:border-amber-500/50 hover:bg-amber-500/5 text-white text-[10px] uppercase tracking-[0.2em] transition-all group">
                        {loading.type === "avatar" ? (
                          <Loader2
                            size={14}
                            className="animate-spin text-amber-500"
                          />
                        ) : (
                          <Camera
                            size={14}
                            className="group-hover:text-amber-500"
                          />
                        )}
                        Upload_New_Visual
                      </button>
                    </FileUploader>
                    <button className="text-[9px] text-gray-600 hover:text-red-500 uppercase tracking-widest text-left transition-colors">
                      Terminate_Current_Node
                    </button>
                  </div>
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/5 flex justify-between items-center bg-black">
              <div className="text-[8px] text-gray-700 uppercase tracking-[0.3em]">
                System_Status: Optimal
              </div>
              <div className="text-[8px] text-amber-600/40 uppercase font-bold tracking-widest">
                Visual_Editor_v2.0.4
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="group flex items-center gap-2 px-3 py-1.5 bg-black/40 hover:bg-amber-600/10 border border-white/10 hover:border-amber-500/50 text-white text-[10px] font-mono uppercase tracking-widest transition-all"
      >
        <Camera
          size={12}
          className="group-hover:text-amber-500 transition-colors"
        />
        <span>Edit Appearance</span>
      </button>

      {createPortal(ModalContent, document.body)}
    </>
  );
}
