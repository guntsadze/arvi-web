import React from "react";
import { useFieldArray, Control, UseFormRegister } from "react-hook-form";
import { RuggedInput } from "@/components/ui/RuggedInput";
import {
  Plus,
  Trash2,
  Zap,
  Calendar,
  Gauge,
  Weight,
  DollarSign,
} from "lucide-react";
import { RuggedSelect } from "@/components/ui/RuggedSelect";
import { MODIFICATIONS_TYPES } from "@/constants/carOptions";
import { RuggedDateInput } from "@/components/ui/RuggedDateInput";
import { RuggedTextArea } from "../../../../components/ui/RuggedTextarea";

interface ModificationsSectionProps {
  control: Control<any>;
  register: UseFormRegister<any>;
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div className="space-y-1">
          <h3 className="text-2xl font-black text-stone-100 uppercase tracking-tighter flex items-center gap-3">
            <Zap className="text-yellow-500 w-6 h-6 fill-yellow-500/20" />
            Modifications
          </h3>
          <p className="text-stone-500 text-xs uppercase font-bold tracking-widest">
            Performance & Aesthetic Upgrades
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
          className="group flex items-center gap-2 px-6 py-2.5 bg-yellow-600 hover:bg-yellow-500 text-black text-xs font-black rounded-sm transition-all shadow-[4px_4px_0px_0px_rgba(113,63,18,1)] active:translate-y-1 active:shadow-none uppercase tracking-widest"
        >
          <Plus size={16} /> Add Modification
        </button>
      </div>

      <div className="space-y-6">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="relative bg-stone-900/40 border border-stone-800 rounded-lg overflow-hidden transition-all hover:border-stone-700/50"
          >
            {/* Top Bar for Delete & Label */}
            <div className="flex items-center justify-between bg-stone-950/40 px-6 py-2 border-b border-stone-800/50">
              <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest">
                Upgrade Slot #{index + 1}
              </span>
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-stone-500 hover:text-red-500 transition-colors flex items-center gap-1.5 group"
              >
                <span className="text-[10px] font-black uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                  Remove
                </span>
                <Trash2 size={16} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Row 1: Core Mod Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <RuggedSelect
                  label="Category"
                  name={`modifications.${index}.type`}
                  options={[...MODIFICATIONS_TYPES]}
                  register={register}
                />
                <RuggedInput
                  label="Part Name"
                  name={`modifications.${index}.name`}
                  register={register}
                  placeholder="e.g. Stage 2 Turbo"
                />
                <RuggedInput
                  label="Manufacturer / Brand"
                  name={`modifications.${index}.brand`}
                  register={register}
                  placeholder="Garrett, HKS, etc."
                />
              </div>

              {/* Row 2: Performance & Details */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
                <div className="lg:col-span-3">
                  <RuggedInput
                    label="Installed By"
                    name={`modifications.${index}.installedBy`}
                    register={register}
                    placeholder="Shop or DIY"
                  />
                </div>

                {/* Stats Group */}
                <div className="lg:col-span-9 grid grid-cols-2 md:grid-cols-4 gap-4 bg-stone-950/30 p-4 rounded border border-stone-800/50">
                  <RuggedInput
                    label="HP Gain"
                    type="number"
                    icon={<Gauge size={14} className="text-yellow-500" />}
                    name={`modifications.${index}.hpGain`}
                    register={register}
                  />
                  <RuggedInput
                    label="Weight (kg)"
                    type="number"
                    icon={<Weight size={14} className="text-blue-500" />}
                    name={`modifications.${index}.weightChange`}
                    register={register}
                  />
                  <RuggedInput
                    label="Cost ($)"
                    type="number"
                    icon={<DollarSign size={14} className="text-green-500" />}
                    name={`modifications.${index}.cost`}
                    register={register}
                  />
                  <RuggedDateInput
                    label="Install Date"
                    name={`modifications.${index}.installDate`}
                    control={control}
                  />
                </div>
              </div>

              {/* Row 3: Full-width Description */}
              <div className="pt-2">
                <RuggedTextArea
                  label="Modification Details & Settings"
                  name={`modifications.${index}.description`} // გასწორებული ბაგი: აქ ეწერა maintenanceRecords
                  register={register}
                  placeholder="Describe the upgrade, tuning specs, or part numbers..."
                  rows={2}
                />
              </div>
            </div>
          </div>
        ))}

        {fields.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed border-stone-800 rounded-lg bg-stone-900/10">
            <Zap className="mx-auto h-12 w-12 text-stone-800 mb-4" />
            <p className="text-stone-500 font-bold uppercase tracking-widest text-sm">
              No modifications listed
            </p>
            <p className="text-stone-600 text-xs mt-1 font-medium italic">
              "Stock is boring." - Add your first mod.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
