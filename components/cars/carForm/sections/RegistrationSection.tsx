import React from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { RuggedInput } from "@/components/ui/RuggedInput";
import { CarFormData } from "@/types/carForm.types";

interface RegistrationSectionProps {
  register: UseFormRegister<CarFormData>;
  errors: FieldErrors<CarFormData>;
}

export const RegistrationSection: React.FC<RegistrationSectionProps> = ({
  register,
  errors,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <RuggedInput
        label="VIN კოდი"
        name="vin"
        register={register}
        placeholder="WBS..."
      />
      <RuggedInput
        label="სახელმწიფო ნომერი"
        name="licensePlate"
        register={register}
        placeholder="GA-000-GE"
        error={errors.licensePlate}
        hint="ფორმატი: XX-000-XX"
        uppercase
        autoFormat
        rules={{
          pattern: {
            value: /^[A-Za-zა-ჰ]{2}-\d{3}-[A-Za-zა-ჰ]{2}$/,
            message: "სანომრე ნიშანი უნდა იყოს ფორმატში: XX-000-XX",
          },
        }}
      />
      <div className="grid grid-cols-2 gap-4">
        <RuggedInput
          label="ფერი"
          name="color"
          register={register}
          placeholder="Techno Violet"
        />
        <RuggedInput
          label="გარბენი (კმ)"
          name="mileage"
          type="number"
          register={register}
          placeholder="150000"
        />
      </div>
    </div>
  );
};
