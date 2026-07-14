"use client";
import React from "react";
import { UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Select, toSelectOptions } from "@/components/ui/Select";
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
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent/70 mb-4 font-mono italic">
          // Body & Paint
        </h4>
        <Select
          label="Paint Condition"
          options={toSelectOptions(PAINT_CONDITION)}
          {...register("inspection.bodyCondition")}
        />
        <Select
          label="Glass State"
          options={toSelectOptions(GLASS_STATE)}
          {...register("inspection.glassCondition")}
        />
      </div>

      <div className="space-y-6">
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent/70 mb-4 font-mono italic">
          // Wheels & Tires
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Tread Depth (mm)"
            type="number"
            placeholder="6.5"
            {...register("inspection.tireTreadDepth")}
          />
          <Input
            label="Tire Year"
            type="number"
            placeholder="2023"
            {...register("inspection.tireAge")}
          />
        </div>
        <div className="flex items-center gap-4 p-4 border border-border bg-surface-1/20">
          <input
            type="checkbox"
            {...register("inspection.tireUniformity")}
            className="w-4 h-4 accent-accent bg-background border-border rounded-none"
          />
          <label className="text-[10px] uppercase tracking-widest text-text-secondary font-mono">
            Uniform Tire Set
          </label>
        </div>
      </div>

      <div className="space-y-6">
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent/70 mb-4 font-mono italic">
          // Structural Integrity
        </h4>
        <Input
          label="Chassis Notes"
          placeholder="Rust-free / Reinforced"
          {...register("inspection.chassisCondition")}
        />
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              {...register("inspection.hasRust")}
              className="accent-accent"
            />
            <span className="text-[9px] uppercase text-text-secondary font-mono">
              Visible Rust
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              {...register("inspection.panelSymmetry")}
              className="accent-accent"
            />
            <span className="text-[9px] uppercase text-text-secondary font-mono">
              Symmetric Panels
            </span>
          </div>
        </div>
      </div>
    </div>

    {/* --- MECHANICAL & INTERIOR --- */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-border/30">
      <div className="space-y-6">
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent/70 mb-4 font-mono italic">
          // Engine & Fluids
        </h4>
        <Select
          label="Oil Condition"
          options={toSelectOptions(OIL_CONDITION)}
          {...register("inspection.engineOilStatus")}
        />
        <Input
          label="Engine Acoustics"
          placeholder="Smooth / No Tapping"
          {...register("inspection.engineNoise")}
        />
      </div>

      <div className="space-y-6">
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent/70 mb-4 font-mono italic">
          // Cabin & Systems
        </h4>
        <Select
          label="Interior Grade"
          options={toSelectOptions(INTERIOR_GRADE)}
          {...register("inspection.interiorCondition")}
        />
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              {...register("inspection.acFunctional")}
              className="accent-accent"
            />
            <span className="text-[9px] uppercase text-text-secondary font-mono">
              A/C Cold
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              {...register("inspection.isSmokedIn")}
              className="accent-accent"
            />
            <span className="text-[9px] uppercase text-text-secondary font-mono">
              Smoker Car
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent/70 mb-4 font-mono italic">
          // Safety & Electronics
        </h4>
        <Input
          label="Dashboard Warnings"
          placeholder="None / Clear"
          {...register("inspection.dashboardWarnings")}
        />
        <div className="flex items-center gap-4 p-4 border border-border bg-surface-1/20">
          <input
            type="checkbox"
            {...register("inspection.airbagsIntact")}
            className="w-4 h-4 accent-accent bg-background border-border rounded-none"
          />
          <label className="text-[10px] uppercase tracking-widest text-text-secondary font-mono">
            Safety Systems Intact
          </label>
        </div>
      </div>
    </div>
  </div>
);
