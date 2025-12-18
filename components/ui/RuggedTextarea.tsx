"use client";

import { AlertCircle } from "lucide-react";
import {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";

interface RuggedTextareaProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  error?: FieldError;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}

export const RuggedTextarea = <T extends FieldValues>({
  label,
  register,
  name,
  error,
  placeholder,
  rows = 4,
  required = false,
}: RuggedTextareaProps<T>) => {
  return (
    <div className="relative group col-span-full">
      {/* Label Area */}
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

      {/* Textarea Wrapper */}
      <div className="relative">
        <div className="absolute inset-0 bg-[#292524] border border-stone-700 group-focus-within:border-amber-600/50 group-focus-within:bg-[#312e29] group-hover:border-stone-500 transition-all duration-300" />

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[2px] bg-amber-600/30 group-focus-within:bg-amber-500 group-focus-within:w-24 transition-all duration-500" />

        <div className="absolute top-0 left-0 w-1 h-1 bg-stone-500 group-focus-within:bg-amber-500" />
        <div className="absolute top-0 right-0 w-1 h-1 bg-stone-500 group-focus-within:bg-amber-500" />
        <div className="absolute bottom-0 left-0 w-1 h-1 bg-stone-500 group-focus-within:bg-amber-500" />
        <div className="absolute bottom-0 right-0 w-1 h-1 bg-stone-500 group-focus-within:bg-amber-500" />

        <textarea
          {...register(name, { required })}
          rows={rows}
          placeholder={placeholder}
          className="relative z-10 w-full bg-transparent px-4 py-3 font-mono text-[#EBE9E1] text-sm outline-none placeholder:text-stone-600 resize-y"
        />
      </div>
    </div>
  );
};
