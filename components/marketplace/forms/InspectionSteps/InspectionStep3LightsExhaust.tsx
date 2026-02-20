"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { RuggedSelect } from "@/components/ui/RuggedSelect";
import {
  EXHAHAUST_CONDITION_OPTIONS,
  EXHAUST_CONDITION_OPTIONS,
} from "@/types/carForm.types";
import { RatingSlider } from "@/components/ui/RatingSlider";
import { RuggedCheckbox } from "@/components/ui/RuggedCheckbox";

export const InspectionStep3LightsExhaust: React.FC = () => {
  const { register } = useFormContext();

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-white">3. Lights & Exhaust</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <RuggedCheckbox
            name="inspection.lightsFunctional"
            register={register}
            label="ნათურების მდგომარეობა"
          />
          <RuggedCheckbox
            name="inspection.catalystPresent"
            register={register}
            label="კატალიზატორი?"
          />
          <RuggedSelect
            label="გამონაბოლქვი"
            name="inspection.exhaustCondition"
            register={register}
            options={[...EXHAHAUST_CONDITION_OPTIONS]}
          />
        </div>

        <div className="space-y-4">
          <RatingSlider
            label="განათების & გამონაბოლქვის შეჯამება"
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
