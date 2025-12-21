"use client";

import { useState, useRef } from "react";
import { Camera, Loader2, Trash2 } from "lucide-react";
import { usersService } from "@/services/user/user.service";
import { useRouter } from "next/navigation";

interface Props {
  userId: string;
  type: "avatar" | "cover";
}

export default function ImageUploader({ userId, type }: Props) {
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

      if (type === "avatar") {
        await usersService.uploadAvatar(userId, { file: fileBase64 });
      } else {
        await usersService.uploadCover(userId, { file: fileBase64 });
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
    if (!confirm("დარწმუნებული ხარ, რომ გინდა სურათის წაშლა?")) return;

    setDeleting(true);
    try {
      if (type === "avatar") {
        await usersService.deleteAvatar(userId);
      } else {
        await usersService.deleteCover(userId);
      }
      router.refresh();
    } catch (error) {
      console.error("Delete failed", error);
      alert("წაშლა ვერ მოხერხდა");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex gap-2">
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
        className="flex items-center justify-center p-2 bg-orange-500 hover:bg-orange-600 text-black rounded-lg transition-all shadow-lg disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Camera size={20} />
        )}
      </button>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="flex items-center justify-center p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all shadow-lg disabled:opacity-50"
      >
        {deleting ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Trash2 size={20} />
        )}
      </button>
    </div>
  );
}
