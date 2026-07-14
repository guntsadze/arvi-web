"use client";
import React, { useEffect } from "react";
import {
  FieldErrors,
  UseFormRegister,
  useWatch,
  Control,
  UseFormSetValue,
} from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { CarFormData } from "@/types/carForm.types";
import { useCarBrands } from "@/hooks/useCarBrands";
import { useCarModels } from "@/hooks/useCarModels";

interface IdentitySectionProps {
  register: UseFormRegister<CarFormData>;
  errors: FieldErrors<CarFormData>;
  control: Control<CarFormData>;
  setValue: UseFormSetValue<CarFormData>;
  initialData?: Partial<CarFormData>;
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
  const yearField = register("year", {
    valueAsNumber: true,
    min: {
      value: 1900,
      message: "ავტომობილის წელი არ უნდა იყოს 1900-ზე ნაკლები",
    },
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Select
        label="მარკა"
        options={brands}
        error={errors.make?.message}
        {...register("make")}
      />

      <Select
        label="მოდელი"
        required
        options={models}
        disabled={!selectedMake || models.length === 0}
        placeholder={!selectedMake ? "ჯერ აირჩიეთ მარკა" : "აირჩიეთ მოდელი"}
        error={errors.model?.message}
        {...register("model")}
      />

      <Input
        label="წელი"
        type="number"
        required
        placeholder="1998"
        error={errors.year?.message}
        helperText={`1900 – ${new Date().getFullYear()}`}
        {...yearField}
      />

      <Input
        label="ზედმეტსახელი (სურვილისამებრ)"
        placeholder="The Beast"
        {...register("nickname")}
      />
    </div>
  );
};
