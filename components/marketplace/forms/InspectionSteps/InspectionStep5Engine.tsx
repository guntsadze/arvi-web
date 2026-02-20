"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { RuggedSelect } from "@/components/ui/RuggedSelect";
import { RuggedInput } from "@/components/ui/RuggedInput";
import {
  OIL_CONDITION_OPTIONS,
  COOLANT_STATUS_OPTIONS,
  TRANSMISSION_SHIFT_OPTIONS,
  BRAKE_CONDITION_OPTIONS,
} from "@/types/carForm.types";
import { RatingSlider } from "@/components/ui/RatingSlider";

export const InspectionStep5Engine: React.FC = () => {
  const { register } = useFormContext();

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-white">
        5. Engine & Mechanical
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <RuggedSelect
            label="Oil Condition"
            name="inspection.engineOilStatus"
            register={register}
            options={[...OIL_CONDITION_OPTIONS]}
          />
          <RuggedSelect
            label="Coolant Status"
            name="inspection.coolantStatus"
            register={register}
            options={[...COOLANT_STATUS_OPTIONS]}
          />
          <RuggedInput
            label="Engine Acoustics"
            name="inspection.engineNoise"
            register={register}
            placeholder="Smooth / No Tapping"
          />
          <div className="flex items-center gap-4 p-4 border border-stone-800 bg-stone-900/20">
            <input
              type="checkbox"
              {...register("inspection.oilLeaking")}
              className="w-4 h-4 accent-orange-500 bg-stone-950 border-stone-800 rounded-none"
            />
            <label className="text-[10px] uppercase tracking-widest text-stone-400 font-mono">
              Oil Leaking
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <RuggedSelect
            label="Transmission Shift"
            name="inspection.transmissionShift"
            register={register}
            options={[...TRANSMISSION_SHIFT_OPTIONS]}
          />
          <RuggedSelect
            label="Brake Condition"
            name="inspection.brakeCondition"
            register={register}
            options={[...BRAKE_CONDITION_OPTIONS]}
          />
          <RatingSlider
            label="Drivetrain Performance"
            name="inspection.drivetrainPerformanceRating"
            register={register}
            description={{
              1: "Major engine/transmission issues, non-functional",
              5: "Minor wear, some noise, but functional",
              10: "Smooth, powerful, and responsive",
            }}
          />
        </div>
      </div>
    </div>
  );
};
