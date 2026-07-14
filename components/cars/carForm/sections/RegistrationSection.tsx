import React from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { CarFormData } from "@/types/carForm.types";

interface RegistrationSectionProps {
  register: UseFormRegister<CarFormData>;
  errors: FieldErrors<CarFormData>;
}

export const RegistrationSection: React.FC<RegistrationSectionProps> = ({
  register,
  errors,
}) => {
  const licensePlateField = register("licensePlate", {
    pattern: {
      value: /^[A-Za-zა-ჰ]{2}-\d{3}-[A-Za-zა-ჰ]{2}$/,
      message: "სანომრე ნიშანი უნდა იყოს ფორმატში: XX-000-XX",
    },
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Input label="VIN კოდი" placeholder="WBS..." {...register("vin")} />
      <Input
        label="სახელმწიფო ნომერი"
        placeholder="GA-000-GE"
        error={errors.licensePlate?.message}
        helperText="ფორმატი: XX-000-XX"
        {...licensePlateField}
        onChange={(e) => {
          let value = e.target.value
            .toUpperCase()
            .replace(/[^A-ZА-ЯᲐ-Ჿ0-9]/g, "");
          if (value.length > 2) value = value.slice(0, 2) + "-" + value.slice(2);
          if (value.length > 6) value = value.slice(0, 6) + "-" + value.slice(6);
          if (value.length > 9) value = value.slice(0, 9);
          e.target.value = value;
          licensePlateField.onChange(e);
        }}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="ფერი"
          placeholder="Techno Violet"
          {...register("color")}
        />
        <Input
          label="გარბენი (კმ)"
          type="number"
          placeholder="150000"
          {...register("mileage")}
        />
      </div>
    </div>
  );
};
