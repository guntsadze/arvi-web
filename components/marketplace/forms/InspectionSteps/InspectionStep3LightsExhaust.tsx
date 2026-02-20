"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { RuggedSelect } from "@/components/ui/RuggedSelect";
import {
  EXHAHAUST_CONDITION_OPTIONS,
  EXHAUST_CONDITION_OPTIONS,
} from "@/types/carForm.types";
import { RatingSlider } from "@/components/ui/RatingSlider";

export const InspectionStep3LightsExhaust: React.FC = () => {
  const { register } = useFormContext();

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-white">3. Lights & Exhaust</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 border border-stone-800 bg-stone-900/20">
            <input
              type="checkbox"
              {...register("inspection.lightsFunctional")}
              className="w-4 h-4 accent-orange-500 bg-stone-950 border-stone-800 rounded-none"
            />
            <label className="text-[10px] uppercase tracking-widest text-stone-400 font-mono">
              Lights Functional
            </label>
          </div>
          <RuggedSelect
            label="Exhaust Condition"
            name="inspection.exhaustCondition"
            register={register}
            options={[...EXHAHAUST_CONDITION_OPTIONS]}
          />
          <div className="flex items-center gap-4 p-4 border border-stone-800 bg-stone-900/20">
            <input
              type="checkbox"
              {...register("inspection.catalystPresent")}
              className="w-4 h-4 accent-orange-500 bg-stone-950 border-stone-800 rounded-none"
            />
            <label className="text-[10px] uppercase tracking-widest text-stone-400 font-mono">
              Catalyst Present
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <RatingSlider
            label="Lighting & Emissions Rating"
            name="inspection.lightsExhaustRating"
            register={register}
            description={{
              1: "Major failures, unsafe for road",
              5: "Minor issues, functional but not optimal",
              10: "All systems fully functional and compliant",
            }}
          />
        </div>
      </div>
    </div>
  );
};
