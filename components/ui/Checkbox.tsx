import { forwardRef, useId } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import type { FormControlProps } from "./types";

export interface CheckboxProps
  extends Omit<FormControlProps, "helperText">,
    Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, id, className, ...props }, ref) => {
    const generatedId = useId();
    const checkboxId = id ?? generatedId;

    return (
      <div>
        <label
          htmlFor={checkboxId}
          className="inline-flex cursor-pointer items-center gap-2 text-sm text-text-primary"
        >
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            aria-invalid={!!error}
            className={cn(
              "h-4 w-4 rounded-sm border-border bg-surface-1 accent-accent",
              "focus:ring-2 focus:ring-accent/20 focus:outline-none",
              "disabled:cursor-not-allowed disabled:opacity-50",
              className,
            )}
            {...props}
          />
          {label}
        </label>
        {error && <p className="mt-1.5 text-xs text-error">{error}</p>}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";
