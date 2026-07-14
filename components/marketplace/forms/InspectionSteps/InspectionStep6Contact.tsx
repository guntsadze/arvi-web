"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

export const InspectionStep6Contact: React.FC = () => {
  const { register } = useFormContext();

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Price */}
        <Input label="ფასი" {...register("price")} />

        {/* Location */}
        <Input label="ლოკაცია" {...register("location")} />

        {/* Phone */}
        <Input label="ტელეფონი" {...register("phone")} />
        <Input label="ელ-ფოსტა" {...register("email")} />

        {/* Description */}
        <Textarea
          label="დამატებითი აღწერა"
          className="md:col-span-2"
          {...register("description")}
        />
      </div>
    </div>
  );
};
