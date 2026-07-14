import { forwardRef, useId } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { FormControlProps } from "./types";

export interface InputProps
  extends FormControlProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  leftIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, helperText, leftIcon, id, className, ...props },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-text-secondary"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-text-muted">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            className={cn(
              "h-10 w-full rounded-md border border-border bg-surface-1 px-3 text-sm text-text-primary transition-colors placeholder:text-text-muted",
              "focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none",
              "disabled:cursor-not-allowed disabled:opacity-50",
              leftIcon && "pl-9",
              error && "border-error focus:border-error focus:ring-error/20",
              className,
            )}
            {...props}
          />
        </div>
        {error ? (
          <p className="mt-1.5 text-xs text-error">{error}</p>
        ) : helperText ? (
          <p className="mt-1.5 text-xs text-text-muted">{helperText}</p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";
