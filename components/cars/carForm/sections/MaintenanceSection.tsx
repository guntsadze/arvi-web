import React from "react";
import { useFieldArray, Control, UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import {
  ClipboardList,
  Plus,
  Trash2,
  DollarSign,
  Navigation,
  Activity,
} from "lucide-react";
import { Select } from "@/components/ui/Select";
import { MAINTENANCE_TYPES } from "@/constants/carOptions";
import { DateInput } from "@/components/ui/DateInput";
import { Textarea } from "@/components/ui/Textarea";
import { CarFormData } from "@/types/carForm.types";

export const MaintenanceSection: React.FC<{
  control: Control<CarFormData>;
  register: UseFormRegister<CarFormData>;
}> = ({ control, register }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "maintenanceRecords",
  });

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="space-y-1">
          <h3 className="text-2xl font-black text-text-primary uppercase tracking-tighter flex items-center gap-3">
            <ClipboardList className="text-info w-6 h-6 fill-info/10" />
            სერვისის ჩანაწერები
          </h3>
          <p className="text-text-secondary text-xs uppercase font-bold tracking-widest">
            მომსახურების ისტორია და დაგეგმილი ტექნიკური მომსახურება
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            append({
              type: "OIL_CHANGE",
              serviceDate: new Date().toISOString().split("T")[0],
            })
          }
          className="group flex items-center gap-2 px-6 py-2.5 bg-info hover:bg-info text-white text-xs font-black rounded-sm transition-all shadow-[4px_4px_0px_0px_rgba(30,58,138,1)] active:translate-y-1 active:shadow-none uppercase tracking-widest"
        >
          <Plus
            size={16}
            className="group-hover:rotate-90 transition-transform"
          />
          ჩანაწერის დამატება
        </button>
      </div>

      <div className="space-y-6">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="relative bg-surface-1/40 border border-border rounded-lg overflow-hidden transition-all hover:border-border/50"
          >
            {/* Top Bar for Delete & Index */}
            <div className="flex items-center justify-between bg-background/40 px-6 py-2 border-b border-border/50">
              <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">
                სერვისის ჩანაწერი #{index + 1}
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
              {/* Row 1: Primary Service Info */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-4">
                  <Select
                    label="სერვისის ტიპი"
                    options={[...MAINTENANCE_TYPES]}
                    {...register(`maintenanceRecords.${index}.type`)}
                  />
                </div>
                <div className="md:col-span-5">
                  <Input
                    label="სერვისის დასახელება"
                    placeholder="მაგ: ზეთის & ფილტრების შეცვლა"
                    {...register(`maintenanceRecords.${index}.title`)}
                  />
                </div>
                <div className="md:col-span-3">
                  <Input
                    label="ადგილი"
                    leftIcon={<Navigation size={14} className="text-text-muted" />}
                    placeholder="ჩემი გარაჟი"
                    {...register(`maintenanceRecords.${index}.location`)}
                  />
                </div>
              </div>

              {/* Row 2: Dates, Costs and Planning */}
              <div className="lg:col-span-9 grid grid-cols-2 md:grid-cols-4 gap-4 bg-surface-2 p-4 rounded border border-border">
                <DateInput
                  label="თარიღი"
                  {...register(`maintenanceRecords.${index}.serviceDate`)}
                />
                <Input
                  label="ჯამური ღირებულება (₾)"
                  type="number"
                  leftIcon={<DollarSign size={14} className="text-success" />}
                  {...register(`maintenanceRecords.${index}.cost`)}
                />
                <Input
                  label="შემდეგი შერვისი (კმ)"
                  type="number"
                  leftIcon={<Activity size={14} className="text-info" />}
                  placeholder="კილომეტრი"
                  {...register(`maintenanceRecords.${index}.nextServiceMileage`)}
                />
                <DateInput
                  label="შემდეგი სერვისი (თარიღი)"
                  {...register(`maintenanceRecords.${index}.nextServiceDue`)}
                />
              </div>

              {/* Row 3: Description (Full Width) */}
              <div className="pt-2">
                <Textarea
                  label="სერვისის დამატებითი ჩანაწერები"
                  placeholder="ახსენეთ გამოყენებული ნაწილები, ზეთის სიბლანტე ან სამომავლო რეკომენდაციები..."
                  rows={2}
                  {...register(`maintenanceRecords.${index}.description`)}
                />
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {fields.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed border-border rounded-lg bg-surface-1/10">
            <ClipboardList className="mx-auto h-12 w-12 text-text-secondary mb-4" />
            <p className="text-text-secondary font-bold uppercase tracking-widest text-sm">
              სერვისის ჩანაწერები არ არსებობს
            </p>
            <p className="text-text-primary text-xs mt-1">
              დაამატეთ თქვენი ავტომობილის პირველი სერვისის ჩანაწერი
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
