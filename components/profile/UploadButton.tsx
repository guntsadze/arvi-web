"use client";

import { useState, useRef } from "react";
import { Camera, Loader2 } from "lucide-react";
import { usersService } from "@/services/user/user.service";
import { useRouter } from "next/navigation";

interface Props {
  userId: string;
  type: "avatar" | "cover";
  className?: string;
}

export default function UploadButton({ userId, type, className }: Props) {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      // 1. Cloudinary-ზე ატვირთვისთვის (Unsigned upload)
      // შენიშვნა: აქ უნდა გქონდეს NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "your_preset_name"); // შეცვალე შენი preset-ით

      const cloudName = "your_cloud_name"; // შეცვალე შენი cloud name-ით
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formData }
      );

      const data = await res.json();

      // 2. ბექენდზე გაგზავნა
      const payload = {
        url: data.secure_url,
        publicId: data.public_id,
      };

      if (type === "avatar") {
        await usersService.uploadAvatar(userId, payload);
      } else {
        await usersService.uploadCover(userId, payload);
      }

      router.refresh(); // გვერდის განახლება ახალი სურათის გამოსაჩენად
    } catch (error) {
      console.error("Upload failed:", error);
      alert("ატვირთვა ვერ მოხერხდა");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        className="hidden"
        accept="image/*"
      />
      <button
        disabled={loading}
        onClick={() => fileInputRef.current?.click()}
        className="p-2 bg-black/50 hover:bg-orange-500 text-white rounded-full transition-all backdrop-blur-sm border border-white/20"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Camera className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}
