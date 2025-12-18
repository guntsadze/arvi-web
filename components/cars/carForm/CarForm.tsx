"use client";
import React from "react";
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

export const CarForm: React.FC<CarFormProps> = ({
  onClose,
  onCarSaved,
  initialData,
}) => {
  const {
    register,
    onSubmit,
    formState: { errors },
    isSubmitting,
    isEditing,
  } = useCarForm({
    initialData,
    onSuccess: onCarSaved,
    onClose,
  });

  return (
    <div className="fixed inset-0 bg-[#1c1917] z-50">
      <BackgroundGrid />

      <div className="relative z-10 max-w-5xl mx-auto min-h-screen py-10 px-4">
        <FormHeader isEditing={isEditing} onClose={onClose} />

        <form onSubmit={onSubmit} className="space-y-8 pb-20">
          {/* Identity */}
          <IdentitySection register={register} errors={errors} />

          {/* Technical Specs */}
          <FormSection title="Technical Specifications" />
          <TechnicalSection register={register} />

          {/* Registration */}
          <FormSection title="Registration & Details" />
          <RegistrationSection register={register} />

          {/* Description & Images */}
          <FormSection title="Manifest & Visuals" />
          <DescriptionSection register={register} />

          {/* Classification */}
          <FormSection title="System Classification" />
          <ClassificationSection register={register} />

          {/* Actions */}
          <FormActions
            isSubmitting={isSubmitting}
            isEditing={isEditing}
            onCancel={onClose}
          />
        </form>
      </div>

      {/* Scanning Line Effect */}
      <div className="fixed top-0 left-0 w-full h-1 bg-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.3)] animate-scan opacity-20 pointer-events-none z-0" />
    </div>
  );
};
