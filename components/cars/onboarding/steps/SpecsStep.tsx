"use client";

import { ReactNode } from "react";
import { Control, UseFormRegister, UseFormSetValue, useWatch } from "react-hook-form";
import { Gauge, Gem, ShieldCheck, Sun, Timer, Wrench } from "lucide-react";
import { CarFormData } from "@/types/carForm.types";
import { CAR_CHARACTER_TAGS } from "@/constants/carOptions";
import { SelectableCard } from "@/components/cars/onboarding/SelectableCard";

interface SpecsStepProps {
  control: Control<CarFormData>;
  register: UseFormRegister<CarFormData>;
  setValue: UseFormSetValue<CarFormData>;
}

const CHARACTER_ICONS: Record<string, ReactNode> = {
  DAILY_DRIVER: <Sun size={22} />,
  PROJECT_CAR: <Wrench size={22} />,
  TRACK_BEAST: <Timer size={22} />,
  GARAGE_QUEEN: <Gem size={22} />,
  STOCK: <ShieldCheck size={22} />,
};

/**
 * Step 3 — "The Specs & Soul": odometer-styled mileage, single-select
 * character tag (keeps isProject boolean in sync when PROJECT_CAR is
 * picked, since other parts of the app still read isProject directly),
 * and the optional factory paint code.
 */
export function SpecsStep({ control, register, setValue }: SpecsStepProps) {
  const characterTag = useWatch({ control, name: "characterTag" });

  const selectCharacterTag = (value: string) => {
    const next = characterTag === value ? undefined : value;
    setValue("characterTag", next, { shouldValidate: true });
    setValue("isProject", next === "PROJECT_CAR", { shouldValidate: true });
  };

  return (
    <div className="space-y-8">
      {/* Mileage — odometer styled */}
      <div>
        <label className="mb-3 block text-xs font-bold tracking-[0.15em] text-text-secondary uppercase">
          გარბენი (კმ)
        </label>
        <div className="relative overflow-hidden rounded-lg border-2 border-border bg-black/40 px-5 py-4 shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)] transition-colors focus-within:border-primary">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-1 opacity-40"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, hsl(var(--border)) 0px, hsl(var(--border)) 1px, transparent 1px, transparent 8px)",
            }}
          />
          <div className="flex items-center gap-4">
            <Gauge size={20} className="shrink-0 text-primary" />
            <input
              type="number"
              inputMode="numeric"
              min={0}
              placeholder="000000"
              className="w-full bg-transparent font-mono text-2xl font-bold tracking-[0.2em] text-primary placeholder:text-text-muted/40 focus:outline-none [font-variant-numeric:tabular-nums]"
              {...register("mileage")}
            />
            <span className="shrink-0 font-mono text-xs text-text-muted">კმ</span>
          </div>
        </div>
      </div>

      {/* Character tag */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <label className="text-xs font-bold tracking-[0.15em] text-text-secondary uppercase">
            მანქანის ხასიათი
          </label>
          <span className="text-[11px] text-text-muted">სურვილისამებრ</span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {CAR_CHARACTER_TAGS.map((tag) => (
            <SelectableCard
              key={tag.value}
              title={tag.label}
              icon={CHARACTER_ICONS[tag.value]}
              selected={characterTag === tag.value}
              onClick={() => selectCharacterTag(tag.value)}
            />
          ))}
        </div>
      </div>

      {/* Paint code */}
      <div>
        <label className="mb-1.5 block text-xs font-bold tracking-[0.15em] text-text-secondary uppercase">
          ქარხნული ფერის კოდი
        </label>
        <p className="mb-3 text-xs text-text-muted">
          თუ იცი — ჩაწერე. უმეტესობამ არ იცის, და სულაც არაფერია
        </p>
        <input
          type="text"
          placeholder="მაგ. 300/9040"
          className="h-10 w-full rounded-md border border-border bg-surface-1 px-3 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
          {...register("paintCode")}
        />
      </div>

      {/* VIN + license plate — optional identifying details, grouped here
          alongside paintCode rather than a dedicated step, since most
          people won't fill these in on a first pass either */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-bold tracking-[0.15em] text-text-secondary uppercase">
            VIN
          </label>
          <input
            type="text"
            placeholder="საიდენტიფიკაციო ნომერი"
            className="h-10 w-full rounded-md border border-border bg-surface-1 px-3 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
            {...register("vin")}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold tracking-[0.15em] text-text-secondary uppercase">
            სანომრე ნიშანი
          </label>
          <input
            type="text"
            placeholder="XX-000-XX"
            className="h-10 w-full rounded-md border border-border bg-surface-1 px-3 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
            {...register("licensePlate")}
          />
        </div>
      </div>
    </div>
  );
}
