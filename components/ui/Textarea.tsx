import { forwardRef, useId } from "react";
import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import type { FormControlProps } from "./types";

export interface TextareaProps
  extends FormControlProps,
    TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, id, className, rows = 4, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id ?? generatedId;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="mb-1.5 block text-sm font-medium text-text-secondary"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          aria-invalid={!!error}
          className={cn(
            "w-full resize-y rounded-md border border-border bg-surface-1 px-3 py-2 text-sm text-text-primary transition-colors placeholder:text-text-muted",
            "focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-error focus:border-error focus:ring-error/20",
            className,
          )}
          {...props}
        />
        {error ? (
          <p className="mt-1.5 text-xs text-error">{error}</p>
        ) : helperText ? (
          <p className="mt-1.5 text-xs text-text-muted">{helperText}</p>
        ) : null}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
