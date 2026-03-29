"use client";
import React, { useEffect, useState } from "react";
import { BackgroundGrid } from "@/components/ui/BackgroundGrid";
import { FormHeader } from "./shared/FormHeader";
import { FormSection } from "./shared/FormSection";
import { FormActions } from "./shared/FormActions";
import { IdentitySection } from "./sections/IdentitySection";
import { TechnicalSection } from "./sections/TechnicalSection";
import { RegistrationSection } from "./sections/RegistrationSection";
import { DescriptionSection } from "./sections/DescriptionSection";
import { ClassificationSection } from "./sections/ClassificationSection";
import { useCarForm } from "@/hooks/useCarForm";
import { CarFormProps } from "@/types/carForm.types";
import { MaintenanceSection } from "./sections/MaintenanceSection";
import { ModificationsSection } from "./sections/ModificationsSection";

export const CarForm: React.FC<CarFormProps> = ({
  onClose,
  initialData,
  onSuccess,
}) => {
  const {
    register,
    control,
    onSubmit,
    handleDelete,
    formState: { errors },
    isSubmitting,
    // isEditing,
  } = useCarForm({
    initialData,
    onSuccess,
    onClose,
  });

  const isEditing = Boolean(initialData?.id);
  console.log("useCarForm rendered, initialData:", initialData);

  // ბლოკავს ძირითადი გვერდის სქროლს, როცა ფორმა ღიაა
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-[#1c1917] z-[60] overflow-y-auto">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <BackgroundGrid />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto py-10 px-4 min-h-screen">
        <FormHeader isEditing={isEditing} onClose={onClose} />

        <form onSubmit={onSubmit} className="space-y-16 pb-24">
          <IdentitySection register={register} errors={errors} />

          {/* Existing Sections */}
          <div className="space-y-6">
            <FormSection title="Technical Specifications" />
            <TechnicalSection register={register} />
          </div>

          {/* Registration */}
          <div className="space-y-6">
            <FormSection title="Registration & Details" />
            <RegistrationSection register={register} />
          </div>

          <div className="space-y-6">
            <FormSection title="Manifest & Visuals" />
            <DescriptionSection register={register} control={control} />
          </div>

          <div className="space-y-6">
            <FormSection title="System Classification" />
            <ClassificationSection register={register} />
          </div>

          {/* --- NEW: Modifications --- */}
          <div className="py-8 border-t border-stone-800/50">
            <ModificationsSection control={control} register={register} />
          </div>

          {/* --- NEW: Maintenance --- */}
          <div className="py-8 border-t border-stone-800/50">
            <MaintenanceSection control={control} register={register} />
          </div>

          <div className="pt-10 border-t border-stone-800">
            <FormActions
              isSubmitting={isSubmitting}
              isEditing={isEditing}
              onCancel={onClose}
            />

            <button
              type="button"
              onClick={handleDelete}
              className="px-6 py-3 bg-stone-900/50 hover:bg-red-950/30 text-red-400 
                      border border-stone-800 hover:border-red-900/50 
                      font-mono text-xs uppercase tracking-wider
                      transition-all duration-300
                      disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Delete Vehicle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
