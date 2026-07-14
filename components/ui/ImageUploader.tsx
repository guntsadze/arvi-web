"use client";

import { useState } from "react";
import { Camera, Loader2, Trash2, RefreshCcw } from "lucide-react";
import { usersService } from "@/services/user/user.service";
import { useRouter } from "next/navigation";
import FileUploader, { UploadedFile } from "../ui/FileUploader";
import { groupsService } from "@/services/groups.service";

interface Props {
  id: string;
  type: "avatar" | "cover";
  context: "user" | "group";
}

export default function ImageUploader({ id, type, context }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpload = async (files: UploadedFile[]) => {
    if (files.length === 0) return;

    const fileToUpload = files[0].file;
    setLoading(true);

    try {
      // 1. ფაილის კონვერტაცია Base64-ში (რადგან ბექენდი Buffer/String-ს ელოდება)
      const base64 = await fileToBase64(fileToUpload);

      // 2. სერვისის გამოძახება კონტექსტის მიხედვით
      if (context === "user") {
        if (type === "cover") {
          await usersService.uploadMedia(id, "cover", { file: base64 });
        } else {
          await usersService.uploadMedia(id, "avatar", { file: base64 });
        }
      } else {
        if (type === "cover") {
          await groupsService.uploadMedia(id, "cover", { file: base64 });
        }
        if (type === "avatar") {
          await groupsService.uploadMedia(id, "avatar", { file: base64 });
        }
      }

      router.refresh();
    } catch (error) {
      console.error("Upload Error:", error);
      alert("ფოტოს განახლება ვერ მოხერხდა");
    } finally {
      setLoading(false);
    }
  };

  // დამხმარე ფუნქცია ფაილის წასაკითხად
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleDelete = async () => {
    if (!confirm("დარწმუნებული ხარ, რომ გინდა სურათის წაშლა?")) return;

    if (context === "user") {
      if (type === "avatar") {
        await usersService.deleteUserMedia(id, "avatar");
      } else {
        await usersService.deleteUserMedia(id, "cover");
      }
    } else {
      if (type === "cover") {
        await groupsService.deleteMedia(id, "cover");
      }
      if (type === "avatar") {
        await groupsService.deleteMedia(id, "avatar");
      }
    }

    try {
      router.refresh();
    } catch (error) {
      console.error("Delete failed", error);
      alert("წაშლა ვერ მოხერხდა");
    } finally {
    }
  };

  return (
    <div className="flex items-center gap-2">
      <FileUploader
        accept="image/*"
        multiple={false}
        showPreview={false} // ვთიშავთ FileUploader-ის შიდა პრევიუს
        onFilesChange={handleUpload} // ფაილის არჩევისთანავე იწყება ატვირთვა
      >
        <button
          disabled={loading}
          className="group relative flex items-center gap-2 px-3 py-1.5 bg-black/50 hover:bg-primary-hover backdrop-blur-md border border-white/10 text-white text-[10px] font-mono uppercase tracking-widest transition-all disabled:opacity-50"
        >
          {loading ? (
            <Loader2 size={12} className="animate-spin text-accent" />
          ) : (
            <Camera
              size={12}
              className="group-hover:scale-110 transition-transform"
            />
          )}
          <span>{loading ? "Syncing..." : `Update ${type}`}</span>
        </button>
      </FileUploader>

      <button
        onClick={handleDelete}
        className="p-1.5 bg-error/10/40 hover:bg-error border border-error/20 text-error hover:text-white transition-colors"
      >
        <Trash2 size={12} />
      </button>
    </div>
  );
}
