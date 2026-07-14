import { formatDistanceToNow } from "date-fns";
import { ka } from "date-fns/locale";
import Link from "next/link";
import { PostMenu } from "./PostMenu";
import { UserAvatarItem } from "../ui/UserAvatarItem";

interface PostHeaderProps {
  user: any;
  createdAt: string;
  onEdit: () => void;
  onDelete: () => void;
  isOwner: boolean;
  online: boolean;
}

export function PostHeader({
  user,
  createdAt,
  onEdit,
  onDelete,
  isOwner,
  online,
}: PostHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-border bg-surface-1">
      <Link
        href={`/profile/${user?.username}`}
        className="flex items-center gap-3 group/user"
      >
        <UserAvatarItem
          user={user}
          showName={false}
          size="sm"
          isOnline={online}
          disableLink={true}
        />
        <div>
          <div className="flex items-center gap-2">
            <p className="font-bold text-text-primary uppercase tracking-wide text-xs group-hover/user:text-accent transition-colors">
              {user?.firstName} {user?.lastName}
            </p>
            <span className="text-[10px] text-text-primary font-mono">
              Username: {user?.username}
            </span>
          </div>
          <p className="text-[10px] font-mono text-text-secondary uppercase tracking-widest flex items-center gap-2">
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
