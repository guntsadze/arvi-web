import { forwardRef, useId } from "react";
import type { ForwardedRef, ReactElement, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import type { FormControlProps } from "./types";

export interface SelectOption<TValue extends string = string> {
  value: TValue;
  label: string;
  disabled?: boolean;
}

export interface SelectProps<TValue extends string = string>
  extends FormControlProps,
    SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption<TValue>[];
  placeholder?: string;
}

/**
 * Generic on the *options* shape only (SelectOption<TValue>[]), not on a
 * custom onChange signature — this stays a plain extension of
 * SelectHTMLAttributes, so `{...register('make')}` from react-hook-form
 * spreads onto it directly with zero type assertions or value casting.
 *
 * forwardRef doesn't preserve generics through its own type signature, so
 * the inner function is generic and the exported binding is annotated with
 * an explicit generic call signature — the standard, documented pattern for
 * combining forwardRef with a generic component (not a workaround cast).
 */
function SelectInner<TValue extends string = string>(
  {
    label,
    error,
    helperText,
    options,
    placeholder,
    id,
    className,
    ...props
  }: SelectProps<TValue>,
  ref: ForwardedRef<HTMLSelectElement>,
) {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="mb-1.5 block text-sm font-medium text-text-secondary"
        >
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        aria-invalid={!!error}
        defaultValue={props.defaultValue ?? (placeholder ? "" : undefined)}
        className={cn(
          "h-10 w-full rounded-md border border-border bg-surface-1 px-3 text-sm text-text-primary transition-colors",
          "focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-error focus:border-error focus:ring-error/20",
          className,
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <p className="mt-1.5 text-xs text-error">{error}</p>
      ) : helperText ? (
        <p className="mt-1.5 text-xs text-text-muted">{helperText}</p>
      ) : null}
    </div>
  );
}

export const Select = forwardRef(SelectInner) as <TValue extends string = string>(
  props: SelectProps<TValue> & { ref?: ForwardedRef<HTMLSelectElement> },
) => ReactElement;

/**
 * Adapts a plain literal-union string array (the common shape for enum-like
 * form field constants, e.g. `["ORIGINAL", "REPAINTED"] as const`) into
 * `SelectOption[]` for feeding directly to `Select`, without a value/label
 * distinction. Use when the constant is also the source of a field's
 * literal string type (`(typeof X)[number]`), so the constant itself must
 * stay a plain string array.
 */
export function toSelectOptions<TValue extends string>(
  values: readonly TValue[],
): SelectOption<TValue>[] {
  return values.map((value) => ({ value, label: value }));
}
