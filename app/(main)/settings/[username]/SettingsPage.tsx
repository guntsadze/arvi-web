"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import Link from "next/link";
import {
  Camera,
  Car as CarIcon,
  Link as LinkIcon,
  MapPin,
  Pencil,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { ImageLightbox } from "@/components/ui/ImageLightbox";
import { UserAvatarItem } from "@/components/ui/UserAvatarItem";
import { apiClient } from "@/lib/api";
import { cn } from "@/lib/utils";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import type { User } from "@/types/user";
import type { Car } from "@/services/cars/cars.service";
import type { PaginatedResult } from "@/types/pagination.types";

const AUTO_USERNAME_PATTERN = /^user_[0-9a-f]{8}$/;
const USERNAME_PROMPT_KEY_PREFIX = "arvi:username-prompt-dismissed:";

type ProfileForm = {
  firstName: string;
  lastName: string;
  username: string;
  bio: string;
  headline: string;
  location: string;
  website: string;
};

export default function ProfileSettingsPage({ user }: { user: User }) {
  const [lightbox, setLightbox] = useState<{
    src: string | null;
    type: "avatar" | "cover";
  } | null>(null);

  const [profile, setProfile] = useState<User>(user);
  const [isEditing, setIsEditing] = useState(false);
  const [usernameError, setUsernameError] = useState<string | undefined>();
  const [usernamePromptDismissed, setUsernamePromptDismissed] =
    useState(true);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ProfileForm>({
    values: {
      firstName: profile.firstName ?? "",
      lastName: profile.lastName ?? "",
      username: profile.username ?? "",
      headline: profile.headline ?? "",
      bio: profile.bio ?? "",
      location: profile.location ?? "",
      website: profile.website ?? "",
    },
  });

  const bioLength = watch("bio")?.length ?? 0;
  const isAutoUsername =
    !!profile.username && AUTO_USERNAME_PATTERN.test(profile.username);

  useEffect(() => {
    if (typeof window === "undefined" || !profile.id) return;
    setUsernamePromptDismissed(
      window.localStorage.getItem(
        `${USERNAME_PROMPT_KEY_PREFIX}${profile.id}`,
      ) === "true",
    );
  }, [profile.id]);

  const dismissUsernamePrompt = () => {
    setUsernamePromptDismissed(true);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        `${USERNAME_PROMPT_KEY_PREFIX}${profile.id}`,
        "true",
      );
    }
  };

  const startEditing = () => setIsEditing(true);

  const cancelEditing = () => {
    reset();
    setUsernameError(undefined);
    setIsEditing(false);
  };

  const onSubmit = async (data: ProfileForm) => {
    setUsernameError(undefined);
    try {
      const updated = await apiClient.patch<User>("/Users/me/profile", data);
      setProfile(updated);
      toast.success("პროფილის ინფორმაცია წარმატებით განახლდა!");
      setIsEditing(false);
    } catch (error) {
      const status = (error as { status?: number } | undefined)?.status;
      if (status === 409) {
        setUsernameError(
          getApiErrorMessage(error, "ეს username უკვე დაკავებულია"),
        );
        return;
      }
      toast.error(getApiErrorMessage(error, "პროფილის განახლება ვერ მოხერხდა"));
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-10">
      {/* ── HEADER AREA ── */}
      <div className="relative h-44 w-full overflow-hidden rounded-2xl group/cover bg-surface-1">
        {profile.cover ? (
          <Image
            src={profile.cover}
            alt="Cover"
            fill
            className="object-cover opacity-60 transition-opacity duration-500 group-hover/cover:opacity-80"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-surface-2 to-background" />
        )}

        <button
          type="button"
          onClick={() =>
            setLightbox({ src: profile.cover || null, type: "cover" })
          }
          className="absolute top-4 right-4 z-10 flex items-center gap-2 rounded-md border border-white/10 bg-black/60 px-3 py-1.5 text-[10px] uppercase tracking-widest text-white backdrop-blur-md transition-all duration-300 hover:border-accent hover:bg-primary-hover"
        >
          <Camera size={14} />
          ქოვერის განახლება
        </button>

        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />

        <div className="absolute -bottom-10 left-8 z-20">
          <div className="relative group/avatar">
            <UserAvatarItem
              user={profile}
              variant="profile"
              className="pointer-events-auto"
              onClick={() =>
                setLightbox({ src: profile.avatar || null, type: "avatar" })
              }
            />
            <div className="absolute -right-1 -bottom-1 h-5 w-5 rounded-full border-[3px] border-background bg-success" />
          </div>
        </div>
      </div>

      <div className="h-6" />

      {/* ── PROFILE INFO CARD ── */}
      <form onSubmit={handleSubmit(onSubmit)} className="glass-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text-primary">
            პროფილის ინფორმაცია
          </h2>
          {!isEditing ? (
            <button
              type="button"
              onClick={startEditing}
              aria-label="რედაქტირება"
              className="text-text-muted transition-colors hover:text-primary"
            >
              <Pencil size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={cancelEditing}
              aria-label="გაუქმება"
              className="text-text-muted transition-colors hover:text-error"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {isAutoUsername && !usernamePromptDismissed && (
          <div className="mb-4 flex items-start justify-between gap-3 rounded-md border border-primary/30 bg-primary/5 px-3 py-2.5">
            <p className="text-xs text-text-secondary">
              დააკასტომიზირე შენი username გასაზიარებლად
            </p>
            <button
              type="button"
              onClick={dismissUsernamePrompt}
              aria-label="დახურვა"
              className="shrink-0 text-text-muted transition-colors hover:text-text-primary"
            >
              <X size={12} />
            </button>
          </div>
        )}

        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                label="სახელი"
                required
                error={errors.firstName?.message}
                {...register("firstName")}
              />
              <Input
                label="გვარი"
                required
                error={errors.lastName?.message}
                {...register("lastName")}
              />
            </div>

            <Input
              label="Username"
              placeholder="@handle"
              error={usernameError ?? errors.username?.message}
              {...register("username")}
            />

            <Input
              label="Headline"
              placeholder="@drifter"
              error={errors.headline?.message}
              {...register("headline")}
            />

            <div className="space-y-1">
              <Textarea
                label="ბიო"
                rows={3}
                placeholder="მოგვიყევი შენს შესახებ..."
                {...register("bio")}
              />
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] text-text-muted">
                  მოკლე აღწერა შენს შესახებ
                </span>
                <span
                  className={cn(
                    "text-[10px] font-mono",
                    bioLength > 150 ? "text-error" : "text-text-muted",
                  )}
                >
                  {bioLength} / 160
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                label="ლოკაცია"
                leftIcon={<MapPin size={14} />}
                placeholder="Tbilisi, GE"
                {...register("location")}
              />
              <Input
                label="ვებსაიტი"
                leftIcon={<LinkIcon size={14} />}
                placeholder="https://yourlink.com"
                {...register("website")}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={cancelEditing}
                disabled={isSubmitting}
              >
                გაუქმება
              </Button>
              <Button
                type="submit"
                variant="secondary"
                isLoading={isSubmitting}
                disabled={!isDirty}
              >
                შენახვა
              </Button>
            </div>
          </div>
        ) : (
          <dl className="space-y-3 text-sm">
            <ProfileRow
              label="სახელი და გვარი"
              value={`${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim() || "—"}
            />
            <ProfileRow
              label="Username"
              value={profile.username ? `@${profile.username}` : "—"}
            />
            <ProfileRow label="Headline" value={profile.headline || "—"} />
            <ProfileRow label="ბიო" value={profile.bio || "—"} />
            <ProfileRow label="ლოკაცია" value={profile.location || "—"} />
            <ProfileRow label="ვებსაიტი" value={profile.website || "—"} />
          </dl>
        )}
      </form>

      <GarageSummaryCard userId={profile.id} />

      {/* ── LIGHTBOX ── */}
      <ImageLightbox
        src={lightbox?.src ?? null}
        alt={lightbox?.type === "avatar" ? "Avatar" : "Cover"}
        isOpen={!!lightbox}
        onClose={() => setLightbox(null)}
        editable={true}
        id={profile.id}
        type={lightbox?.type}
        context="user"
      />
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-2.5 last:border-0 last:pb-0">
      <dt className="shrink-0 text-xs text-text-secondary">{label}</dt>
      <dd className="text-right text-text-primary">{value}</dd>
    </div>
  );
}

/**
 * Only rendered once the car count is known — skipped entirely on error
 * rather than showing a misleading "0 cars" state.
 */
function GarageSummaryCard({ userId }: { userId: string }) {
  const [carCount, setCarCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    apiClient
      .get<PaginatedResult<Car>>(`/cars/garage/${userId}`, {
        page: 1,
        limit: 1,
      })
      .then((result) => {
        if (!cancelled) setCarCount(result.meta?.total ?? 0);
      })
      .catch(() => {
        if (!cancelled) setCarCount(null);
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (carCount === null) return null;

  return (
    <Link
      href="/garage"
      className="glass-card-hover flex items-center justify-between p-5"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <CarIcon size={18} />
        </div>
        <div>
          <p className="text-sm font-semibold text-text-primary">
            ჩემი გარაჟი
          </p>
          <p className="text-xs text-text-secondary">
            {carCount === 0
              ? "მანქანა ჯერ არ დამატებულა"
              : `${carCount} ავტომობილი გარაჟში`}
          </p>
        </div>
      </div>
      <span className="text-xs font-mono text-text-muted">→</span>
    </Link>
  );
}
