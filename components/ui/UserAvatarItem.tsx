import Link from "next/link";
import { Star, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserAvatarItemProps {
  user: {
    id: string;
    username: string | null;
    avatar?: any;
    role?: string;
  };
  size?: "sm" | "md" | "lg" | "xl";
  showName?: boolean;
  className?: string;
}

export const UserAvatarItem = ({
  user,
  size = "md",
  showName = true,
  className,
}: UserAvatarItemProps) => {
  const sizes = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-20 h-20",
    xl: "w-full h-full",
  };

  const avatarUrl =
    typeof user?.avatar === "string" ? user.avatar : user?.avatar?.url;

  return (
    <Link
      href={`/profile/${user.username || user.id}`}
      className={cn("flex flex-col items-center group shrink-0", className)}
    >
      <div className="relative w-full h-full">
        <div
          className={cn(
            sizes[size],
            "rounded-sm border-2 border-stone-700 bg-stone-800 overflow-hidden group-hover:border-amber-500 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          )}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={user.username || "User"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-600">
              <UserIcon size={size === "sm" ? 16 : size === "xl" ? 48 : 24} />
            </div>
          )}
        </div>

        {user.role === "ADMIN" && (
          <div className="absolute -top-1 -right-1 bg-red-900 text-white p-0.5 rounded-sm border border-stone-700 shadow-md">
            <Star size={size === "sm" ? 6 : 8} fill="currentColor" />
          </div>
        )}
      </div>

      {showName && (
        <p className="text-[8px] font-mono text-stone-500 text-center mt-1.5 truncate w-full group-hover:text-amber-500 transition-colors uppercase tracking-tighter">
          {user.username || "Anonymous"}
        </p>
      )}
    </Link>
  );
};
