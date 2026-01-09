import { ShieldCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ka } from "date-fns/locale";
import Link from "next/link";
import Image from "next/image";
import { PostMenu } from "./PostMenu"; // იმპორტი

interface PostHeaderProps {
  user: any;
  createdAt: string;
  onEdit: () => void;
  onDelete: () => void;
  isOwner: boolean;
}

export function PostHeader({
  user,
  createdAt,
  onEdit,
  onDelete,
  isOwner,
}: PostHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-stone-800 bg-[#1c1917]">
      <Link
        href={`/profile/${user?.username}`}
        className="flex items-center gap-3 group/user"
      >
        <div className="relative p-0.5 bg-stone-800 border border-stone-600">
          <Image
            src={user?.avatar?.url || "/default-avatar.png"}
            alt={user?.firstName}
            width={40}
            height={40}
            className="grayscale group-hover/user:grayscale-0 transition-all"
          />
          {user.isVerified && (
            <div className="absolute -bottom-1 -right-1 bg-stone-900 p-0.5 border border-stone-600">
              <ShieldCheck size={10} className="text-amber-500" />
            </div>
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-bold text-[#EBE9E1] uppercase tracking-wide text-xs group-hover/user:text-amber-500 transition-colors">
              {user.firstName} {user.lastName}
            </p>
            <span className="text-[10px] text-stone-600 font-mono">
              ID: {user.username}
            </span>
          </div>
          <p className="text-[10px] font-mono text-stone-500 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-900 border border-emerald-700 animate-pulse"></span>
            {formatDistanceToNow(new Date(createdAt), {
              addSuffix: true,
              locale: ka,
            })}
          </p>
        </div>
      </Link>
      <PostMenu onEdit={onEdit} onDelete={onDelete} isOwner={isOwner} />
    </div>
  );
}
