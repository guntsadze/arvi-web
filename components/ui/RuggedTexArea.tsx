"use client";

import { AlertCircle } from "lucide-react";
import {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";

interface RuggedTextAreaProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  error?: FieldError;
  required?: boolean;
  placeholder?: string;
  rows?: number;
  className?: string;
}

export const RuggedTextArea = <T extends FieldValues>({
  label,
  register,
  name,
  error,
  required = false,
  placeholder,
  rows = 4,
  className = "",
}: RuggedTextAreaProps<T>) => (
  <div className={`relative group ${className}`}>
    {/* Label & Error Row */}
    <div className="flex justify-between items-end mb-1 pl-1">
      <label className="uppercase tracking-[0.2em] text-[10px] font-black font-mono text-stone-300 group-focus-within:text-orange-500 transition-colors">
        {label} {required && <span className="text-orange-600">*</span>}
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
      {/* Skewed Background - თექსთარეასთვის უფრო მცირე დახრა (-2deg) უკეთესია, რომ ტექსტი არ აიჭრას */}
      <div className="absolute inset-0 bg-[#1c1917] border border-stone-800 group-focus-within:border-orange-600/50 group-focus-within:bg-[#26211e] group-hover:border-stone-600 transition-all duration-300 skew-x-[-1deg]" />

      {/* Decorative Corners */}
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-stone-600 group-focus-within:border-orange-500 skew-x-[-1deg]" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-stone-600 group-focus-within:border-orange-500 skew-x-[-1deg]" />

      {/* The Textarea */}
      <textarea
        {...register(name, { required })}
        rows={rows}
        placeholder={placeholder}
        className="relative z-10 w-full bg-transparent px-4 py-3 font-mono text-[#EBE9E1] text-sm outline-none placeholder:text-stone-700 resize-none transition-all
        scrollbar-thin scrollbar-thumb-stone-800 scrollbar-track-transparent"
      />
    </div>
  </div>
);
