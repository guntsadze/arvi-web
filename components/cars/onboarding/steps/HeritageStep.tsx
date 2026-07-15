"use client";

import { ReactNode, useMemo, useState } from "react";
import { Control, UseFormRegister, UseFormSetValue, FieldErrors, useWatch } from "react-hook-form";
import {
  Bus,
  Car as CarIcon,
  CarFront,
  CarTaxiFront,
  Caravan,
  Gauge,
  MinusCircle,
  Mountain,
  MountainSnow,
  Rocket,
  Search,
  Sun,
  Truck,
  Van,
  Zap,
} from "lucide-react";
import { CarFormData } from "@/types/carForm.types";
import { BODY_TYPES } from "@/constants/carOptions";
import { useCarBrands } from "@/hooks/useCarBrands";
import { useCarModels } from "@/hooks/useCarModels";
import { simpleIconsUrl } from "@/lib/simpleIcons";
import { SelectableCard } from "@/components/cars/onboarding/SelectableCard";
import { cn } from "@/lib/utils";

interface HeritageStepProps {
  control: Control<CarFormData>;
  register: UseFormRegister<CarFormData>;
  setValue: UseFormSetValue<CarFormData>;
  errors: FieldErrors<CarFormData>;
}

// Suggestive, not literal, per the onboarding brief — just enough to tell
// the 12 BodyType tiles apart at a glance.
const BODY_TYPE_ICONS: Record<string, ReactNode> = {
  SEDAN: <CarIcon size={18} />,
  COUPE: <CarFront size={18} />,
  CONVERTIBLE: <Sun size={18} />,
  HATCHBACK: <CarTaxiFront size={18} />,
  WAGON: <Caravan size={18} />,
  SUV: <Mountain size={18} />,
  CROSSOVER: <MountainSnow size={18} />,
  PICKUP: <Truck size={18} />,
  VAN: <Bus size={18} />,
  MINIVAN: <Van size={18} />,
  SPORTS_CAR: <Zap size={18} />,
  SUPERCAR: <Rocket size={18} />,
};

interface Brand {
  value: string;
  label: string;
}

/**
 * One brand tile. Tries a Simple Icons logo first (monochrome by design —
 * fits the blueprint aesthetic and avoids 40 clashing brand colors); on a
 * genuine 404 (or any load failure) it falls back to the previous
 * typographic tile (generic car glyph + brand name) automatically, per
 * brand, with no hand-kept allowlist. Extracted to its own component so
 * each tile owns its own "did the logo fail" state independently.
 *
 * Tinting note: Simple Icons SVGs ship `fill="currentColor"`, but that only
 * resolves against a CSS color context — an <img> reference has none (it's
 * a raster fetch of the asset), so every logo renders SVG's initial black
 * regardless of theme or selection. Truly recoloring it to primary-green on
 * selection would require fetching+inlining each SVG's raw markup instead
 * of <img> (dangerouslySetInnerHTML for an external resource, plus a
 * network+state machinery). We deliberately don't do that: `invert` makes
 * the logo read as white against the dark UI, and the tile's border/glow
 * (the same SelectableCard-style selected treatment used everywhere else in
 * the wizard) plus a soft primary-tinted drop-shadow around the logo itself
 * carry the "selected" signal instead.
 */
function BrandTile({
  brand,
  selected,
  onClick,
}: {
  brand: Brand;
  selected: boolean;
  onClick: () => void;
}) {
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "group flex flex-col items-center justify-center gap-1.5 rounded-lg border-2 bg-surface-1 px-2 py-4 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-primary/50",
        selected
          ? "scale-[1.03] border-primary bg-primary/5 shadow-[0_0_20px_-6px_hsl(var(--primary)/0.65)]"
          : "border-border",
      )}
    >
      {!logoFailed ? (
        <img
          src={simpleIconsUrl(brand.label || brand.value)}
          alt=""
          width={20}
          height={20}
          loading="lazy"
          onError={() => setLogoFailed(true)}
          className={cn(
            "h-5 w-5 object-contain invert transition-all duration-200",
            selected
              ? "opacity-100 drop-shadow-[0_0_6px_hsl(var(--primary)/0.7)]"
              : "opacity-60 group-hover:opacity-85",
          )}
        />
      ) : (
        <CarIcon size={16} className={selected ? "text-primary" : "text-text-muted"} />
      )}
      <span
        className={cn(
          "text-sm font-semibold tracking-wide",
          selected ? "text-text-primary" : "text-text-secondary",
        )}
      >
        {brand.label}
      </span>
    </button>
  );
}

/**
 * Step 1 — "The Heritage": brand, model, year, and (new) body type. Brand
 * tiles now render a real Simple Icons logo per make instead of a generic
 * car glyph + text for every single one (see BrandTile above) — that
 * genericness was called out as part of what made the previous version of
 * this wizard feel soulless. make/model are driven via setValue + useWatch
 * (same pattern IdentitySection already uses for the brand→model cascade)
 * rather than Controller, since Controller's render prop isn't a valid
 * place to call the useCarModels hook. bodyType is optional backend-side
 * (BodyType? on the DTO) so it ships with an "არ ვიცი" skip tile, same
 * pattern as DrivetrainStep's drive-type row.
 */
