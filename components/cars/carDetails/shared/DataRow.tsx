import React from "react";
import { LucideIcon } from "lucide-react";

interface DataRowProps {
  label: string;
  value?: string | number | null;
  icon?: LucideIcon;
}

export const DataRow: React.FC<DataRowProps> = ({
  label,
  value,
  icon: Icon,
}) => {
  if (!value) return null;

  return (
    <div className="flex items-center justify-between py-3 border-b border-stone-800/50 hover:bg-stone-800/20 px-2 transition-colors group">
      <div className="flex items-center gap-3">
        {Icon && (
          <Icon
            size={14}
            className="text-stone-600 group-hover:text-amber-600 transition-colors"
          />
        )}
        <span className="text-xs font-mono text-stone-500 uppercase tracking-wider">
          {label}
        </span>
      </div>
      <span className="text-sm font-bold text-[#EBE9E1] font-mono text-right">
        {value}
      </span>
    </div>
  );
};
