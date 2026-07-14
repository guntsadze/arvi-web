import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Input } from "./Input";
import type { InputProps } from "./Input";

export type DateInputProps = Omit<InputProps, "type" | "leftIcon">;

/**
 * Thin wrapper over Input rather than a parallel implementation — forces
 * type="date" and [color-scheme:dark] so the native date-picker popup
 * renders dark instead of the browser-default white (this app is dark-only).
 */
export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ className, ...props }, ref) => (
    <Input
      ref={ref}
      type="date"
      className={cn("[color-scheme:dark]", className)}
      {...props}
    />
  ),
);

DateInput.displayName = "DateInput";
