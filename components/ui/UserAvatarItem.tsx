import Link from "next/link";
import { Star, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface UserAvatarItemProps {
  user: {
    id: string;
    username: string | null;
    firstName?: string | null;
    lastName?: string | null;
    avatar?: any;
    role?: string;
    headline?: string | null;
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
        <Image
          src={avatarUrl}
          alt={user.username || "User"}
          fill
          sizes={sizes[size]}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-text-primary bg-surface-2">
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
        <div className="absolute inset-0 bg-accent rotate-3 rounded-2xl blur-sm opacity-20 group-hover:opacity-40 transition-opacity" />

        <button
          onClick={onClick}
          className="relative w-32 h-32 md:w-44 md:h-44 rounded-xl border-2 border-accent overflow-hidden bg-surface-1 shadow-xl cursor-zoom-in"
        >
          <AvatarImage />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
            <UserIcon size={30} className="text-white drop-shadow-lg" />
          </div>
        </button>

        {/* Online Status for Profile */}
        {isOnline && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success border-2 border-background rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)] z-2" />
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
          "flex items-center gap-4 p-6 rounded-2xl bg-surface-1/50 border border-border/50 backdrop-blur-md group hover:border-accent/50 transition-all",
          className,
        )}
      >
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-full bg-surface-2 overflow-hidden flex items-center justify-center border border-border group-hover:border-accent transition-all">
            <AvatarImage />
          </div>
          {isOnline && <OnlineIndicator />}
        </div>
        <div>
          {fullName && <h4 className="text-white font-bold">{fullName}</h4>}
          <p className="text-text-secondary text-xs">
            @{user.username || "anonymous"}
          </p>
        </div>

        {/* HEADLINE ჩამატება */}
        {user.headline && (
          <p className="text-text-secondary text-sm italic line-clamp-1 mt-0.5 border-l border-accent/30 pl-2">
            {user.headline}
          </p>
        )}
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
    //         "rounded-sm border-2 border-border overflow-hidden group-hover:border-accent transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
    //       )}
    //     >
    //       <AvatarImage />
    //     </div>
    //     {isOnline && <OnlineIndicator />}
    //     {user.role === "ADMIN" && <AdminBadge size={size} />}
    //   </div>
    //   {showName && (
    //     <p className="text-[8px] font-mono text-text-secondary text-center mt-1.5 truncate w-full uppercase">
    //       {user.username || "Anonymous"}
    //     </p>
    //   )}
    // </Link>

    <Wrapper {...wrapperProps}>
      <div className="relative">
        <div
          className={cn(
            sizes[size],
            "rounded-sm border-2 border-border overflow-hidden group-hover:border-accent transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
          )}
        >
          <AvatarImage />
        </div>
        {isOnline && <OnlineIndicator />}
        {user.role === "ADMIN" && <AdminBadge size={size} />}
      </div>
      {showName && (
        <div className="mt-1.5 text-center w-full">
          <p className="text-[8px] font-mono text-text-secondary truncate uppercase">
            {user.username || "Anonymous"}
          </p>
          {/* აქაც შეიძლება პატარა headline-ის ჩამატება თუ საჭიროა */}
          {user.headline && size === "lg" && (
            <p className="text-[7px] text-text-muted truncate italic">
              {user.headline}ასსს
            </p>
          )}
        </div>
      )}
    </Wrapper>
  );
};

const OnlineIndicator = () => (
  <div className="absolute -bottom-0.5 -right-0.5 z-20 flex items-center justify-center">
    <div className="absolute w-3 h-3 bg-success/60 blur-[3px] animate-pulse rounded-none" />
    <div className="relative w-2 h-2 bg-success border border-success rounded-none shadow-[0_0_8px_rgba(74,222,128,0.8)]">
      <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-white/40" />
    </div>
  </div>
);

const AdminBadge = ({ size }: { size: string }) => (
  <div className="absolute -top-1 -right-1 bg-error/10 text-white p-0.5 rounded-sm border border-border shadow-md">
    <Star size={size === "sm" ? 6 : 8} fill="currentColor" />
  </div>
);
