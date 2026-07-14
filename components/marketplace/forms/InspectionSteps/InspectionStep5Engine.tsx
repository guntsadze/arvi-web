"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Select, toSelectOptions } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import {
  OIL_CONDITION_OPTIONS,
  COOLANT_STATUS_OPTIONS,
  TRANSMISSION_SHIFT_OPTIONS,
  BRAKE_CONDITION_OPTIONS,
} from "@/types/carForm.types";
import { RatingSlider } from "@/components/ui/RatingSlider";
import { Checkbox } from "@/components/ui/Checkbox";

export const InspectionStep5Engine: React.FC = () => {
  const { register } = useFormContext();

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-white">
        5. Engine & Mechanical
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Select
            label="ზეთის მდგომარეობა"
            options={toSelectOptions(OIL_CONDITION_OPTIONS)}
            {...register("inspection.engineOilStatus")}
          />
          <Select
            label="გაგრილების სისტემა"
            options={toSelectOptions(COOLANT_STATUS_OPTIONS)}
            {...register("inspection.coolantStatus")}
          />
          <Input
            label="ძრავის ხმა"
            placeholder="Smooth / No Tapping"
            {...register("inspection.engineNoise")}
          />
          <Checkbox
            label="Oil Leaking"
            {...register("inspection.oilLeaking")}
          />
        </div>

        <div className="space-y-4">
          <Select
            label="გადაცემათა კოლოფის მდგომარეობა"
            options={toSelectOptions(TRANSMISSION_SHIFT_OPTIONS)}
            {...register("inspection.transmissionShift")}
          />
          <Select
            label="მუხრუჭების მდგომარეობა"
            options={toSelectOptions(BRAKE_CONDITION_OPTIONS)}
            {...register("inspection.brakeCondition")}
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
