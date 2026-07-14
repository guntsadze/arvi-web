/**
 * Shared prop shapes for components/ui primitives — kept here rather than
 * duplicated per-component so every form control (Input/Select/Textarea/
 * Checkbox/DateInput) has one consistent label/error/helperText contract.
 */
export interface FormControlProps {
  label?: string;
  error?: string;
  helperText?: string;
}

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";
