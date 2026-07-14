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
    <div className="flex flex-col items-start p-4 border border-border bg-surface-2 hover:border-accent/50 hover:bg-surface-2 transition-all duration-300 group cursor-pointer hover:shadow-[0_0_15px_rgba(245,158,11,0.1)] h-full justify-between">
      <div>
        <div className="mb-2 opacity-70 group-hover:opacity-100 transition-opacity text-accent/80 group-hover:text-accent">
          {icon}
        </div>
        <span className="text-[10px] text-text-secondary font-mono uppercase tracking-widest mb-1 block">
          {label}
        </span>
      </div>
      <div>
        <span className="text-lg md:text-xl font-black text-text-primary group-hover:text-accent transition-colors break-words leading-none block">
          {value}
        </span>
        {sub && (
          <span className="text-[9px] text-text-primary font-mono mt-1 group-hover:text-text-secondary transition-colors block">
            {sub}
          </span>
        )}
      </div>
    </div>
  );
};
