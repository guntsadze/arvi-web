"use client";

import ProfileContentWrapper from "./UserProfileContent";
import { ImageLightbox } from "@/components/ui/ImageLightbox";
import { ProfileMiniHeader } from "@/components/profile/ProfileMiniHeader";
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

      {/* ── COMPACT HEADER — the garage grid below is the real hero now ── */}
      <ProfileMiniHeader
        user={user}
        isOwner={isOwner}
        isOnline={isUserOnline(user.id)}
        onAvatarClick={() =>
          setLightbox({ src: user.avatar || null, type: "avatar" })
        }
        onCoverClick={() =>
          setLightbox({ src: user.cover || null, type: "cover" })
        }
      />

      {/* ── CONTENT ── */}
      <ProfileContentWrapper
        user={user}
        userId={user.id}
        online={isUserOnline(user.id)}
        isOwner={isOwner}
      />

      {/* ── LIGHTBOX — still owner-editable, just reached via the mini header now ── */}
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
