import React from "react";
import { UseFormRegister } from "react-hook-form";
import { RuggedTextarea } from "@/components/ui/RuggedTextarea";
import { ImageUpload } from "../shared/ImageUpload";
import { CarFormData } from "@/types/carForm.types";

interface DescriptionSectionProps {
  register: UseFormRegister<CarFormData>;
}

export const DescriptionSection: React.FC<DescriptionSectionProps> = ({
  register,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    <div className="md:col-span-2">
      <RuggedTextarea
        label="Vehicle Description / Build Story"
        name="description"
        register={register}
        placeholder="Describe modifications, history, and restoration details..."
        rows={6}
      />
    </div>
    <ImageUpload />
  </div>
);
