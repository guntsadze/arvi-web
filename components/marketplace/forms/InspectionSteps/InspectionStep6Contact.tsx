"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { RuggedInput } from "@/components/ui/RuggedInput";
import { RuggedTextArea } from "@/components/ui/RuggedTextArea";

export const InspectionStep6Contact: React.FC = () => {
  const { register } = useFormContext();

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Price */}
        <RuggedInput label="ფასი" name="price" register={register} />

        {/* Location */}
        <RuggedInput label="ლოკაცია" name="location" register={register} />

        {/* Phone */}
        <RuggedInput label="ტელეფონი" name="phone" register={register} />
        <RuggedInput label="ელ-ფოსტა" name="email" register={register} />

        {/* Description */}
        <RuggedTextArea
          label="დამატებითი აღწერა"
          name="description"
          register={register}
          className="md:col-span-2"
        />
      </div>
    </div>
  );
};
