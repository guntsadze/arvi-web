"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  Control,
  UseFormRegister,
  UseFormSetValue,
  useWatch,
} from "react-hook-form";
import { Camera, ImagePlus, Upload, X, Globe, Lock } from "lucide-react";
import { CarFormData } from "@/types/carForm.types";
import { cn } from "@/lib/utils";

interface ShowOffStepProps {
  control: Control<CarFormData>;
  register: UseFormRegister<CarFormData>;
  setValue: UseFormSetValue<CarFormData>;
}

interface UploadedPhoto {
  url: string;
  publicId?: string;
  format?: string;
  bytes?: number;
  mediaType?: string;
}

type PhotoItem = File | UploadedPhoto;

function getPreviewUrl(photo: PhotoItem): string {
  return photo instanceof File ? URL.createObjectURL(photo) : photo.url;
}

/**
 * Step 4 — "Show Off": drag-and-drop photo uploader with preview thumbnails.
 * Keeps the same data shape the original ImageUpload component and
 * useCarForm's onSubmit rely on — an array mixing File objects (uploaded on
 * submit via storageService) and already-uploaded photo objects — just with
 * richer drag/drop + hover interactions to match the onboarding's premium
 * visual language.
 */
export function ShowOffStep({ control, register, setValue }: ShowOffStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const photos: PhotoItem[] = useWatch({ control, name: "photos" }) ?? [];
  const isPublic = useWatch({ control, name: "isPublic" }) ?? true;

  const addFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const newFiles = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
    setValue("photos", [...photos, ...newFiles], { shouldValidate: true });
  };

  const removeAt = (index: number) => {
    setValue(
      "photos",
      photos.filter((_, i) => i !== index),
      { shouldValidate: true },
    );
  };

  return (
    <div className="space-y-6">
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 text-center transition-all duration-200",
          isDragging
            ? "scale-[1.01] border-primary bg-primary/5 shadow-[0_0_32px_-8px_hsl(var(--primary)/0.5)]"
            : "border-border bg-surface-1 hover:border-primary/50 hover:bg-surface-1-hover",
        )}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <div
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full transition-colors",
            isDragging ? "bg-primary/20 text-primary" : "bg-surface-2 text-text-secondary",
          )}
        >
          {isDragging ? <Upload size={26} /> : <Camera size={26} />}
        </div>
        <div>
          <p className="text-sm font-semibold text-text-primary">
            გადმოათრიე ფოტოები აქ, ან დააჭირე ასარჩევად
          </p>
          <p className="mt-1 text-xs text-text-muted">
            რამდენიმე კარგი კადრი — გარეგნობა, სალონი, ძრავი — საკმარისია დასაწყისისთვის
          </p>
        </div>
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-surface-1"
            >
              <Image
                src={getPreviewUrl(photo)}
                alt={`ფოტო ${index + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeAt(index);
                }}
                className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-error text-white opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100"
              >
                <X size={13} />
              </button>
              {index === 0 && (
                <span className="absolute bottom-1.5 left-1.5 rounded-full bg-primary/90 px-2 py-0.5 text-[10px] font-bold text-primary-foreground uppercase">
                  ყდა
                </span>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-border text-text-muted transition-colors hover:border-primary/50 hover:text-primary"
          >
            <ImagePlus size={20} />
            <span className="text-xs font-medium">კიდევ</span>
          </button>
        </div>
      )}

      {/* Description */}
      <div>
        <label className="mb-1.5 block text-xs font-bold tracking-[0.15em] text-text-secondary uppercase">
          ისტორია
        </label>
        <textarea
          rows={3}
          placeholder="მოგვიყევი შენი მანქანის შესახებ..."
          className="w-full resize-none rounded-md border border-border bg-surface-1 px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
          {...register("description")}
        />
      </div>

      {/* Public / private */}
      <div className="flex items-center justify-between rounded-lg border border-border bg-surface-1 px-4 py-3">
        <div className="flex items-center gap-2.5">
          {isPublic ? (
            <Globe size={16} className="text-primary" />
          ) : (
            <Lock size={16} className="text-text-secondary" />
          )}
          <div>
            <p className="text-xs font-semibold text-text-primary">
              {isPublic ? "საჯარო" : "პირადი"}
            </p>
            <p className="text-[11px] text-text-muted">
              {isPublic
                ? "ყველას შეუძლია ნახოს პროფილზე"
                : "მხოლოდ შენ ხედავ"}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setValue("isPublic", !isPublic, { shouldValidate: true })}
          className={cn(
            "relative h-6 w-11 shrink-0 rounded-full transition-colors",
            isPublic ? "bg-primary" : "bg-surface-2",
          )}
          aria-pressed={isPublic}
          aria-label="საჯაროობის გადართვა"
        >
          <span
            className={cn(
              "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
              isPublic ? "translate-x-[22px]" : "translate-x-0.5",
            )}
          />
        </button>
      </div>
    </div>
  );
}
