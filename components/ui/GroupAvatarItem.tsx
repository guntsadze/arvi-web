import Link from "next/link";
import { Activity, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import ImageUploader from "./ImageUploader";
import Image from "next/image";

interface GroupAvatarItemProps {
  group: {
    id: string;
    slug: string;
    name: string;
    avatar?: any;
  } | null;
  size?: "sm" | "md" | "lg"; // sm: 16x16, md: 32x32 (შენი ზომა), lg: 40x40
  isOwner?: boolean;
  showName?: boolean;
  className?: string;
}

export const GroupAvatarItem = ({
  group,
  size = "md",
  isOwner = false,
  showName = false,
  className,
}: GroupAvatarItemProps) => {
  if (!group) return null;

  const sizes = {
    sm: "w-16 h-16",
    md: "w-32 h-32",
    lg: "w-40 h-40",
  };

  const avatarUrl =
    typeof group?.avatar === "string" ? group.avatar : group?.avatar?.url;

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div
        className={cn(
          sizes[size],
          "bg-[#201d1b] border-2 border-stone-800 p-1 relative shadow-2xl group/avatar",
        )}
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={group.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-stone-950 flex items-center justify-center font-mono text-stone-400 text-[10px]">
            NO_IMG
          </div>
        )}

        {/* ატვირთვის ღილაკი (მხოლოდ პატრონისთვის) */}
        {isOwner && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-200">
            <ImageUploader id={group.id} type="avatar" context="group" />
          </div>
        )}

        {/* სტატუსის ბეიჯი (Activity Icon) */}
        <div className="absolute -bottom-2 -right-2 bg-amber-700 p-1.5 border border-[#1c1917] z-20 shadow-lg">
          <Activity size={size === "sm" ? 10 : 14} className="text-stone-950" />
        </div>
      </div>

      {/* ჯგუფის სახელი (თუ საჭიროა) */}
      {showName && (
        <p className="mt-3 font-mono text-[10px] text-stone-300 uppercase tracking-widest truncate w-full text-center">
          {group.name}
        </p>
      )}
    </div>
  );
};
