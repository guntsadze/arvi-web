"use client";
import React from "react";
import { UseFormRegister } from "react-hook-form";
import { RuggedInput } from "@/components/ui/RuggedInput";
import { RuggedSelect } from "@/components/ui/RuggedSelect";
import { CarFormData } from "@/types/carForm.types";

interface InspectionSectionProps {
  register: UseFormRegister<CarFormData>;
}

export const PAINT_CONDITION = [
  "ORIGINAL",
  "REPAINTED",
  "MINOR_SCRATCHES",
  "MAJOR_SCRATCHES",
] as const;

export const GLASS_STATE = ["ORIGINAL", "REPLACED", "CRACKED"] as const;

export const OIL_CONDITION = ["CLEAN", "DARK", "NEEDS_CHANGE"] as const;

export const INTERIOR_GRADE = ["EXCELLENT", "GOOD", "STAINED"] as const;

export const InspectionSection: React.FC<InspectionSectionProps> = ({
  register,
}) => (
  <div className="space-y-12">
    {/* --- EXTERIOR & CHASSIS --- */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="space-y-6">
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500/70 mb-4 font-mono italic">
          // Body & Paint
        </h4>
        <RuggedSelect
          label="Paint Condition"
          name="inspection.bodyCondition"
          register={register}
          options={[...PAINT_CONDITION]}
        />
        <RuggedSelect
          label="Glass State"
          name="inspection.glassCondition"
          register={register}
          options={[...GLASS_STATE]}
        />
      </div>

      <div className="space-y-6">
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500/70 mb-4 font-mono italic">
          // Wheels & Tires
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <RuggedInput
            label="Tread Depth (mm)"
            name="inspection.tireTreadDepth"
            type="number"
            register={register}
            placeholder="6.5"
          />
          <RuggedInput
            label="Tire Year"
            name="inspection.tireAge"
            type="number"
            register={register}
            placeholder="2023"
          />
        </div>
        <div className="flex items-center gap-4 p-4 border border-stone-800 bg-stone-900/20">
          <input
            type="checkbox"
            {...register("inspection.tireUniformity")}
            className="w-4 h-4 accent-orange-500 bg-stone-950 border-stone-800 rounded-none"
          />
          <label className="text-[10px] uppercase tracking-widest text-stone-400 font-mono">
            Uniform Tire Set
          </label>
        </div>
      </div>

      <div className="space-y-6">
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500/70 mb-4 font-mono italic">
          // Structural Integrity
        </h4>
        <RuggedInput
          label="Chassis Notes"
          name="inspection.chassisCondition"
          register={register}
          placeholder="Rust-free / Reinforced"
        />
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              {...register("inspection.hasRust")}
              className="accent-orange-500"
            />
            <span className="text-[9px] uppercase text-stone-300 font-mono">
              Visible Rust
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              {...register("inspection.panelSymmetry")}
              className="accent-orange-500"
            />
            <span className="text-[9px] uppercase text-stone-300 font-mono">
              Symmetric Panels
            </span>
          </div>
        </div>
      </div>
    </div>

    {/* --- MECHANICAL & INTERIOR --- */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-stone-800/30">
      <div className="space-y-6">
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500/70 mb-4 font-mono italic">
          // Engine & Fluids
        </h4>
        <RuggedSelect
          label="Oil Condition"
          name="inspection.engineOilStatus"
          register={register}
          options={[...OIL_CONDITION]}
        />
        <RuggedInput
          label="Engine Acoustics"
          name="inspection.engineNoise"
          register={register}
          placeholder="Smooth / No Tapping"
        />
      </div>

      <div className="space-y-6">
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500/70 mb-4 font-mono italic">
          // Cabin & Systems
        </h4>
        <RuggedSelect
          label="Interior Grade"
          name="inspection.interiorCondition"
          register={register}
          options={[...INTERIOR_GRADE]}
        />
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              {...register("inspection.acFunctional")}
              className="accent-orange-500"
            />
            <span className="text-[9px] uppercase text-stone-300 font-mono">
              A/C Cold
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              {...register("inspection.isSmokedIn")}
              className="accent-orange-500"
            />
            <span className="text-[9px] uppercase text-stone-300 font-mono">
              Smoker Car
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500/70 mb-4 font-mono italic">
          // Safety & Electronics
        </h4>
        <RuggedInput
          label="Dashboard Warnings"
          name="inspection.dashboardWarnings"
          register={register}
          placeholder="None / Clear"
        />
        <div className="flex items-center gap-4 p-4 border border-stone-800 bg-stone-900/20">
          <input
            type="checkbox"
            {...register("inspection.airbagsIntact")}
            className="w-4 h-4 accent-orange-500 bg-stone-950 border-stone-800 rounded-none"
          />
          <label className="text-[10px] uppercase tracking-widest text-stone-400 font-mono">
            Safety Systems Intact
          </label>
        </div>
      </div>
    </div>
  </div>
);
