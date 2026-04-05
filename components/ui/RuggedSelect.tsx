"use client";
import { ChevronDown, AlertCircle } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface RuggedSelectProps {
  label: string;
  options: readonly Option[] | Option[];
  register: any;
  name: string;
  required?: boolean;
  error?: { message?: string };
  placeholder?: string;
  disabled?: boolean;
}

export const RuggedSelect: React.FC<RuggedSelectProps> = ({
  label,
  options,
  register,
  name,
  required,
  error,
  placeholder,
  disabled,
}) => {
  const currentValue = register(name).value;
  return (
    <div
      className={`relative group ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
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

      <div className="relative">
        <div className="absolute inset-0 bg-[#292524] border border-stone-700 group-focus-within:border-amber-600/80 group-focus-within:bg-[#312e29] group-hover:border-stone-500 transition-all duration-300 skew-x-[-6deg]" />

        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-stone-500 group-focus-within:border-amber-500 transition-colors skew-x-[-6deg]" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-stone-500 group-focus-within:border-amber-500 transition-colors skew-x-[-6deg]" />

        <select
          {...register(name, { required })}
          disabled={disabled}
          className="relative z-10 w-full bg-transparent px-4 py-3 font-mono text-[#EBE9E1] text-sm outline-none appearance-none cursor-pointer skew-x-[-6deg] disabled:cursor-not-allowed"
        >
          <option value="" className="bg-[#1c1917] text-stone-500">
            {placeholder || "აირჩიეთ"}
          </option>

          {currentValue &&
            !options.find((opt) => opt.value === currentValue) && (
              <option value={currentValue}>{currentValue}</option>
            )}

          {options.map((opt) => (
            <option
              key={`${name}-${opt.value}`} // უნიკალური key თითოეული ოფციისთვის
              value={opt.value}
              className="bg-[#1c1917] text-[#EBE9E1]"
            >
              {opt.label}
            </option>
          ))}
        </select>

        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-0 text-stone-500 pointer-events-none skew-x-[-6deg] group-focus-within:text-amber-500 group-hover:text-stone-300 transition-colors">
          <ChevronDown size={16} />
        </div>
      </div>
    </div>
  );
};
