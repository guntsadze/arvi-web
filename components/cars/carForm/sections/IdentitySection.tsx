"use client";
import React, { useEffect } from "react";
import {
  UseFormRegister,
  useWatch,
  Control,
  UseFormSetValue,
} from "react-hook-form";
import { RuggedInput } from "@/components/ui/RuggedInput";
import { RuggedSelect } from "@/components/ui/RuggedSelect";
import { CarFormData } from "@/types/carForm.types";
import { useCarBrands } from "@/hooks/useCarBrands";
import { useCarModels } from "@/hooks/useCarModels";

interface IdentitySectionProps {
  register: UseFormRegister<CarFormData>;
  errors: any;
  control: Control<CarFormData>;
  setValue: UseFormSetValue<CarFormData>;
  initialData?: any;
}

export const IdentitySection: React.FC<IdentitySectionProps> = ({
  register,
  errors,
  control,
  setValue,
  initialData,
}) => {
  const brands = useCarBrands();
  const selectedMake = useWatch({ control, name: "make" });
  const models = useCarModels(selectedMake);

  // brands მზადაა → make სეტავს
  useEffect(() => {
    if (brands.length > 0 && initialData?.make) {
      setValue("make", initialData.make);
    }
  }, [brands]);

  // models მზადაა → model სეტავს
  useEffect(() => {
    if (models.length > 0 && initialData?.model) {
      setValue("model", initialData.model);
    }
  }, [models]);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <RuggedSelect
        label="მარკა"
        name="make"
        register={register}
        options={brands}
        error={errors.make}
      />

      <RuggedSelect
        label="მოდელი"
        name="model"
        register={register}
        required
        options={models}
        disabled={!selectedMake || models.length === 0}
        placeholder={!selectedMake ? "ჯერ აირჩიეთ მარკა" : "აირჩიეთ მოდელი"}
        error={errors.model}
      />

      <RuggedInput
        label="წელი"
        name="year"
        type="number"
        register={register}
        required
        placeholder="1998"
        error={errors.year}
        hint={`1900 – ${new Date().getFullYear()}`}
        rules={{
          valueAsNumber: true,

          min: {
            value: 1900,
            message: "ავტომობილის წელი არ უნდა იყოს 1900-ზე ნაკლები",
          },
        }}
      />

      <RuggedInput
        label="ზედმეტსახელი (სურვილისამებრ)"
        name="nickname"
        register={register}
        placeholder="The Beast"
      />
    </div>
  );
};
