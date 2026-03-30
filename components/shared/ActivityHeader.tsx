import { formatDistanceToNow } from "date-fns";
import { ka } from "date-fns/locale";
import Link from "next/link";
import { PostMenu } from "@/components/posts/PostMenu";
import { UserAvatarItem } from "@/components/ui/UserAvatarItem";
import {
  Car,
  Wrench,
  UserPlus,
  CalendarDays,
  ShoppingBag,
  ImageIcon,
} from "lucide-react";

export type ActivityVariant =
  | "post_created"
  | "post_updated"
  | "car_added"
  | "car_updated"
  | "modification"
  | "follow"
  | "avatar_changed"
  | "cover_changed"
  | "event"
  | "listing_created"
  | "listing_updated";

const VARIANT_CONFIG: Record<
  ActivityVariant,
  { label: string; icon: React.ReactNode; color: string }
> = {
  post_created: {
    label: "გამოაქვეყნა პოსტი",
    icon: <CalendarDays size={10} />,
    color: "text-stone-500",
  },
  post_updated: {
    label: "განაახლა პოსტი",
    icon: <Wrench size={10} />,
    color: "text-amber-600",
  },
  car_added: {
    label: "დაამატა ახალი მანქანა",
    icon: <Car size={10} />,
    color: "text-amber-500",
  },
  car_updated: {
    label: "განაახლა მანქანის ინფორმაცია",
    icon: <Wrench size={10} />,
    color: "text-amber-400",
  },
  modification: {
    label: "დაამატა ახალი მოდიფიკაცია",
    icon: <Wrench size={10} />,
    color: "text-blue-400",
  },
  follow: {
    label: "დაიწყო გამოწერა",
    icon: <UserPlus size={10} />,
    color: "text-green-400",
  },
  avatar_changed: {
    label: "განაახლა პროფილის ფოტო",
    icon: <ImageIcon size={10} />,
    color: "text-purple-400",
  },
  cover_changed: {
    label: "განაახლა ქოვერის ფოტო",
    icon: <ImageIcon size={10} />,
    color: "text-purple-400",
  },
  event: {
    label: "created an event",
    icon: <CalendarDays size={10} />,
    color: "text-rose-400",
  },
  listing_created: {
    label: "დაამატა განცხადება",
    icon: <ShoppingBag size={10} />,
    color: "text-amber-400",
  },
  listing_updated: {
    label: "განაახლა განცხადების ინფორმაცია",
    icon: <Wrench size={10} />,
    color: "text-amber-400",
  },
};

interface ActivityHeaderProps {
  user: any;
  createdAt: string;
  variant?: ActivityVariant;
  onEdit?: () => void;
  onDelete?: () => void;
  isOwner?: boolean;
  online?: boolean;
  menu?: React.ReactNode;
}

export function ActivityHeader({
  user,
  createdAt,
  variant = "post_created",
  onEdit,
  onDelete,
  isOwner,
  online,
  menu,
}: ActivityHeaderProps) {
  const safeVariant = variant.toLowerCase() as ActivityVariant;

  // 2. ამოვიღოთ კონფიგურაცია, თუ არ არსებობს - გამოვიყენოთ default
  const config = VARIANT_CONFIG[safeVariant] || VARIANT_CONFIG["post_created"];

  return (
    <div className="flex items-center justify-between p-4 border-b border-stone-800 bg-[#1c1917]">
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
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-[#EBE9E1] uppercase tracking-wide text-xs group-hover/user:text-amber-500 transition-colors">
              {user?.firstName} {user?.lastName}
            </p>
            <span className="text-[10px] text-stone-600 font-mono">
              @{user?.username}
            </span>
          </div>

          {/* Activity badge */}
          <div className={`flex items-center gap-1 mt-0.5 ${config.color}`}>
            {config.icon}
            <span className="text-[10px] font-mono uppercase tracking-widest">
              {config.label}
            </span>
            <span className="text-[10px] text-stone-600 font-mono ml-1">
              ·{" "}
              {formatDistanceToNow(new Date(createdAt), {
                addSuffix: true,
                locale: ka,
              })}
            </span>
          </div>
        </div>
      </Link>

      {menu}
    </div>
  );
}
