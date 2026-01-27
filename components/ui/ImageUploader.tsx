"use client";

import { useState, useRef } from "react";
import { Camera, Loader2, Trash2 } from "lucide-react";
import { usersService } from "@/services/user/user.service";
import { useRouter } from "next/navigation";
import { groupsService } from "@/services/groups.service";

interface Props {
  id: string;
  type: "avatar" | "cover";
  context: "user" | "group";
}

export default function ImageUploader({ id, type, context }: Props) {
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const fileBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (err) => reject(err);
      });

      if (context === "user") {
        if (type === "avatar")
          await usersService.uploadAvatar(id, { file: fileBase64 });
        else await usersService.uploadCover(id, { file: fileBase64 });
      } else {
        // ჯგუფის შემთხვევაში ვიყენებთ ჩვენს ახალ სერვისს
        await groupsService.uploadMedia(id, type, { file: fileBase64 });
      }

      router.refresh();
    } catch (error) {
      console.error("Upload failed", error);
      alert("ატვირთვა ვერ მოხერხდა");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("დარწმუნებული ხარ?")) return;
    setDeleting(true);
    try {
      if (context === "user") {
        if (type === "avatar") await usersService.deleteAvatar(id);
        else await usersService.deleteCover(id);
      } else {
        await groupsService.deleteMedia(id, type);
      }
      router.refresh();
    } catch (error) {
      alert("წაშლა ვერ მოხერხდა");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex gap-1">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
        className="p-1.5 bg-amber-600/20 hover:bg-amber-600/40 text-amber-500 border border-amber-600/30 transition-all disabled:opacity-50"
      >
        {loading ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Camera size={14} />
        )}
      </button>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="p-1.5 bg-red-900/20 hover:bg-red-900/40 text-red-500 border border-red-900/30 transition-all disabled:opacity-50"
      >
        {deleting ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Trash2 size={14} />
        )}
      </button>
    </div>
  );
}
