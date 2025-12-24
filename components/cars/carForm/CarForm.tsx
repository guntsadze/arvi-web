"use client";
import React, { useEffect } from "react";
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
  initialData,
  onSuccess,
}) => {
  const {
    register,
    control,
    onSubmit,
    formState: { errors },
    isSubmitting,
    isEditing,
  } = useCarForm({
    initialData,
    onSuccess,
    onClose,
  });

  // ბლოკავს ძირითადი გვერდის სქროლს, როცა ფორმა ღიაა
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-[#1c1917] z-[60] overflow-y-auto scrollbar-hide">
      {/* BackgroundGrid-ს ვსვამთ აბსოლუტურად, რომ მთელ სქროლვად სიმაღლეზე გაჰყვეს */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <BackgroundGrid />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto py-10 px-4 min-h-screen flex flex-col">
        <FormHeader isEditing={isEditing} onClose={onClose} />

        <form onSubmit={onSubmit} className="space-y-12 pb-24 flex-grow">
          {/* Identity */}
          <IdentitySection register={register} errors={errors} />

          {/* Technical Specs */}
          <div className="space-y-6">
            <FormSection title="Technical Specifications" />
            <TechnicalSection register={register} />
          </div>

          {/* Registration */}
          <div className="space-y-6">
            <FormSection title="Registration & Details" />
            <RegistrationSection register={register} />
          </div>

          {/* Description & Images */}
          <div className="space-y-6">
            <FormSection title="Manifest & Visuals" />
            <DescriptionSection register={register} control={control} />
          </div>

          {/* Classification */}
          <div className="space-y-6">
            <FormSection title="System Classification" />
            <ClassificationSection register={register} />
          </div>

          {/* Actions */}
          <div className="pt-10 border-t border-stone-800">
            <FormActions
              isSubmitting={isSubmitting}
              isEditing={isEditing}
              onCancel={onClose}
            />
          </div>
        </form>
      </div>
    </div>
  );
};
