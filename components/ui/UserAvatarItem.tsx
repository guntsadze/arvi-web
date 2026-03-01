import Link from "next/link";
import { Star, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserAvatarItemProps {
  user: {
    id: string;
    username: string | null;
    firstName?: string | null;
    lastName?: string | null;
    avatar?: any;
    role?: string;
  };
  isOnline?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  showName?: boolean;
  variant?: "default" | "card";
  className?: string;
}

export const UserAvatarItem = ({
  user,
  isOnline = false,
  size = "md",
  showName = true,
  variant = "default",
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

  const fullName =
    user.firstName || user.lastName
      ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
      : null;

  // ── CARD VARIANT ──────────────────────────────────────────────
  if (variant === "card") {
    return (
      <Link
        href={`/profile/${user.username || user.id}`}
        className={cn(
          "flex items-center gap-4 p-6 rounded-2xl bg-stone-900/50 border border-stone-800/50 backdrop-blur-md group hover:border-amber-500/50 transition-all",
          className,
        )}
      >
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-full bg-stone-800 overflow-hidden flex items-center justify-center border border-stone-700 group-hover:border-amber-500 transition-all">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={user.username || "User"}
                className="w-full h-full object-cover"
              />
            ) : (
              <UserIcon size={20} className="text-stone-500" />
            )}
          </div>

          {/* 🟢 Neon Online Indicator */}
          {isOnline && (
            <div className="absolute -bottom-0.5 -right-0.5 z-20 flex items-center justify-center">
              {/* Background Glow (ანიმაციური ნათება) */}
              <div className="absolute w-3 h-3 bg-green-500/60 blur-[3px] animate-pulse rounded-none" />

              {/* The Core LED (მყარი ცენტრი) */}
              <div className="relative w-2 h-2 bg-green-400 border border-green-900 rounded-none shadow-[0_0_8px_rgba(74,222,128,0.8)]">
                {/* პატარა თეთრი წერტილი ცენტრში რეალისტური LED ეფექტისთვის */}
                <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-white/40" />
              </div>
            </div>
          )}
          {user.role === "ADMIN" && (
            <div className="absolute -top-1 -right-1 bg-red-900 text-white p-0.5 rounded-sm border border-stone-700 shadow-md">
              <Star size={8} fill="currentColor" />
            </div>
          )}
        </div>

        {/* Text */}
        <div>
          {fullName && (
            <h4 className="text-white font-bold group-hover:text-amber-500 transition-colors">
              {fullName}
            </h4>
          )}
          <p className="text-stone-500 text-xs">
            @{user.username || "anonymous"}
          </p>
        </div>
      </Link>
    );
  }

  // ── DEFAULT VARIANT ───────────────────────────────────────────
  return (
    <Link
      href={`/profile/${user.username || user.id}`}
      className={cn("flex flex-col items-center group shrink-0", className)}
    >
      <div className="relative w-full h-full">
        <div
          className={cn(
            sizes[size],
            "rounded-sm border-2 border-stone-700 bg-stone-800 overflow-hidden group-hover:border-amber-500 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
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

        {/* 🟢 Neon Online Indicator */}
        {isOnline && (
          <div className="absolute -bottom-0.5 -right-0.5 z-20 flex items-center justify-center">
            {/* Background Glow (ანიმაციური ნათება) */}
            <div className="absolute w-3 h-3 bg-green-500/60 blur-[3px] animate-pulse rounded-none" />

            {/* The Core LED (მყარი ცენტრი) */}
            <div className="relative w-2 h-2 bg-green-400 border border-green-900 rounded-none shadow-[0_0_8px_rgba(74,222,128,0.8)]">
              {/* პატარა თეთრი წერტილი ცენტრში რეალისტური LED ეფექტისთვის */}
              <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-white/40" />
            </div>
          </div>
        )}

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
