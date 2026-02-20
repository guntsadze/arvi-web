"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { RuggedSelect } from "@/components/ui/RuggedSelect";
import { RuggedInput } from "@/components/ui/RuggedInput";
import {
  PAINT_CONDITION_OPTIONS,
  GLASS_STATE_OPTIONS,
} from "@/types/carForm.types";
import { RatingSlider } from "@/components/ui/RatingSlider";

export const InspectionStep1Exterior: React.FC = () => {
  const { register } = useFormContext();

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-white">1. Exterior & Body</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <RuggedSelect
            label="Paint Condition"
            name="inspection.bodyCondition"
            register={register}
            options={[...PAINT_CONDITION_OPTIONS]}
          />
          <div className="flex items-center gap-4 p-4 border border-stone-800 bg-stone-900/20">
            <input
              type="checkbox"
              {...register("inspection.hasRust")}
              className="w-4 h-4 accent-orange-500 bg-stone-950 border-stone-800 rounded-none"
            />
            <label className="text-[10px] uppercase tracking-widest text-stone-400 font-mono">
              Visible Rust
            </label>
          </div>
          <div className="flex items-center gap-4 p-4 border border-stone-800 bg-stone-900/20">
            <input
              type="checkbox"
              {...register("inspection.panelSymmetry")}
              className="w-4 h-4 accent-orange-500 bg-stone-950 border-stone-800 rounded-none"
            />
            <label className="text-[10px] uppercase tracking-widest text-stone-400 font-mono">
              Symmetric Panels
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <RuggedSelect
            label="Glass State"
            name="inspection.glassCondition"
            register={register}
            options={[...GLASS_STATE_OPTIONS]}
          />
          {/* Rating for Exterior Visual Appeal */}
          <RatingSlider
            label="Exterior Visual Appeal"
            name="inspection.exteriorVisualRating"
            register={register}
            description={{
              1: "Heavy damage, many scratches/dents",
              5: "Average condition, minor scratches/wear",
              10: "Excellent, like new",
            }}
          />
        </div>
      </div>
    </div>
  );
};
