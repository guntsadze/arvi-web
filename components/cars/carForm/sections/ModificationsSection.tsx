import React from "react";
import { useFieldArray, Control, UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import {
  Plus,
  Trash2,
  Zap,
  Calendar,
  Gauge,
  Weight,
  DollarSign,
} from "lucide-react";
import { Select } from "@/components/ui/Select";
import { MODIFICATIONS_TYPES } from "@/constants/carOptions";
import { DateInput } from "@/components/ui/DateInput";
import { Textarea } from "@/components/ui/Textarea";
import { CarFormData } from "@/types/carForm.types";

interface ModificationsSectionProps {
  control: Control<CarFormData>;
  register: UseFormRegister<CarFormData>;
}

export const ModificationsSection: React.FC<ModificationsSectionProps> = ({
  control,
  register,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "modifications",
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="space-y-1">
          <h3 className="text-2xl font-black text-text-primary uppercase tracking-tighter flex items-center gap-3">
            <Zap className="text-warning w-6 h-6 fill-warning/20" />
            ავტომობილის მოდიფიკაციები
          </h3>
          <p className="text-text-secondary text-xs uppercase font-bold tracking-widest">
            ფერფორმანსი & ვიზუალური განახლებები
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            append({
              type: "ENGINE",
              name: "",
              installDate: new Date().toISOString().split("T")[0],
            })
          }
          className="group flex items-center gap-2 px-6 py-2.5 bg-warning hover:bg-warning text-black text-xs font-black rounded-sm transition-all shadow-[4px_4px_0px_0px_rgba(113,63,18,1)] active:translate-y-1 active:shadow-none uppercase tracking-widest"
        >
          <Plus size={16} /> ჩანაწერის დამატება
        </button>
      </div>

      <div className="space-y-6">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="relative bg-surface-1/40 border border-border rounded-lg overflow-hidden transition-all hover:border-border/50"
          >
            {/* Top Bar for Delete & Label */}
            <div className="flex items-center justify-between bg-background/40 px-6 py-2 border-b border-border/50">
              <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">
                განახლების ჩანაწერი #{index + 1}
              </span>
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-text-secondary hover:text-error transition-colors flex items-center gap-1.5 group"
              >
                <span className="text-[10px] font-black uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                  ჩანაწერის წაშლა
                </span>
                <Trash2 size={16} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Row 1: Core Mod Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Select
                  label="განახლების კატეგორია"
                  options={[...MODIFICATIONS_TYPES]}
                  {...register(`modifications.${index}.type`)}
                />
                <Input
                  label="განახლების სახელი"
                  placeholder="მაგ: Stage 2 Turbo"
                  {...register(`modifications.${index}.name`)}
                />
                <Input
                  label="ბრენდი"
                  placeholder="Garrett, HKS, etc."
                  {...register(`modifications.${index}.brand`)}
                />
              </div>

              {/* Row 2: Performance & Details */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
                <div className="lg:col-span-3">
                  <Input
                    label="განახლება გააკეთა"
                    placeholder="Shop or DIY"
                    {...register(`modifications.${index}.installedBy`)}
                  />
                </div>

                {/* Stats Group */}
                <div className="lg:col-span-9 grid grid-cols-2 md:grid-cols-4 gap-4 bg-surface-2 p-4 rounded border border-border">
                  <Input
                    label="ცხენისძალის ნამატი"
                    type="number"
                    leftIcon={<Gauge size={14} className="text-warning" />}
                    {...register(`modifications.${index}.hpGain`)}
                  />
                  <Input
                    label="წონის ცვლილება"
                    type="number"
                    leftIcon={<Weight size={14} className="text-info" />}
                    {...register(`modifications.${index}.weightChange`)}
                  />
                  <Input
                    label="ღირებულება (₾)"
                    type="number"
                    leftIcon={<DollarSign size={14} className="text-success" />}
                    {...register(`modifications.${index}.cost`)}
                  />
                  <DateInput
                    label="განახლების თარიღი"
                    {...register(`modifications.${index}.installDate`)}
                  />
                </div>
              </div>

              {/* Row 3: Full-width Description */}
              <div className="pt-2">
                <Textarea
                  label="განახლების აღწერა დეტალურად"
                  placeholder="Describe the upgrade, tuning specs, or part numbers..."
                  rows={2}
                  {...register(`modifications.${index}.description`)}
                />
              </div>
            </div>
          </div>
        ))}

        {fields.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed border-border rounded-lg bg-surface-1/10">
            <Zap className="mx-auto h-12 w-12 text-text-secondary mb-4" />
            <p className="text-text-secondary font-bold uppercase tracking-widest text-sm">
              მოდიფიკაციები არ მოიძებნა
            </p>
            <p className="text-text-secondary text-xs mt-1 font-medium italic">
              დაამატე შენი ავტომობილის პირველი განახლება
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