export function HeritageStep({ control, register, setValue, errors }: HeritageStepProps) {
  const brands = useCarBrands();
  const make = useWatch({ control, name: "make" });
  const model = useWatch({ control, name: "model" });
  const bodyType = useWatch({ control, name: "bodyType" });
  const models = useCarModels(make);

  const [brandQuery, setBrandQuery] = useState("");
  const [modelQuery, setModelQuery] = useState("");
  const currentYear = new Date().getFullYear();

  const yearField = register("year", {
    valueAsNumber: true,
    min: {
      value: 1900,
      message: "ავტომობილის წელი არ უნდა იყოს 1900-ზე ნაკლები",
    },
  });

  const filteredBrands = useMemo(() => {
    const q = brandQuery.trim().toLowerCase();
    if (!q) return brands;
    return brands.filter((b) => b.label.toLowerCase().includes(q));
  }, [brands, brandQuery]);

  const filteredModels = useMemo(() => {
    const q = modelQuery.trim().toLowerCase();
    if (!q) return models;
    return models.filter((m) => m.label.toLowerCase().includes(q));
  }, [models, modelQuery]);

  const selectMake = (value: string) => {
    if (make !== value) {
      setValue("model", "", { shouldValidate: true });
      setModelQuery("");
    }
    setValue("make", value, { shouldValidate: true });
  };

  return (
    <div className="space-y-8">
      {/* Brand */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <label className="text-xs font-bold tracking-[0.15em] text-text-secondary uppercase">
            მარკა
          </label>
          {make && (
            <span className="text-xs font-semibold text-primary">{make} ✓</span>
          )}
        </div>
        <div className="relative mb-3">
          <Search
            size={14}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-text-muted"
          />
          <input
            value={brandQuery}
            onChange={(e) => setBrandQuery(e.target.value)}
            placeholder="მოძებნე მარკა..."
            className="h-9 w-full rounded-md border border-border bg-surface-1 pl-8 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
          />
        </div>
        <div className="grid max-h-64 grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3 md:grid-cols-4">
          {filteredBrands.map((b) => (
            <BrandTile
              key={b.value}
              brand={b}
              selected={make === b.value}
              onClick={() => selectMake(b.value)}
            />
          ))}
          {filteredBrands.length === 0 && (
            <p className="col-span-full py-6 text-center text-sm text-text-muted">
              მარკა ვერ მოიძებნა
            </p>
          )}
        </div>
      </div>

      {/* Model */}
      <div
        className={cn(
          "transition-opacity duration-300",
          !make && "pointer-events-none opacity-40",
        )}
      >
        <label className="mb-3 block text-xs font-bold tracking-[0.15em] text-text-secondary uppercase">
          მოდელი
        </label>
        {!make ? (
          <p className="text-sm text-text-muted">ჯერ აირჩიე მარკა ზემოთ</p>
        ) : (
          <>
            <div className="relative mb-3">
              <Search
                size={14}
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-text-muted"
              />
              <input
                value={modelQuery}
                onChange={(e) => setModelQuery(e.target.value)}
                placeholder="მოძებნე მოდელი..."
                className="h-9 w-full rounded-md border border-border bg-surface-1 pl-8 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
              />
            </div>
            <div className="flex max-h-48 flex-wrap gap-2 overflow-y-auto pr-1">
              {filteredModels.map((m) => {
                const selected = model === m.value;
                return (
                  <button
                    key={m.value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setValue("model", m.value, { shouldValidate: true })}
                    className={cn(
                      "rounded-full border-2 px-4 py-2 text-sm font-medium transition-all duration-200 ease-out hover:-translate-y-0.5",
                      selected
                        ? "border-primary bg-primary/10 text-text-primary shadow-[0_0_16px_-6px_hsl(var(--primary)/0.65)]"
                        : "border-border bg-surface-1 text-text-secondary hover:border-primary/50",
                    )}
                  >
                    {m.label}
                  </button>
                );
              })}
              {filteredModels.length === 0 && (
                <p className="py-4 text-sm text-text-muted">მოდელი ვერ მოიძებნა</p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Year */}
      <div>
        <label className="mb-3 block text-xs font-bold tracking-[0.15em] text-text-secondary uppercase">
          გამოშვების წელი
        </label>
        <div className="flex items-center gap-4 rounded-lg border-2 border-border bg-surface-1 px-5 py-4 transition-colors focus-within:border-primary">
          <Gauge size={20} className="shrink-0 text-text-muted" />
          <input
            type="number"
            inputMode="numeric"
            min={1900}
            max={currentYear + 1}
            placeholder={`${currentYear}`}
            className="w-full bg-transparent font-mono text-2xl font-bold tracking-wider text-text-primary placeholder:text-text-muted/50 focus:outline-none"
            {...yearField}
          />
          <span className="shrink-0 text-xs text-text-muted">
            1900–{currentYear + 1}
          </span>
        </div>
        {errors.year?.message && (
          <p className="mt-1.5 text-xs text-error">{String(errors.year.message)}</p>
        )}
      </div>

      {/* Body type — optional, drives the CarBlueprint silhouette */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <label className="text-xs font-bold tracking-[0.15em] text-text-secondary uppercase">
            კაროსერიის ტიპი
          </label>
          <span className="text-[11px] text-text-muted">სურვილისამებრ</span>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
          {BODY_TYPES.map((bt) => (
            <SelectableCard
              key={bt.value}
              size="sm"
              title={bt.label}
              icon={BODY_TYPE_ICONS[bt.value]}
              selected={bodyType === bt.value}
              onClick={() => setValue("bodyType", bt.value, { shouldValidate: true })}
            />
          ))}
          <SelectableCard
            size="sm"
            title="არ ვიცი"
            icon={<MinusCircle size={18} />}
            selected={!bodyType}
            onClick={() => setValue("bodyType", "", { shouldValidate: true })}
          />
        </div>
      </div>
    </div>
  );
}
