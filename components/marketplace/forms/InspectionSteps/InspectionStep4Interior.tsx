"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Select, toSelectOptions } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { INTERIOR_GRADE_OPTIONS } from "@/types/carForm.types";
import { RatingSlider } from "@/components/ui/RatingSlider";
import { Checkbox } from "@/components/ui/Checkbox";

export const InspectionStep4Interior: React.FC = () => {
  const { register } = useFormContext();

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-white">
        4. Interior & Electronics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Select
            label="ინტერიერის შეფასება"
            options={toSelectOptions(INTERIOR_GRADE_OPTIONS)}
            {...register("inspection.interiorCondition")}
          />

          <Checkbox
            label="არამწევლის მანქანა"
            {...register("inspection.isSmokedIn")}
          />
          <Checkbox
            label="წყლის ლაქების კვალი"
            {...register("inspection.hasWaterDamage")}
          />
          <Checkbox
            label="A/C მდგომარეობა"
            {...register("inspection.acFunctional")}
          />
        </div>

        <div className="space-y-4">
          <Input
            label="მაჩვენებელთა დაფის შეცდომები"
            placeholder="None / Clear"
            {...register("inspection.dashboardWarnings")}
          />
          <Checkbox
            label="აირბაგის სისტემა"
            {...register("inspection.airbagsIntact")}
          />

          <RatingSlider
            label="კომფორტის შეჯამება"
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
