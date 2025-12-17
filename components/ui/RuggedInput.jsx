"use client";
import { AlertCircle } from "lucide-react";

export const RuggedInput = ({ 
  label, 
  register, 
  name, 
  error, 
  type = "text", 
  placeholder, 
  required = false,
  fullWidth = false 
}) => (
  <div className={`relative group ${fullWidth ? "col-span-full" : ""}`}>
    {/* Label Area */}
    <div className="flex justify-between items-end mb-1 pl-1">
      <label className="uppercase tracking-[0.2em] text-[10px] font-black font-mono text-stone-500 group-focus-within:text-amber-500 transition-colors">
        {label} {required && <span className="text-amber-600">*</span>}
      </label>
      {error && (
        <span className="text-[10px] text-red-500 font-mono flex items-center gap-1 animate-pulse">
          <AlertCircle size={10} /> {error.message || "Required"}
        </span>
      )}
    </div>

    {/* Input Wrapper with Skew Effect */}
    <div className="relative">
      {/* Background Layer (Skewed) */}
      <div className="absolute inset-0 bg-[#292524] border border-stone-700 group-focus-within:border-amber-600/80 group-focus-within:bg-[#312e29] group-hover:border-stone-500 transition-all duration-300 skew-x-[-6deg]" />
      
      {/* Decorative Corners */}
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-stone-500 group-focus-within:border-amber-500 transition-colors skew-x-[-6deg]" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-stone-500 group-focus-within:border-amber-500 transition-colors skew-x-[-6deg]" />

      {/* Actual Input */}
      <input
        type={type}
        {...register(name, { required })}
        placeholder={placeholder}
        className="relative z-10 w-full bg-transparent px-4 py-3 font-mono text-[#EBE9E1] text-sm outline-none placeholder:text-stone-600 skew-x-[-6deg]"
        autoComplete="off"
      />
    </div>
  </div>
);