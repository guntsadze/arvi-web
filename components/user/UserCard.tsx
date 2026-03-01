"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, ShieldCheck, MapPin, Hash, Shield } from "lucide-react";
import { useToggleFollow } from "@/hooks/useToggleFollow";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/store/slices/userSlice";
import { UserAvatarItem } from "../ui/UserAvatarItem";
import { usePresence } from "@/context/PresenceContext";

type User = {
  id: string;
  username: string | null;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string | null;
  cover?: string | null;
  role: "USER" | "ADMIN";
  isVerified: boolean;
  followersCount: number;
  postsCount: number;
  location?: string | null;
  isFollowing?: boolean;
};

export default function UserCard({ user }: { user: User }) {
  const currentUser = useAppSelector(selectCurrentUser);
  const router = useRouter();
  const { isUserOnline } = usePresence();
  const { toggleFollow, isLoading, error, isFollowing, followersCount } =
    useToggleFollow(
      user.id,
      user.isFollowing ?? false,
      user.followersCount ?? 0,
    );

  if (!currentUser || currentUser?.id === user.id) {
    return null;
  }

  const handleCardClick = () => {
    router.push(`/profile/${user.username || user.id}`);
  };

  const handleFollowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFollow();
  };

  console.log(user, "usersssss");

  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-stone-900 translate-x-2 translate-y-2 rounded-sm" />
      <div
        onClick={handleCardClick}
        className="relative bg-[#dcd8c8] border border-stone-500 rounded-sm overflow-hidden flex flex-col h-full transition-transform hover:-translate-y-1 duration-200 cursor-pointer"
      >
        <div className="relative h-24 bg-stone-800 border-b-2 border-stone-600">
          {user.cover ? (
            <Image
              src={user.cover}
              alt="cover"
              fill
              sizes="100vw"
              className="object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-500"
            />
          ) : (
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]" />
          )}

          <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/60 border border-stone-500 backdrop-blur-sm">
            <span className="text-[9px] text-amber-500 font-mono tracking-widest">
              #{user.id.slice(-4).toUpperCase()}
            </span>
          </div>
        </div>

        <div className="px-5 pt-0 flex-1 flex flex-col">
          <div className="relative -mt-10 mb-3 w-fit">
            <UserAvatarItem
              key={user?.avatar}
              user={user}
              isOnline={isUserOnline(user.id)}
            />
            {user.isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-blue-700 text-white p-1 rounded-full border-2 border-[#dcd8c8]">
                <ShieldCheck size={12} />
              </div>
            )}
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xl font-black text-stone-900 uppercase leading-none truncate pr-2">
                {user.firstName} {user.lastName}
              </h3>
              <span
                className={`text-[9px] px-1.5 py-0.5 border rounded-sm font-bold uppercase tracking-wider ${
                  user.role === "ADMIN"
                    ? "bg-red-900/20 text-red-900 border-red-800"
                    : "bg-stone-400/20 text-stone-600 border-stone-400"
                }`}
              >
                {user.role}
              </span>
            </div>
            <p className="text-stone-600 font-mono text-xs mb-3">
              @{user.username || user.email.split("@")[0]}
            </p>

            <div className="flex items-center gap-4 py-2 border-t border-b border-stone-300 border-dashed">
              <div className="flex flex-col">
                <span className="text-xs font-black text-stone-800">
                  {followersCount}
                </span>
                <span className="text-[9px] text-stone-500 uppercase tracking-wide">
                  Followers
                </span>
              </div>
              <div className="w-[1px] h-6 bg-stone-300" />
              <div className="flex flex-col">
                <span className="text-xs font-black text-stone-800">
                  {user.postsCount}
                </span>
                <span className="text-[9px] text-stone-500 uppercase tracking-wide">
                  Posts
                </span>
              </div>
              {user.location && (
                <>
                  <div className="w-[1px] h-6 bg-stone-300" />
                  <div className="flex flex-col truncate">
                    <span className="text-xs font-black text-stone-800 truncate flex items-center gap-1">
                      <MapPin size={10} /> {user.location}
                    </span>
                    <span className="text-[9px] text-stone-500 uppercase tracking-wide">
                      Loc
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mt-auto pb-5 flex gap-2">
            <button
              onClick={handleFollowClick}
              disabled={isLoading}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 font-black uppercase tracking-widest text-[10px] transition-all ${
                isFollowing
                  ? "bg-amber-600 text-black shadow-[3px_3px_0px_0px_#000]"
                  : "bg-stone-800 text-[#EBE9E1] shadow-[3px_3px_0px_0px_#b45309]"
              } disabled:opacity-60`}
            >
              <UserPlus size={14} />
              {isLoading ? "..." : isFollowing ? "Unfollow" : "Follow"}
            </button>

            <Link
              href={`/profile/${user.username || user.id}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center px-3 py-2 border-2 border-stone-800 text-stone-800 font-bold hover:bg-stone-200 transition-colors"
              title="View Dossier"
            >
              <Shield size={16} />
            </Link>
          </div>

          {error && (
            <p className="text-red-600 text-[10px] mt-1 text-center">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
