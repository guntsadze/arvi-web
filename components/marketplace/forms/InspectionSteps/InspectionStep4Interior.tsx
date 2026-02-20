"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { RuggedSelect } from "@/components/ui/RuggedSelect";
import { RuggedInput } from "@/components/ui/RuggedInput";
import { INTERIOR_GRADE_OPTIONS } from "@/types/carForm.types";
import { RatingSlider } from "@/components/ui/RatingSlider";
import { RuggedCheckbox } from "@/components/ui/RuggedCheckbox";

export const InspectionStep4Interior: React.FC = () => {
  const { register } = useFormContext();

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-white">
        4. Interior & Electronics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <RuggedSelect
            label="ინტერიერის შეფასება"
            name="inspection.interiorCondition"
            register={register}
            options={[...INTERIOR_GRADE_OPTIONS]}
          />

          <RuggedCheckbox
            name="inspection.isSmokedIn"
            register={register}
            label="არამწევლის მანქანა"
          />
          <RuggedCheckbox
            name="inspection.hasWaterDamage"
            register={register}
            label="წყლის ლაქების კვალი"
          />
          <RuggedCheckbox
            name="inspection.acFunctional"
            register={register}
            label="A/C მდგომარეობა"
          />
        </div>

        <div className="space-y-4">
          <RuggedInput
            label="მაჩვენებელთა დაფის შეცდომები"
            name="inspection.dashboardWarnings"
            register={register}
            placeholder="None / Clear"
          />
          <RuggedCheckbox
            name="inspection.airbagsIntact"
            register={register}
            label="აირბაგის სისტემა"
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
