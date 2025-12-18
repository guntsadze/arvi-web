import React from "react";
import { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  icon?: LucideIcon;
  title: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  icon: Icon,
  title,
}) => (
  <h3 className="text-stone-500 font-mono text-xs uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
    {Icon && <Icon size={14} />}
    {title}
  </h3>
);
