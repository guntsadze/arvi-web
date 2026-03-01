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
  } | null;
  isOnline?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "exsm";
  showName?: boolean;
  variant?: "default" | "card" | "profile";
  className?: string;
  onClick?: () => void;
  disableLink?: boolean;
}

export const UserAvatarItem = ({
  user,
  isOnline = false,
  size = "md",
  showName = true,
  variant = "default",
  className,
  onClick,
  disableLink = false,
}: UserAvatarItemProps) => {
  if (!user) return null;

  const sizes = {
    exsm: "w-6 h-6",
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-20 h-20",
    xl: "w-full h-full",
  };

  const Wrapper = disableLink ? "div" : Link;
  const wrapperProps = disableLink
    ? {
        className: cn(
          "flex flex-col items-center group shrink-0 cursor-default",
          className,
        ),
        onClick,
      }
    : {
        href: `/profile/${user.username || user.id}`,
        className: cn("flex flex-col items-center group shrink-0", className),
        onClick,
      };

  const avatarUrl =
    typeof user?.avatar === "string" ? user.avatar : user?.avatar?.url;

  const fullName =
    user.firstName || user.lastName
      ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
      : null;

  const AvatarImage = () => (
    <>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={user.username || "User"}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-stone-600 bg-stone-800">
          <UserIcon size={variant === "profile" ? 40 : 24} />
        </div>
      )}
    </>
  );

  // ── PROFILE  ──────────────────────────────────
  if (variant === "profile") {
    return (
      <div className={cn("relative group shrink-0", className)}>
        {/* Neon Background Effect */}
        <div className="absolute inset-0 bg-orange-500 rotate-3 rounded-2xl blur-sm opacity-20 group-hover:opacity-40 transition-opacity" />

        <button
          onClick={onClick}
          className="relative w-32 h-32 md:w-44 md:h-44 rounded-xl border-2 border-orange-500 overflow-hidden bg-neutral-900 shadow-xl cursor-zoom-in"
        >
          <AvatarImage />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
            <UserIcon size={30} className="text-white drop-shadow-lg" />
          </div>
        </button>

        {/* Online Status for Profile */}
        {isOnline && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-[#0a0a0a] rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)] z-20" />
        )}
      </div>
    );
  }

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
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-full bg-stone-800 overflow-hidden flex items-center justify-center border border-stone-700 group-hover:border-amber-500 transition-all">
            <AvatarImage />
          </div>
          {isOnline && <OnlineIndicator />}
        </div>
        <div>
          {fullName && <h4 className="text-white font-bold">{fullName}</h4>}
          <p className="text-stone-500 text-xs">
            @{user.username || "anonymous"}
          </p>
        </div>
      </Link>
    );
  }

  // ── DEFAULT VARIANT ───────────────────────────────────────────
  return (
    // <Link
    //   href={`/profile/${user.username || user.id}`}
    //   className={cn("flex flex-col items-center group shrink-0", className)}
    // >
    //   <div className="relative">
    //     <div
    //       className={cn(
    //         sizes[size],
    //         "rounded-sm border-2 border-stone-700 overflow-hidden group-hover:border-amber-500 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
    //       )}
    //     >
    //       <AvatarImage />
    //     </div>
    //     {isOnline && <OnlineIndicator />}
    //     {user.role === "ADMIN" && <AdminBadge size={size} />}
    //   </div>
    //   {showName && (
    //     <p className="text-[8px] font-mono text-stone-500 text-center mt-1.5 truncate w-full uppercase">
    //       {user.username || "Anonymous"}
    //     </p>
    //   )}
    // </Link>

    <Wrapper {...wrapperProps}>
      <div className="relative">
        <div
          className={cn(
            sizes[size],
            "rounded-sm border-2 border-stone-700 overflow-hidden group-hover:border-amber-500 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
          )}
        >
          <AvatarImage />
        </div>
        {isOnline && <OnlineIndicator />}
        {user.role === "ADMIN" && <AdminBadge size={size} />}
      </div>
      {showName && (
        <p className="text-[8px] font-mono text-stone-500 text-center mt-1.5 truncate w-full uppercase">
          {user.username || "Anonymous"}
        </p>
      )}
    </Wrapper>
  );
};

const OnlineIndicator = () => (
  <div className="absolute -bottom-0.5 -right-0.5 z-20 flex items-center justify-center">
    <div className="absolute w-3 h-3 bg-green-500/60 blur-[3px] animate-pulse rounded-none" />
    <div className="relative w-2 h-2 bg-green-400 border border-green-900 rounded-none shadow-[0_0_8px_rgba(74,222,128,0.8)]">
      <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-white/40" />
    </div>
  </div>
);

const AdminBadge = ({ size }: { size: string }) => (
  <div className="absolute -top-1 -right-1 bg-red-900 text-white p-0.5 rounded-sm border border-stone-700 shadow-md">
    <Star size={size === "sm" ? 6 : 8} fill="currentColor" />
  </div>
);
