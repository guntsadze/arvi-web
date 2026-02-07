"use client";

import { useState, useRef, ReactNode } from "react";
import { Loader2, X, Camera } from "lucide-react";

export interface UploadedFile {
  id: string;
  file: File;
  base64: string;
  preview: string;
  type: "image" | "video";
}

interface FileUploaderProps {
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSizeMB?: number;
  onFilesChange?: (files: UploadedFile[]) => void;
  className?: string;
  buttonText?: string;
  showPreview?: boolean;
  variant?: "button" | "dropzone";
  children?: ReactNode; // საშუალებას გვაძლევს გარედან ჩავსვათ ღილაკი
}

export default function FileUploader({
  accept = "image/*",
  multiple = false,
  maxFiles = 5,
  maxSizeMB = 10,
  onFilesChange,
  className = "",
  buttonText = "Upload File",
  showPreview = true,
  variant = "button",
  children,
}: FileUploaderProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File): Promise<UploadedFile | null> => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`ფაილი ძალიან დიდია! მაქსიმუმ ${maxSizeMB}MB`);
      return null;
    }

    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
    });

    const isVideo = file.type.startsWith("video/");

    return {
      id: Math.random().toString(36).substr(2, 9),
      file,
      base64,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith("video/") ? "video" : "image",
    };
  };

  const handleFileChange = async (selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    setLoading(true);
    try {
      const newFiles: UploadedFile[] = [];
      for (let i = 0; i < selectedFiles.length; i++) {
        if (files.length + newFiles.length >= maxFiles) {
          alert(`მაქსიმუმ ${maxFiles} ფაილი`);
          break;
        }
        const processed = await processFile(selectedFiles[i]);
        if (processed) newFiles.push(processed);
      }

      const updatedFiles = multiple ? [...files, ...newFiles] : newFiles;
      setFiles(updatedFiles);
      onFilesChange?.(updatedFiles);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const removeFile = (id: string) => {
    const updatedFiles = files.filter((f) => f.id !== id);
    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
  };

  return (
    <div className={className}>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept={accept}
        multiple={multiple}
        onChange={(e) => handleFileChange(e.target.files)}
      />

      {/* თუ გვაქვს ჩილდრენი (ჩვენი IMG/VID ღილაკები), ვიყენებთ მათ */}
      <div
        onClick={() => !loading && fileInputRef.current?.click()}
        className={
          loading ? "opacity-50 pointer-events-none" : "cursor-pointer"
        }
      >
        {children || (
          <button
            type="button"
            className="px-4 py-2 bg-amber-600 text-black font-bold rounded"
          >
            {loading ? <Loader2 className="animate-spin" /> : buttonText}
          </button>
        )}
      </div>

      {/* Previews - გამოჩნდება ღილაკების ქვემოთ */}
      {showPreview && files.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {files.map((file) => (
            <div key={file.id} className="relative w-16 h-16 group">
              {file.type === "image" ? (
                <img
                  src={file.preview}
                  className="w-full h-full object-cover rounded border border-stone-700"
                />
              ) : (
                <div className="w-full h-full bg-stone-800 flex items-center justify-center rounded border border-stone-700 text-[8px]">
                  VIDEO
                </div>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(file.id);
                }}
                className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
