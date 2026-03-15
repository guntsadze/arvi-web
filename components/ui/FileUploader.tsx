"use client";

import { useState, useRef, ReactNode } from "react";
import { Loader2, X } from "lucide-react";
import Image from "next/image";

export interface UploadedFile {
  id: string;
  file: File;
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
  children?: ReactNode;
  showPreview?: boolean;
}

export default function FileUploader({
  accept = "image/*,video/*",
  multiple = false,
  maxFiles = 5,
  maxSizeMB = 10,
  onFilesChange,
  className = "",
  children,
  showPreview = true,
}: FileUploaderProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    setLoading(true);
    const newFiles: UploadedFile[] = [];

    for (const file of Array.from(selectedFiles)) {
      if (files.length + newFiles.length >= maxFiles) break;
      if (file.size > maxSizeMB * 1024 * 1024) continue;

      newFiles.push({
        id: Math.random().toString(36).substring(7),
        file,
        preview: URL.createObjectURL(file),
        type: file.type.startsWith("video/") ? "video" : "image",
      });
    }

    const updated = multiple ? [...files, ...newFiles] : newFiles;
    setFiles(updated);
    onFilesChange?.(updated);
    setLoading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (id: string) => {
    const updated = files.filter((f) => f.id !== id);
    setFiles(updated);
    onFilesChange?.(updated);
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

      <div
        onClick={() => !loading && fileInputRef.current?.click()}
        className="cursor-pointer"
      >
        {loading ? <Loader2 className="animate-spin" /> : children}
      </div>

      {showPreview && files.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {files.map((file) => (
            <div key={file.id} className="relative w-16 h-16 group">
              <Image
                src={file.preview}
                alt={file.file.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="w-full h-full object-cover rounded border"
              />
              <button
                type="button"
                onClick={() => removeFile(file.id)}
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
