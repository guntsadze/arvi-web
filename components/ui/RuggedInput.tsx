"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";

interface RuggedInputProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  error?: FieldError;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  required?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode; // დამატებული აიქონისთვის
}

export const RuggedInput = <T extends FieldValues>({
  label,
  register,
  name,
  error,
  type = "text",
  placeholder,
  required = false,
  fullWidth = false,
  icon,
}: RuggedInputProps<T>) => (
  <div className={`relative group ${fullWidth ? "col-span-full" : ""}`}>
    {/* Label & Error Area */}
    <div className="flex justify-between items-end mb-1.5 px-1">
      <label className="uppercase tracking-[0.15em] text-[9px] font-black text-stone-500 group-focus-within:text-stone-200 transition-colors">
        {label} {required && <span className="text-orange-600">*</span>}
      </label>

      {error && (
        <span className="text-[9px] text-red-500 font-bold uppercase flex items-center gap-1 animate-pulse bg-red-500/10 px-1.5 rounded-sm">
          <AlertCircle size={10} />
          {error.message || "Error"}
        </span>
      )}
    </div>

    {/* Input Wrapper */}
    <div className="relative overflow-hidden">
      {/* Background with Skew (მხოლოდ ფონისთვის) */}
      <div
        className={`absolute inset-0 bg-stone-900/60 border border-stone-800 
        group-focus-within:border-stone-600 group-focus-within:bg-stone-800/80 
        group-hover:border-stone-700 transition-all duration-200 skew-x-[-6deg]`}
      />

      {/* Industrial Corner Accents */}
      <div className="absolute top-0 right-1 w-1.5 h-1.5 border-t border-r border-stone-600 group-focus-within:border-stone-400 skew-x-[-6deg]" />
      <div className="absolute bottom-0 left-1 w-1.5 h-1.5 border-b border-l border-stone-600 group-focus-within:border-stone-400 skew-x-[-6deg]" />

      <div className="relative flex items-center px-4">
        {/* Icon Container */}
        {icon && (
          <div className="mr-3 text-stone-500 group-focus-within:text-stone-300 transition-colors">
            {icon}
          </div>
        )}

        <input
          type={type}
          {...register(name, { required })}
          placeholder={placeholder}
          className="w-full bg-transparent py-3 font-mono text-[#EBE9E1] text-sm outline-none placeholder:text-stone-700 z-10"
          autoComplete="off"
        />
      </div>

      {/* Focus Bottom Line (Active Highlight) */}
      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-stone-400 group-focus-within:w-full transition-all duration-500" />
    </div>
  </div>
);
