"use client";
import { useForm } from "react-hook-form";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/store/slices/userSlice";
import { RuggedInput } from "@/components/ui/RuggedInput";
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
      <div className="mb-5 pb-3 border-b border-stone-900">
        <p className="text-[8px] uppercase tracking-widest text-amber-600 font-mono mb-1">
          // account
        </p>
        <h1 className="text-base font-medium text-[#EBE9E1]">
          Account settings
        </h1>
        <p className="text-[11px] text-[#EBE9E1] font-mono mt-0.5">
          email, phone, password
        </p>
      </div>

      <p className="text-[8px] uppercase tracking-[.14em] text-[#EBE9E1] font-mono mb-3">
        // credentials
      </p>

      <RuggedInput
        label="Email address"
        name="email"
        register={register}
        required
        placeholder="you@example.com"
        error={errors.email}
      />
      <RuggedInput
        label="Phone number"
        name="phone"
        register={register}
        placeholder="+995 5xx xxx xxx"
        error={errors.phone}
      />

      <div className="mt-6 mb-3 border-t border-stone-900 pt-5">
        <p className="text-[8px] uppercase tracking-[.14em] text-[#EBE9E1] font-mono mb-3">
          // change password
        </p>
      </div>

      <RuggedInput
        label="Current password"
        name="currentPassword"
        type="password"
        register={register}
        placeholder="••••••••"
        error={errors.currentPassword}
      />

      <div className="grid grid-cols-2 gap-3">
        <RuggedInput
          label="New password"
          name="newPassword"
          type="password"
          register={register}
          placeholder="••••••••"
          error={errors.newPassword}
        />
        <RuggedInput
          label="Confirm password"
          name="confirmPassword"
          type="password"
          register={register}
          placeholder="••••••••"
          error={errors.confirmPassword}
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
