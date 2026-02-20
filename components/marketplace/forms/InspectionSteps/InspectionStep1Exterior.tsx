"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { RuggedSelect } from "@/components/ui/RuggedSelect";
import {
  PAINT_CONDITION_OPTIONS,
  GLASS_STATE_OPTIONS,
} from "@/types/carForm.types";
import { RatingSlider } from "@/components/ui/RatingSlider";
import { RuggedCheckbox } from "@/components/ui/RuggedCheckbox";

export const InspectionStep1Exterior: React.FC = () => {
  const { register } = useFormContext();

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-white">1. Exterior & Body</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <RuggedSelect
            label="საღებავის მდგომარეობა"
            name="inspection.bodyCondition"
            register={register}
            options={[...PAINT_CONDITION_OPTIONS]}
          />
          <RuggedCheckbox
            name="inspection.hasRust"
            register={register}
            label="შემჩნევადი ჟანგი"
          />
          <RuggedCheckbox
            name="inspection.panelSymmetry"
            register={register}
            label="ზაზორების სიმეტრია"
          />
        </div>

        <div className="space-y-4">
          <RuggedSelect
            label="შუშების მდგომარეობა"
            name="inspection.glassCondition"
            register={register}
            options={[...GLASS_STATE_OPTIONS]}
          />
          {/* Rating for Exterior Visual Appeal */}
          <RatingSlider
            label="ექსტერიერის მდგომარეობა"
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
