"use client";

import type { Control, FieldValues, Path } from "react-hook-form";
import { useController } from "react-hook-form";
import { cn } from "@/lib/utils";

export interface ToggleGroupOption<TValue extends string = string> {
  value: TValue;
  label: string;
}

export interface ToggleGroupProps<
  TFieldValues extends FieldValues,
  TValue extends string = string,
> {
  label?: string;
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  options: readonly ToggleGroupOption<TValue>[];
  required?: boolean;
  error?: string;
}

/**
 * Replaces RuggedToggleGroup, whose props were typed `Control<any>` — this
 * is generic over the caller's actual form-values type instead, matching
 * how every other react-hook-form-integrated field in this app is typed.
 */
export function ToggleGroup<
  TFieldValues extends FieldValues,
  TValue extends string = string,
>({
  label,
  name,
  control,
  options,
  required,
  error,
}: ToggleGroupProps<TFieldValues, TValue>) {
  const {
    field: { value, onChange },
  } = useController({ name, control, rules: { required } });

  return (
    <div>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-text-secondary">
          {label} {required && <span className="text-error">*</span>}
        </label>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                "h-9 rounded-md border px-4 text-sm font-medium transition-colors",
                isActive
                  ? "border-accent bg-accent text-background"
                  : "border-border bg-surface-1 text-text-secondary hover:border-accent/50 hover:text-text-primary",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      {error && <p className="mt-1.5 text-xs text-error">{error}</p>}
    </div>
  );
}
