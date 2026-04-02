import React from "react";
import { useFieldArray, Control, UseFormRegister } from "react-hook-form";
import { RuggedInput } from "@/components/ui/RuggedInput";
import {
  ClipboardList,
  Plus,
  Trash2,
  Calendar,
  DollarSign,
  Navigation,
  Activity,
} from "lucide-react";
import { RuggedSelect } from "@/components/ui/RuggedSelect";
import { MAINTENANCE_TYPES } from "@/constants/carOptions";
import { RuggedDateInput } from "@/components/ui/RuggedDateInput";
import { RuggedTextArea } from "@/components/ui/RuggedTextArea";

export const MaintenanceSection: React.FC<{
  control: Control<any>;
  register: UseFormRegister<any>;
}> = ({ control, register }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "maintenanceRecords",
  });

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div className="space-y-1">
          <h3 className="text-2xl font-black text-stone-100 uppercase tracking-tighter flex items-center gap-3">
            <ClipboardList className="text-blue-500 w-6 h-6 fill-blue-500/10" />
            სერვისის ჩანაწერები
          </h3>
          <p className="text-stone-500 text-xs uppercase font-bold tracking-widest">
            მომსახურების ისტორია და დაგეგმილი ტექნიკური მომსახურება
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            append({
              serviceType: "OIL_CHANGE",
              serviceDate: new Date().toISOString().split("T")[0],
            })
          }
          className="group flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-sm transition-all shadow-[4px_4px_0px_0px_rgba(30,58,138,1)] active:translate-y-1 active:shadow-none uppercase tracking-widest"
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
            className="relative bg-stone-900/40 border border-stone-800 rounded-lg overflow-hidden transition-all hover:border-stone-700/50"
          >
            {/* Top Bar for Delete & Index */}
            <div className="flex items-center justify-between bg-stone-950/40 px-6 py-2 border-b border-stone-800/50">
              <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest">
                სერვისის ჩანაწერი #{index + 1}
              </span>
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-stone-500 hover:text-red-500 transition-colors flex items-center gap-1.5 group"
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
                  <RuggedSelect
                    label="სერვისის ტიპი"
                    name={`maintenanceRecords.${index}.type`}
                    options={[...MAINTENANCE_TYPES]}
                    register={register}
                  />
                </div>
                <div className="md:col-span-5">
                  <RuggedInput
                    label="სერვისის დასახელება"
                    name={`maintenanceRecords.${index}.title`}
                    register={register}
                    placeholder="მაგ: ზეთის & ფილტრების შეცვლა"
                  />
                </div>
                <div className="md:col-span-3">
                  <RuggedInput
                    label="ადგილი"
                    name={`maintenanceRecords.${index}.location`}
                    icon={<Navigation size={14} className="text-stone-500" />}
                    register={register}
                    placeholder="ჩემი გარაჟი"
                  />
                </div>
              </div>

              {/* Row 2: Dates, Costs and Planning */}
              <div className="lg:col-span-9 grid grid-cols-2 md:grid-cols-4 gap-4 bg-stone-950/30 p-4 rounded border border-stone-800/50">
                <RuggedDateInput
                  label="თარიღი"
                  name={`maintenanceRecords.${index}.serviceDate`}
                  control={control}
                />
                <RuggedInput
                  label="ჯამური ღირებულება (₾)"
                  type="number"
                  icon={<DollarSign size={14} className="text-green-500" />}
                  name={`maintenanceRecords.${index}.cost`}
                  register={register}
                />
                <RuggedInput
                  label="შემდეგი შერვისი (კმ)"
                  type="number"
                  icon={<Activity size={14} className="text-blue-500" />}
                  name={`maintenanceRecords.${index}.nextServiceMileage`}
                  register={register}
                  placeholder="კილომეტრი"
                />
                <RuggedDateInput
                  label="შემდეგი სერვისი (თარიღი)"
                  name={`maintenanceRecords.${index}.nextServiceDue`}
                  control={control}
                />
              </div>

              {/* Row 3: Description (Full Width) */}
              <div className="pt-2">
                <RuggedTextArea
                  label="სერვისის დამატებითი ჩანაწერები"
                  name={`maintenanceRecords.${index}.description`}
                  register={register}
                  placeholder="ახსენეთ გამოყენებული ნაწილები, ზეთის სიბლანტე ან სამომავლო რეკომენდაციები..."
                  rows={2}
                />
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {fields.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed border-stone-800 rounded-lg bg-stone-900/10">
            <ClipboardList className="mx-auto h-12 w-12 text-stone-800 mb-4" />
            <p className="text-stone-500 font-bold uppercase tracking-widest text-sm">
              სერვისის ჩანაწერები არ არსებობს
            </p>
            <p className="text-stone-600 text-xs mt-1">
              დაამატეთ თქვენი ავტომობილის პირველი სერვისის ჩანაწერი
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
