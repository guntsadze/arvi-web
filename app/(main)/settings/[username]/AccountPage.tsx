"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Mail, Pencil, Phone, X } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { apiClient } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import type { User } from "@/types/user";
import { DangerZone } from "../DangerZone";

type ContactForm = {
  email: string;
  phone: string;
};

// Password auth doesn't exist anywhere in this system (Google + Phone OTP
// only) — the backend's UpdateAccountDto only ever accepted email/phone,
// so the password-change form this page used to render was always dead UI
// wired to fields the API silently ignored.
export default function AccountSettingsPage({ user }: { user: User }) {
  const [isEditing, setIsEditing] = useState(false);
  const [contact, setContact] = useState<{ email: string; phone: string }>({
    email: user.email ?? "",
    phone: user.phone ?? "",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ContactForm>({
    values: { email: contact.email, phone: contact.phone },
  });

  const startEditing = () => setIsEditing(true);

  const cancelEditing = () => {
    reset({ email: contact.email, phone: contact.phone });
    setIsEditing(false);
  };

  const onSubmit = async (data: ContactForm) => {
    try {
      const updated = await apiClient.patch<User>("/Users/me/account", data);
      setContact({ email: updated.email ?? "", phone: updated.phone ?? "" });
      toast.success("საკონტაქტო ინფორმაცია განახლდა!");
      setIsEditing(false);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "განახლება ვერ მოხერხდა"));
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 py-10">
      <div>
        <h1 className="text-lg font-semibold text-text-primary">
          ანგარიშის პარამეტრები
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          მართე შენი საკონტაქტო ინფორმაცია
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="glass-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text-primary">
            საკონტაქტო ინფორმაცია
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

        {isEditing ? (
          <div className="space-y-4">
            <Input
              label="იმეილი"
              required
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              label="ტელეფონის ნომერი"
              placeholder="+995 5xx xxx xxx"
              error={errors.phone?.message}
              {...register("phone")}
            />

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
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Mail size={14} className="shrink-0 text-text-muted" />
              <span className="text-text-primary">{contact.email || "—"}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone size={14} className="shrink-0 text-text-muted" />
              <span className="text-text-primary">
                {contact.phone || "დამატებული არ არის"}
              </span>
            </div>
          </div>
        )}
      </form>

      <DangerZone />
    </div>
  );
}
