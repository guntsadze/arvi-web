"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { RuggedSelect } from "@/components/ui/RuggedSelect";
import { RuggedInput } from "@/components/ui/RuggedInput";
import { INTERIOR_GRADE_OPTIONS } from "@/types/carForm.types";
import { RatingSlider } from "@/components/ui/RatingSlider";

export const InspectionStep4Interior: React.FC = () => {
  const { register } = useFormContext();

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-white">
        4. Interior & Electronics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <RuggedSelect
            label="Interior Grade"
            name="inspection.interiorCondition"
            register={register}
            options={[...INTERIOR_GRADE_OPTIONS]}
          />
          <div className="flex items-center gap-4 p-4 border border-stone-800 bg-stone-900/20">
            <input
              type="checkbox"
              {...register("inspection.isSmokedIn")}
              className="w-4 h-4 accent-orange-500 bg-stone-950 border-stone-800 rounded-none"
            />
            <label className="text-[10px] uppercase tracking-widest text-stone-400 font-mono">
              Smoker Car
            </label>
          </div>
          <div className="flex items-center gap-4 p-4 border border-stone-800 bg-stone-900/20">
            <input
              type="checkbox"
              {...register("inspection.hasWaterDamage")}
              className="w-4 h-4 accent-orange-500 bg-stone-950 border-stone-800 rounded-none"
            />
            <label className="text-[10px] uppercase tracking-widest text-stone-400 font-mono">
              Water Damage
            </label>
          </div>
          <div className="flex items-center gap-4 p-4 border border-stone-800 bg-stone-900/20">
            <input
              type="checkbox"
              {...register("inspection.acFunctional")}
              className="w-4 h-4 accent-orange-500 bg-stone-950 border-stone-800 rounded-none"
            />
            <label className="text-[10px] uppercase tracking-widest text-stone-400 font-mono">
              A/C Cold
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <RuggedInput
            label="Dashboard Warnings"
            name="inspection.dashboardWarnings"
            register={register}
            placeholder="None / Clear"
          />
          <div className="flex items-center gap-4 p-4 border border-stone-800 bg-stone-900/20">
            <input
              type="checkbox"
              {...register("inspection.airbagsIntact")}
              className="w-4 h-4 accent-orange-500 bg-stone-950 border-stone-800 rounded-none"
            />
            <label className="text-[10px] uppercase tracking-widest text-stone-400 font-mono">
              Safety Systems Intact
            </label>
          </div>
          <RatingSlider
            label="Cabin Comfort & Tech"
            name="inspection.cabinComfortTechRating"
            register={register}
            description={{
              1: "Major damage, unpleasant, non-functional tech",
              5: "Average wear and tear, all essential tech functional",
              10: "Pristine, all features working perfectly",
            }}
          />
        </div>
      </div>
    </div>
  );
};
