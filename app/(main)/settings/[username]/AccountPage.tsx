"use client";
import { useForm } from "react-hook-form";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/store/slices/userSlice";
import { Input } from "@/components/ui/Input";
import { SaveRow } from "@/components/settings/SaveRow";
import { apiClient } from "@/lib/api";
import { DangerZone } from "../DangerZone";

type AccountForm = {
  email: string;
  phone: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function AccountSettingsPage({ user }: { user: any }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<AccountForm>({
    defaultValues: {
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: AccountForm) => {
    if (data.newPassword && data.newPassword !== data.confirmPassword) return;
    await apiClient.patch("/users/me/account", data);
  };

  return (
    <form className="max-w-2xl mx-auto pt-10" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-5 pb-3 border-b border-border">
        <p className="text-[8px] uppercase tracking-widest text-accent font-mono mb-1">
          // account
        </p>
        <h1 className="text-base font-medium text-text-primary">
          Account settings
        </h1>
        <p className="text-[11px] text-text-primary font-mono mt-0.5">
          email, phone, password
        </p>
      </div>

      <p className="text-[8px] uppercase tracking-[.14em] text-text-primary font-mono mb-3">
        // credentials
      </p>

      <Input
        label="Email address"
        required
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        label="Phone number"
        placeholder="+995 5xx xxx xxx"
        error={errors.phone?.message}
        {...register("phone")}
      />

      <div className="mt-6 mb-3 border-t border-border pt-5">
        <p className="text-[8px] uppercase tracking-[.14em] text-text-primary font-mono mb-3">
          // change password
        </p>
      </div>

      <Input
        label="Current password"
        type="password"
        placeholder="••••••••"
        error={errors.currentPassword?.message}
        {...register("currentPassword")}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="New password"
          type="password"
          placeholder="••••••••"
          error={errors.newPassword?.message}
          {...register("newPassword")}
        />
        <Input
          label="Confirm password"
          type="password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
      </div>

      <DangerZone />

      <SaveRow
        isDirty={isDirty}
        isSubmitting={isSubmitting}
        fn="save_account()"
        hint="// changes may require re-login"
      />
    </form>
  );
}
