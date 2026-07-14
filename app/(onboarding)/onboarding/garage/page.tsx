"use client";

import { useRouter } from "next/navigation";
import { Car } from "lucide-react";

import { useCarForm } from "@/hooks/useCarForm";
import { IdentitySection } from "@/components/cars/carForm/sections/IdentitySection";
import { FormActions } from "@/components/cars/carForm/shared/FormActions";

/**
 * Post-signup, single-step trimmed version of the full car-creation form
 * (components/cars/carForm/CarForm.tsx) — vehicle basics only (make/model/
 * year/nickname via IdentitySection), reusing useCarForm for submission
 * logic rather than rebuilding it. Prominent skip affordance since adding a
 * car is optional at signup. Also reachable as a normal authenticated page
 * outside the signup moment (e.g. from the empty-garage CTA on /feed).
 */
export default function OnboardingGaragePage() {
  const router = useRouter();
  const goToFeed = () => router.push("/feed");

  const {
    register,
    control,
    setValue,
    formState: { errors, isSubmitting },
    onSubmit,
  } = useCarForm({
    onClose: goToFeed,
    onSuccess: goToFeed,
  });

  return (
    <div className="w-full max-w-2xl py-12">
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={goToFeed}
          className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
        >
          გამოტოვება / მოგვიანებით დამატება →
        </button>
      </div>

      <div className="rounded-xl border border-border bg-surface-1 p-8 shadow-2xl shadow-black/30">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
            <Car size={22} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-text-primary">
              დაამატე შენი პირველი ავტომობილი
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              შეგიძლია დეტალები მოგვიანებითაც შეავსო
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-8">
          <IdentitySection
            register={register}
            errors={errors}
            control={control}
            setValue={setValue}
          />

          <FormActions
            isSubmitting={isSubmitting}
            isEditing={false}
            onCancel={goToFeed}
          />
        </form>
      </div>
    </div>
  );
}
