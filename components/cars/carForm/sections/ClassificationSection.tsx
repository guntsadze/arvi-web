import React from "react";
import { UseFormRegister } from "react-hook-form";
import { AlertTriangle, Sparkles } from "lucide-react";
import { RuggedCheckbox } from "@/components/ui/RuggedCheckbox";
import { CarFormData } from "@/types/carForm.types";

interface ClassificationSectionProps {
  register: UseFormRegister<CarFormData>;
}

export const ClassificationSection: React.FC<ClassificationSectionProps> = ({
  register,
}) => (
  <div className="flex flex-col sm:flex-row gap-6 p-6 bg-stone-800/20 border border-stone-700">
    <RuggedCheckbox
      label="Restoration Project (WIP)"
      icon={AlertTriangle}
      register={register}
      name="isProject"
    />
    <div className="h-px sm:h-auto sm:w-px bg-stone-700" />
    <RuggedCheckbox
      label="Publicly Visible"
      icon={Sparkles}
      register={register}
      name="isPublic"
    />
  </div>
);
