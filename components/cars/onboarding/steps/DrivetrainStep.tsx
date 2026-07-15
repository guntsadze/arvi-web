"use client";

import { ReactNode, useState } from "react";
import {
  Control,
  UseFormRegister,
  UseFormSetValue,
  useWatch,
} from "react-hook-form";
import {
  Atom,
  BatteryCharging,
  ChevronsDown,
  ChevronsUp,
  Cog,
  Droplet,
  Flame,
  Fuel,
  GitMerge,
  Infinity as InfinityIcon,
  Layers,
  Leaf,
  MinusCircle,
  Mountain,
  RefreshCw,
  Waves,
  Zap,
} from "lucide-react";
import { CarFormData } from "@/types/carForm.types";
import { FUEL_TYPES, TRANSMISSION_TYPES, DRIVE_TYPES } from "@/constants/carOptions";
import { SelectableCard } from "@/components/cars/onboarding/SelectableCard";

interface DrivetrainStepProps {
  control: Control<CarFormData>;
  register: UseFormRegister<CarFormData>;
  setValue: UseFormSetValue<CarFormData>;
}

const FUEL_ICONS: Record<string, ReactNode> = {
  PETROL: <Fuel size={20} />,
  DIESEL: <Droplet size={20} />,
  HYBRID: <Leaf size={20} />,
  PLUGIN_HYBRID: <BatteryCharging size={20} />,
  ELECTRIC: <Zap size={20} />,
  LPG: <Flame size={20} />,
  CNG: <Waves size={20} />,
  HYDROGEN: <Atom size={20} />,
};

const TRANSMISSION_ICONS: Record<string, ReactNode> = {
  MANUAL: <Cog size={20} />,
  AUTOMATIC: <InfinityIcon size={20} />,
  SEMI_AUTOMATIC: <GitMerge size={20} />,
  CVT: <RefreshCw size={20} />,
  DCT: <Layers size={20} />,
};

const DRIVE_ICONS: Record<string, ReactNode> = {
  FWD: <ChevronsUp size={20} />,
  RWD: <ChevronsDown size={20} />,
  AWD: <RefreshCw size={20} />,
  FOURWD: <Mountain size={20} />,
};

function parseEngineString(value: string | undefined): { liters: number; description: string } {
  const match = value?.match(/^(\d+(?:\.\d+)?)\s*L\s*(.*)$/i);
  if (match) {
    return { liters: Number(match[1]), description: match[2] ?? "" };
  }
  return { liters: 2, description: value ?? "" };
}

function composeEngineString(liters: number, description: string): string {
  const trimmed = description.trim();
  return trimmed ? `${liters.toFixed(1)}L ${trimmed}` : `${liters.toFixed(1)}L`;
}

/**
 * Step 2 — "The Heart & Drivetrain": transmission, fuel type and (optional)
 * drive type as satisfying selectable cards, plus a slider-driven engine
 * capacity picker that still writes a plain free-text `engine` string
 * (e.g. "2.0L Turbo") — the shape CarFormData.engine already expects.
 * Horsepower/torque are tucked into a small optional row, not demanded.
 */
export function DrivetrainStep({ control, register, setValue }: DrivetrainStepProps) {
  const fuelType = useWatch({ control, name: "fuelType" });
  const transmission = useWatch({ control, name: "transmission" });
  const driveType = useWatch({ control, name: "driveType" });
  const engineValue = useWatch({ control, name: "engine" });

  const initial = parseEngineString(engineValue);
  const [liters, setLiters] = useState(initial.liters);
  const [engineDescription, setEngineDescription] = useState(initial.description);

  const updateEngine = (nextLiters: number, nextDescription: string) => {
    setLiters(nextLiters);
    setEngineDescription(nextDescription);
    setValue("engine", composeEngineString(nextLiters, nextDescription), {
      shouldValidate: true,
    });
  };

  return (
    <div className="space-y-8">
      {/* Fuel type */}
      <div>
        <label className="mb-3 block text-xs font-bold tracking-[0.15em] text-text-secondary uppercase">
          საწვავის ტიპი
        </label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {FUEL_TYPES.map((f) => (
            <SelectableCard
              key={f.value}
              size="sm"
              title={f.label}
              icon={FUEL_ICONS[f.value]}
              selected={fuelType === f.value}
              onClick={() => setValue("fuelType", f.value, { shouldValidate: true })}
            />
          ))}
        </div>
      </div>

      {/* Transmission */}
      <div>
        <label className="mb-3 block text-xs font-bold tracking-[0.15em] text-text-secondary uppercase">
          გადაცემათა კოლოფი
        </label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {TRANSMISSION_TYPES.map((t) => (
            <SelectableCard
              key={t.value}
              size="sm"
              title={t.label}
              icon={TRANSMISSION_ICONS[t.value]}
              selected={transmission === t.value}
              onClick={() => setValue("transmission", t.value, { shouldValidate: true })}
            />
          ))}
        </div>
      </div>

      {/* Drive type — optional */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <label className="text-xs font-bold tracking-[0.15em] text-text-secondary uppercase">
            წამყვანი თვლები
          </label>
          <span className="text-[11px] text-text-muted">სურვილისამებრ</span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {DRIVE_TYPES.map((d) => (
            <SelectableCard
              key={d.value}
              size="sm"
              title={d.label}
              icon={DRIVE_ICONS[d.value]}
              selected={driveType === d.value}
              onClick={() => setValue("driveType", d.value, { shouldValidate: true })}
            />
          ))}
          <SelectableCard
            size="sm"
            title="არ ვიცი"
            icon={<MinusCircle size={20} />}
            selected={!driveType}
            onClick={() => setValue("driveType", "", { shouldValidate: true })}
          />
        </div>
      </div>

      {/* Engine capacity */}
      <div>
        <label className="mb-3 block text-xs font-bold tracking-[0.15em] text-text-secondary uppercase">
          ძრავის მოცულობა
        </label>
        <div className="rounded-lg border-2 border-border bg-surface-1 p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-mono text-3xl font-bold text-primary">
              {liters.toFixed(1)}L
            </span>
            <span className="text-xs text-text-muted">0.6L – 8.0L</span>
          </div>
          <input
            type="range"
            min={0.6}
            max={8}
            step={0.1}
            value={liters}
            onChange={(e) => updateEngine(Number(e.target.value), engineDescription)}
            className="w-full accent-primary"
          />
          <input
            type="text"
            value={engineDescription}
            onChange={(e) => updateEngine(liters, e.target.value)}
            placeholder="Turbo, V6, Restomod..."
            className="mt-4 h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
          />
        </div>
      </div>

      {/* Horsepower / torque — optional, low-key */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <label className="text-xs font-bold tracking-[0.15em] text-text-secondary uppercase">
            სიმძლავრე
          </label>
          <span className="text-[11px] text-text-muted">შეგიძლია მოგვიანებით შეავსო</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 rounded-lg border border-border bg-surface-1 px-4 py-3">
            <input
              type="number"
              placeholder="286"
              className="w-full bg-transparent font-mono text-lg text-text-primary placeholder:text-text-muted/50 focus:outline-none"
              {...register("horsepower")}
            />
            <span className="shrink-0 text-xs text-text-muted">ცხ.ძ.</span>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-surface-1 px-4 py-3">
            <input
              type="number"
              placeholder="320"
              className="w-full bg-transparent font-mono text-lg text-text-primary placeholder:text-text-muted/50 focus:outline-none"
              {...register("torque")}
            />
            <span className="shrink-0 text-xs text-text-muted">Nm</span>
          </div>
        </div>
      </div>
    </div>
  );
}
