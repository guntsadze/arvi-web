"use client";

import FollowButton from "@/components/profile/FollowButton";
import { MapPin, ShieldCheck, Camera } from "lucide-react";
import Image from "next/image";
import MessageButton from "./MessageButton";
import ProfileContentWrapper from "./UserProfileContent";
import { UserAvatarItem } from "@/components/ui/UserAvatarItem";
import { ImageLightbox } from "@/components/ui/ImageLightbox";
import { useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/store/slices/userSlice";
import { usePresence } from "@/context/PresenceContext";

export default function ProfilePage({ user }: { user: any }) {
  const currentUser = useAppSelector(selectCurrentUser);
  const { isUserOnline } = usePresence();

  const isOwner = currentUser?.id === user.id;

  const [lightbox, setLightbox] = useState<{
    src: string | null;
    type: "avatar" | "cover";
  } | null>(null);

  return (
    <div className="min-h-screen bg-background text-white selection:bg-accent/30 scrollbar-hide">
      {/* Carbon Fiber Background */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

      {/* ── HEADER AREA ── */}
      <div className="relative h-[350px] md:h-[450px] w-full overflow-hidden">
        {/* COVER — კლიკზე lightbox */}
        <button
          onClick={() =>
            setLightbox({ src: user.cover || null, type: "cover" })
          }
          className="absolute inset-0 w-full h-full group cursor-zoom-in"
          aria-label="View cover photo"
        >
          {user.cover ? (
            <Image
              src={user.cover}
              alt="Cover"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-b from-surface-2 to-background" />
          )}

          {/* Hover hint — owner */}
          {isOwner && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex items-center gap-2 px-4 py-2 bg-black/60 border border-white/10 backdrop-blur-sm font-mono text-[10px] uppercase tracking-widest text-white">
                <Camera size={12} />
                Click to manage cover
              </div>
            </div>
          )}
        </button>

        {/* Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent pointer-events-none" />

        {/* ── IDENTITY ── */}
        <div className="absolute bottom-0 left-0 w-full px-4 md:px-10 pb-10 pointer-events-none">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-end gap-6">
            {/* AVATAR — კლიკზე lightbox */}
            <div className="relative group pointer-events-auto">
              <div className="w-32 h-32 md:w-44 md:h-44 relative">
                <div className="absolute inset-0 bg-accent rotate-3 rounded-2xl blur-sm opacity-20 group-hover:opacity-40 transition-opacity" />

                <UserAvatarItem
                  user={user}
                  variant="profile"
                  isOnline={isUserOnline(user.id)}
                  className="pointer-events-auto"
                  onClick={() =>
                    setLightbox({
                      src: user.avatar || null,
                      type: "avatar",
                    })
                  }
                />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 mb-2 pointer-events-none">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter">
                  {user.firstName} {user.lastName}
                </h1>
                {user.isVerified && (
                  <ShieldCheck className="text-info w-6 h-6 md:w-8 md:h-8" />
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-text-secondary font-mono text-sm">
                <span className="text-accent font-bold">
                  @{user.username}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={14} /> {user.location || "Earth"}
                </span>
                <span className="bg-surface-2 px-2 py-0.5 rounded text-[10px] border border-border uppercase tracking-widest text-white">
                  {user.role}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 w-full md:w-auto pb-2 pointer-events-auto">
              <FollowButton
                userId={user.id}
                initialFollowing={user.isFollowing || false}
                followersCount={user.followersCount || 0}
              />
              <MessageButton userId={user.id} />
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <ProfileContentWrapper
        user={user}
        userId={user.id}
        online={isUserOnline(user.id)}
      />

      {/* ── LIGHTBOX ── */}
      <ImageLightbox
        src={lightbox?.src ?? null}
        alt={
          lightbox?.type === "avatar"
            ? `${user.username} avatar`
            : `${user.username} cover`
        }
        isOpen={!!lightbox}
        onClose={() => setLightbox(null)}
        editable={isOwner}
        id={user.id}
        type={lightbox?.type}
        context="user"
      />
    </div>
  );
}
