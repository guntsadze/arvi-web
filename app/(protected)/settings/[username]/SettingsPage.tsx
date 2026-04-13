"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { Camera, MapPin, Link as LinkIcon, User } from "lucide-react";
import { RuggedInput } from "@/components/ui/RuggedInput";
import { RuggedTextArea } from "@/components/ui/RuggedTexArea";
import { SaveRow } from "@/components/settings/SaveRow";
import { ImageLightbox } from "@/components/ui/ImageLightbox";
import { apiClient } from "@/lib/api";
import { UserAvatarItem } from "@/components/ui/UserAvatarItem";
import { toast } from "sonner";

type ProfileForm = {
  firstName: string;
  lastName: string;
  username: string;
  bio: string;
  headline: string;
  location: string;
  website: string;
};

export default function ProfileSettingsPage({ user }: { user: any }) {
  console.log("🚀 ~ ProfileSettingsPage ~ user:", user);
  const [lightbox, setLightbox] = useState<{
    src: string | null;
    type: "avatar" | "cover";
  } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ProfileForm>({
    // 'values' უზრუნველყოფს, რომ ფორმა შეივსოს მაშინაც კი, თუ 'user' დაგვიანებით მოვიდა
    values: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      username: user?.username ?? "",
      headline: user?.headline ?? "",
      bio: user?.bio ?? "",
      location: user?.location ?? "",
      website: user?.website ?? "",
    },
  });

  const bioLength = watch("bio")?.length ?? 0;

  const onSubmit = async (data: ProfileForm) => {
    try {
      await apiClient.patch("/users/me/profile", data);
      // აქ შეგიძლიათ დაამატოთ წარმატების შეტყობინება (toast)
      toast.success("პროფილის ინფორმაცია წარმატებით განახლდა!");
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  return (
    <form className="p-0 overflow-hidden" onSubmit={handleSubmit(onSubmit)}>
      {/* ── HEADER AREA ── */}
      <div className="relative h-44 w-full group/cover bg-stone-900">
        {/* Cover Photo */}
        {user?.cover ? (
          <Image
            src={user.cover}
            alt="Cover"
            fill
            className="object-cover opacity-60 group-hover/cover:opacity-80 transition-opacity duration-500"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-stone-800 to-stone-950" />
        )}

        {/* Change Cover Button */}
        <button
          type="button"
          onClick={() =>
            setLightbox({ src: user?.cover || null, type: "cover" })
          }
          className="absolute top-4 right-4 z-10 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 text-[10px] uppercase tracking-widest text-white hover:bg-amber-600 hover:border-amber-500 transition-all duration-300 shadow-xl"
        >
          <Camera size={14} />
          ქოვერის განახლება
        </button>

        {/* Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0d0c] to-transparent" />

        {/* Avatar Positioned on Edge */}
        <div className="absolute -bottom-10 left-8 z-20">
          <div className="relative group/avatar">
            <UserAvatarItem
              user={user}
              variant="profile"
              // isOnline={isUserOnline(user.id)}
              className="pointer-events-auto"
              onClick={() =>
                setLightbox({
                  src: user.avatar || null,
                  type: "avatar",
                })
              }
            />

            {/* Status Indicator (Online) */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-[3px] border-[#0f0d0c] rounded-full" />
          </div>
        </div>
      </div>

      {/* ── FORM CONTENT ── */}
      <div className="px-8 pt-16 pb-8 space-y-6">
        <div>
          <h2 className="text-xl font-black tracking-tighter text-[#EBE9E1] mb-1">
            პროფილის ინფორმაცია
          </h2>
          {/* <p className="text-[10px] font-mono text-stone-300 uppercase tracking-widest">
            // update your tactical identity
          </p> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RuggedInput
            label="სახელი"
            name="firstName"
            register={register}
            required
            error={errors.firstName}
          />
          <RuggedInput
            label="გვარი"
            name="lastName"
            register={register}
            required
            error={errors.lastName}
          />
        </div>

        <RuggedInput
          label="Username"
          name="username"
          register={register}
          placeholder="@handle"
          error={errors.username}
        />

        <RuggedInput
          label="Headline"
          name="headline"
          register={register}
          placeholder="@drifter"
          error={errors.headline}
        />

        <div className="space-y-1">
          <RuggedTextArea
            label="Bio"
            name="bio"
            register={register}
            rows={3}
            placeholder="Tell the world who you are..."
          />
          <div className="flex justify-between items-center px-1">
            <span className="text-[8px] text-stone-300 font-mono uppercase tracking-tighter italic">
              Write a short briefing about yourself
            </span>
            <span
              className={`text-[10px] font-mono ${bioLength > 150 ? "text-amber-600" : "text-stone-300"}`}
            >
              {bioLength} / 160
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RuggedInput
            label="ლოკაცია"
            name="location"
            register={register}
            icon={<MapPin size={14} />}
            placeholder="Tbilisi, GE"
          />
          <RuggedInput
            label="ვებსაიტი"
            name="website"
            register={register}
            icon={<LinkIcon size={14} />}
            placeholder="https://yourlink.com"
          />
        </div>

        <div className="pt-4">
          <SaveRow
            isDirty={isDirty}
            isSubmitting={isSubmitting}
            fn="პროფილის განახლება"
            username={user.username}
          />
        </div>
      </div>

      {/* ── LIGHTBOX ── */}
      <ImageLightbox
        src={lightbox?.src ?? null}
        alt={lightbox?.type === "avatar" ? "Avatar" : "Cover"}
        isOpen={!!lightbox}
        onClose={() => setLightbox(null)}
        editable={true} // სეთინგებში ყოველთვის იედითებადი უნდა იყოს
        id={user?.id}
        type={lightbox?.type}
        context="user"
      />
    </form>
  );
}
