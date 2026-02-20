"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { RuggedInput } from "@/components/ui/RuggedInput";
import { RuggedSelect } from "@/components/ui/RuggedSelect";
import { SUSPENSION_STATUS_OPTIONS } from "@/types/carForm.types";
import { RatingSlider } from "@/components/ui/RatingSlider";

export const InspectionStep2Chassis: React.FC = () => {
  const { register } = useFormContext();

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-white">2. Wheels & Chassis</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <RuggedInput
            label="Tread Depth (mm)"
            name="inspection.tireTreadDepth"
            type="number"
            register={register}
            placeholder="6.5"
            step="0.1"
          />
          <RuggedInput
            label="Tire Year"
            name="inspection.tireAge"
            type="number"
            register={register}
            placeholder="2023"
          />
          <div className="flex items-center gap-4 p-4 border border-stone-800 bg-stone-900/20">
            <input
              type="checkbox"
              {...register("inspection.tireUniformity")}
              className="w-4 h-4 accent-orange-500 bg-stone-950 border-stone-800 rounded-none"
            />
            <label className="text-[10px] uppercase tracking-widest text-stone-400 font-mono">
              Uniform Tire Set
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <RuggedInput
            label="Chassis Notes"
            name="inspection.chassisCondition"
            register={register}
            placeholder="Rust-free / Reinforced"
          />
          <RuggedSelect
            label="Suspension Status"
            name="inspection.suspensionStatus"
            register={register}
            options={[...SUSPENSION_STATUS_OPTIONS]}
          />
          <RatingSlider
            label="Chassis Structural Integrity"
            name="inspection.chassisStructuralRating"
            register={register}
            description={{
              1: "Severe rust/damage, unsafe",
              5: "Minor rust/cosmetic defects",
              10: "Perfect condition, no rust",
            }}
          />
        </div>
      </div>
    </div>
  );
};
