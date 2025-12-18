import React from "react";
import { UseFormRegister } from "react-hook-form";
import { RuggedInput } from "@/components/ui/RuggedInput";
import { CarFormData } from "@/types/carForm.types";

interface RegistrationSectionProps {
  register: UseFormRegister<CarFormData>;
}

export const RegistrationSection: React.FC<RegistrationSectionProps> = ({
  register,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <RuggedInput
      label="VIN / Chassis Code"
      name="vin"
      register={register}
      placeholder="WBS..."
    />
    <RuggedInput
      label="License Plate"
      name="licensePlate"
      register={register}
      placeholder="GA-000-GE"
    />
    <div className="grid grid-cols-2 gap-4">
      <RuggedInput
        label="Color"
        name="color"
        register={register}
        placeholder="Techno Violet"
      />
      <RuggedInput
        label="Mileage (KM)"
        name="mileage"
        type="number"
        register={register}
        placeholder="150000"
      />
    </div>
  </div>
);
