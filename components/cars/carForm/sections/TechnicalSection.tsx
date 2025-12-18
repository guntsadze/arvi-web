import React from "react";
import { UseFormRegister } from "react-hook-form";
import { RuggedInput } from "@/components/ui/RuggedInput";
import { RuggedSelect } from "@/components/ui/RuggedSelect";
import {
  FUEL_TYPES,
  TRANSMISSION_TYPES,
  DRIVE_TYPES,
  BODY_TYPES,
} from "@/constants/carOptions";
import { CarFormData } from "@/types/carForm.types";

interface TechnicalSectionProps {
  register: UseFormRegister<CarFormData>;
}

export const TechnicalSection: React.FC<TechnicalSectionProps> = ({
  register,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="space-y-6">
      <RuggedInput
        label="Engine Code/Size"
        name="engine"
        register={register}
        placeholder="S50B30 / 3.0L"
      />
      <RuggedSelect
        label="Fuel Type"
        name="fuelType"
        register={register}
        options={[...FUEL_TYPES]}
      />
    </div>
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <RuggedInput
          label="Horsepower"
          name="horsepower"
          type="number"
          register={register}
          placeholder="286"
        />
        <RuggedInput
          label="Torque (NM)"
          name="torque"
          type="number"
          register={register}
          placeholder="320"
        />
      </div>
      <RuggedSelect
        label="Transmission"
        name="transmission"
        register={register}
        options={[...TRANSMISSION_TYPES]}
      />
    </div>
    <div className="space-y-6">
      <RuggedSelect
        label="Drive Layout"
        name="driveType"
        register={register}
        options={[...DRIVE_TYPES]}
      />
      <RuggedSelect
        label="Body Style"
        name="bodyType"
        register={register}
        options={[...BODY_TYPES]}
      />
    </div>
  </div>
);
