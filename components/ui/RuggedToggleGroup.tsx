"use client";
import { useController, Control } from "react-hook-form";

interface Option {
  value: string;
  label: string;
}

interface RuggedToggleGroupProps {
  label: string;
  name: string;
  options: readonly Option[] | Option[];
  control: Control<any>;
  required?: boolean;
}

export const RuggedToggleGroup: React.FC<RuggedToggleGroupProps> = ({
  label,
  name,
  options,
  control,
  required,
}) => {
  const {
    field: { value, onChange },
  } = useController({
    name,
    control,
    rules: { required },
  });

  return (
    <div className="relative group">
      {/* Label Area */}
      <div className="flex justify-between items-end mb-2 pl-1">
        <label className="uppercase tracking-[0.2em] text-[10px] font-black font-mono text-stone-500 group-focus-within:text-amber-500 transition-colors">
          {label} {required && <span className="text-amber-600">*</span>}
        </label>
      </div>

      {/* Buttons Grid */}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isActive = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className="relative h-10 group/btn outline-none"
            >
              {/* Background Layer (Skewed) */}
              <div
                className={`absolute inset-0 transition-all duration-200 skew-x-[-12deg] border 
                ${
                  isActive
                    ? "bg-amber-500 border-amber-600 shadow-[3px_3px_0px_0px_rgba(245,158,11,0.2)]"
                    : "bg-[#292524] border-stone-700 hover:border-stone-500"
                }`}
              />

              {/* Button Text */}
              <span
                className={`relative z-10 px-4 font-mono text-[11px] font-bold uppercase tracking-wider transition-colors skew-x-[-12deg]
                ${isActive ? "text-stone-900" : "text-stone-400 group-hover/btn:text-[#EBE9E1]"}`}
              >
                <span className="inline-block skew-x-[12deg]">{opt.label}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
