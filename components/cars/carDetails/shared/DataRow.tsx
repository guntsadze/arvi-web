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
    <div className="flex items-center justify-between py-3 border-b border-border/50 hover:bg-surface-1-hover/20 px-2 transition-colors group">
      <div className="flex items-center gap-3">
        {Icon && (
          <Icon
            size={14}
            className="text-text-primary group-hover:text-accent transition-colors"
          />
        )}
        <span className="text-xs font-mono text-text-secondary uppercase tracking-wider">
          {label}
        </span>
      </div>
      <span className="text-sm font-bold text-text-primary font-mono text-right">
        {value}
      </span>
    </div>
  );
};
