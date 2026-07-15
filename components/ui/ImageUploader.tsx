"use client";

import { useState } from "react";
import { Camera, Loader2, Trash2 } from "lucide-react";
import { usersService } from "@/services/user/user.service";
import { useRouter } from "next/navigation";
import FileUploader, { UploadedFile } from "../ui/FileUploader";
import { groupsService } from "@/services/groups.service";
import { mediaService } from "@/services/media.service";
import { getErrorMessage } from "@/lib/error-handler";

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
      // Step 1: upload the raw file, get back a Media object.
      const media = await mediaService.upload(
        fileToUpload,
        context === "user" ? "profiles" : "groups",
      );

      // Step 2: attach it — the entity's create/update endpoint just gets
      // the Media id, not the file itself.
      if (context === "user") {
        await usersService.setMedia(id, type, media.id);
      } else {
        await groupsService.setMedia(id, type, media.id);
      }

      router.refresh();
    } catch (error) {
      console.error("Upload Error:", error);
      alert(getErrorMessage(error) || "ფოტოს განახლება ვერ მოხერხდა");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("დარწმუნებული ხარ, რომ გინდა სურათის წაშლა?")) return;

    try {
      if (context === "user") {
        await usersService.deleteUserMedia(id, type);
      } else {
        await groupsService.deleteMedia(id, type);
      }
      router.refresh();
    } catch (error) {
      console.error("Delete failed", error);
      alert("წაშლა ვერ მოხერხდა");
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
