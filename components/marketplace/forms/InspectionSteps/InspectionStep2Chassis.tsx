"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { RuggedInput } from "@/components/ui/RuggedInput";
import { RuggedSelect } from "@/components/ui/RuggedSelect";
import { SUSPENSION_STATUS_OPTIONS } from "@/types/carForm.types";
import { RatingSlider } from "@/components/ui/RatingSlider";
import { RuggedCheckbox } from "@/components/ui/RuggedCheckbox";

export const InspectionStep2Chassis: React.FC = () => {
  const { register } = useFormContext();

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-white">2. Wheels & Chassis</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <RuggedInput
            label="პროტექტორის სიღრმე"
            name="inspection.tireTreadDepth"
            type="number"
            register={register}
            placeholder="6.5"
          />
          <RuggedInput
            label="საბურავის წელი"
            name="inspection.tireAge"
            type="number"
            register={register}
            placeholder="2023"
          />

          <RuggedCheckbox
            name="inspection.tireUniformity"
            register={register}
            label="ყველა ერთნაირი საბურავი"
          />
        </div>

        <div className="space-y-4">
          <RuggedInput
            label="ძარის მდგომარეობა"
            name="inspection.chassisCondition"
            register={register}
            placeholder="Rust-free / Reinforced"
          />
          <RuggedSelect
            label="ამორტიზატორების მდგომარეობა"
            name="inspection.suspensionStatus"
            register={register}
            options={[...SUSPENSION_STATUS_OPTIONS]}
          />
          <RatingSlider
            label="ძარის ჯამური მდგომარეობა"
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
