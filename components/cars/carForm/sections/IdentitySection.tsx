import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { RuggedInput } from "@/components/ui/RuggedInput";
import { CarFormData } from "@/types/carForm.types";
interface IdentitySectionProps {
  register: UseFormRegister<CarFormData>;
  errors: FieldErrors<CarFormData>;
}

export const IdentitySection: React.FC<IdentitySectionProps> = ({
  register,
  errors,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <RuggedInput
      label="Manufacturer"
      name="make"
      register={register}
      required
      placeholder="BMW"
      error={errors.make}
    />
    <RuggedInput
      label="Model"
      name="model"
      register={register}
      required
      placeholder="M3"
      error={errors.model}
    />
    <RuggedInput
      label="Year"
      name="year"
      type="number"
      register={register}
      required
      placeholder="1998"
      error={errors.year}
    />
    <RuggedInput
      label="Nickname (Optional)"
      name="nickname"
      register={register}
      placeholder="The Beast"
    />
  </div>
);
