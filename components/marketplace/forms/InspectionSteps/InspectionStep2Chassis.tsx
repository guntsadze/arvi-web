"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Select, toSelectOptions } from "@/components/ui/Select";
import { SUSPENSION_STATUS_OPTIONS } from "@/types/carForm.types";
import { RatingSlider } from "@/components/ui/RatingSlider";
import { Checkbox } from "@/components/ui/Checkbox";

export const InspectionStep2Chassis: React.FC = () => {
  const { register } = useFormContext();

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-white">2. Wheels & Chassis</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Input
            label="პროტექტორის სიღრმე"
            type="number"
            placeholder="6.5"
            {...register("inspection.tireTreadDepth")}
          />
          <Input
            label="საბურავის წელი"
            type="number"
            placeholder="2023"
            {...register("inspection.tireAge")}
          />

          <Checkbox
            label="ყველა ერთნაირი საბურავი"
            {...register("inspection.tireUniformity")}
          />
        </div>

        <div className="space-y-4">
          <Input
            label="ძარის მდგომარეობა"
            placeholder="Rust-free / Reinforced"
            {...register("inspection.chassisCondition")}
          />
          <Select
            label="ამორტიზატორების მდგომარეობა"
            options={toSelectOptions(SUSPENSION_STATUS_OPTIONS)}
            {...register("inspection.suspensionStatus")}
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
