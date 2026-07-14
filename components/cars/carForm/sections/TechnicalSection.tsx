import React from "react";
import { UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
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
      <Input
        label="ძრავის კოიდი / მოცულობა"
        placeholder="S50B30 / 3.0L"
        {...register("engine")}
      />
      <Select
        label="საწვავის ტიპი"
        options={[...FUEL_TYPES]}
        {...register("fuelType")}
      />
    </div>
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="ცხენისძალა"
          type="number"
          placeholder="286"
          {...register("horsepower")}
        />
        <Input
          label="ნიუტონი"
          type="number"
          placeholder="320"
          {...register("torque")}
        />
      </div>
      <Select
        label="გადაცემათა კოლოფი"
        options={[...TRANSMISSION_TYPES]}
        {...register("transmission")}
      />
    </div>
    <div className="space-y-6">
      <Select
        label="წამყვანი თვლები"
        options={[...DRIVE_TYPES]}
        {...register("driveType")}
      />
      <Select
        label="ძარის ტიპი"
        options={[...BODY_TYPES]}
        {...register("bodyType")}
      />
    </div>
  </div>
);
