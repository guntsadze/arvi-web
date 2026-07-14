import React from "react";
import { UseFormRegister } from "react-hook-form";
import { AlertTriangle, Sparkles } from "lucide-react";
import { Checkbox } from "@/components/ui/Checkbox";
import { CarFormData } from "@/types/carForm.types";

interface ClassificationSectionProps {
  register: UseFormRegister<CarFormData>;
}

export const ClassificationSection: React.FC<ClassificationSectionProps> = ({
  register,
}) => (
  <div className="flex flex-col sm:flex-row gap-6 p-6 bg-surface-2 border border-border">
    <div className="flex items-center gap-2">
      <AlertTriangle size={16} className="text-text-muted" />
      <Checkbox label="პროექტის ავტომობილი" {...register("isProject")} />
    </div>
    <div className="h-px sm:h-auto sm:w-px bg-border" />
    <div className="flex items-center gap-2">
      <Sparkles size={16} className="text-text-muted" />
      <Checkbox label="გამოჩნდეს საჯაროდ" {...register("isPublic")} />
    </div>
  </div>
);
