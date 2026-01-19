"use client";

import { AlertCircle, Calendar } from "lucide-react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

interface RuggedDateInputProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  control: Control<T>; // register-ის ნაცვლად ვიყენებთ control-ს
  error?: any;
  required?: boolean;
  fullWidth?: boolean;
}

export const RuggedDateInput = <T extends FieldValues>({
  label,
  control,
  name,
  error,
  required = false,
  fullWidth = false,
}: RuggedDateInputProps<T>) => (
  <div className={`relative group ${fullWidth ? "col-span-full" : ""}`}>
    <div className="flex justify-between items-end mb-1 pl-1">
      <label className="uppercase tracking-[0.2em] text-[10px] font-black font-mono text-stone-500 group-focus-within:text-amber-500 transition-colors">
        {label} {required && <span className="text-amber-600">*</span>}
      </label>

      {error && (
        <span className="text-[10px] text-red-500 font-mono flex items-center gap-1 animate-pulse">
          <AlertCircle size={10} />
          {error.message || "Required"}
        </span>
      )}
    </div>

    <div className="relative">
      <div className="absolute inset-0 bg-[#1c1917] border border-stone-800 group-focus-within:border-amber-600/80 group-focus-within:bg-[#26211e] group-hover:border-stone-600 transition-all duration-300 skew-x-[-6deg]" />

      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value, ref } }) => {
          // აქ ვჭრით ISO სტრიქონს "2026-01-19T..." -> "2026-01-19"
          const formattedValue = value
            ? new Date(value).toISOString().split("T")[0]
            : "";

          return (
            <input
              type="date"
              ref={ref}
              value={formattedValue}
              onChange={onChange}
              className="relative z-10 w-full bg-transparent px-4 py-3 font-mono text-[#EBE9E1] text-sm outline-none placeholder:text-stone-700 skew-x-[-6deg] appearance-none cursor-pointer
              [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-40 [&::-webkit-calendar-picker-indicator]:hover:opacity-100"
            />
          );
        }}
      />

      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none z-0 opacity-20 group-focus-within:opacity-50 transition-opacity">
        <Calendar size={14} className="text-amber-500" />
      </div>
    </div>
  </div>
);
