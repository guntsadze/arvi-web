import React, { ReactNode } from "react";

interface SpecBoxProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  sub?: string;
}

export const SpecBox: React.FC<SpecBoxProps> = ({
  icon,
  label,
  value,
  sub,
}) => {
  if (!value) return null;

  return (
    <div className="flex flex-col items-start p-4 border border-stone-800 bg-[#292524] hover:border-amber-700/50 hover:bg-[#312e29] transition-all duration-300 group cursor-pointer hover:shadow-[0_0_15px_rgba(245,158,11,0.1)] h-full justify-between">
      <div>
        <div className="mb-2 opacity-70 group-hover:opacity-100 transition-opacity text-amber-600/80 group-hover:text-amber-500">
          {icon}
        </div>
        <span className="text-[10px] text-stone-500 font-mono uppercase tracking-widest mb-1 block">
          {label}
        </span>
      </div>
      <div>
        <span className="text-lg md:text-xl font-black text-[#dcd8c8] group-hover:text-amber-500 transition-colors break-words leading-none block">
          {value}
        </span>
        {sub && (
          <span className="text-[9px] text-stone-600 font-mono mt-1 group-hover:text-stone-400 transition-colors block">
            {sub}
          </span>
        )}
      </div>
    </div>
  );
};
