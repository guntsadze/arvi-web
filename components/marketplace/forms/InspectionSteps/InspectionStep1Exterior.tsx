"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Select, toSelectOptions } from "@/components/ui/Select";
import {
  PAINT_CONDITION_OPTIONS,
  GLASS_STATE_OPTIONS,
} from "@/types/carForm.types";
import { RatingSlider } from "@/components/ui/RatingSlider";
import { Checkbox } from "@/components/ui/Checkbox";

export const InspectionStep1Exterior: React.FC = () => {
  const { register } = useFormContext();

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-white">1. Exterior & Body</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Select
            label="საღებავის მდგომარეობა"
            options={toSelectOptions(PAINT_CONDITION_OPTIONS)}
            {...register("inspection.bodyCondition")}
          />
          <Checkbox
            label="შემჩნევადი ჟანგი"
            {...register("inspection.hasRust")}
          />
          <Checkbox
            label="ზაზორების სიმეტრია"
            {...register("inspection.panelSymmetry")}
          />
        </div>

        <div className="space-y-4">
          <Select
            label="შუშების მდგომარეობა"
            options={toSelectOptions(GLASS_STATE_OPTIONS)}
            {...register("inspection.glassCondition")}
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
