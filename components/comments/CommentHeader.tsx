import { formatDistanceToNow } from "date-fns";
import { ka } from "date-fns/locale";

interface CommentHeaderProps {
  user: { firstName: string; lastName: string };
  createdAt: string | Date;
  isReply?: boolean;
}

export const CommentHeader = ({
  user,
  createdAt,
  isReply,
}: CommentHeaderProps) => (
  <div className="flex items-baseline gap-2 mb-1">
    <span
      className={`font-bold uppercase tracking-wider ${isReply ? "text-[9px] text-amber-700/80" : "text-[10px] text-stone-400"}`}
    >
      {user.firstName} {user.lastName}
    </span>
    <span className="text-[8px] text-stone-700 font-mono">
      {formatDistanceToNow(new Date(createdAt), {
        addSuffix: true,
        locale: ka,
      })}
    </span>
  </div>
);
