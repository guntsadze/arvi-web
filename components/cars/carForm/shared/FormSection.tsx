import React from "react";

interface FormSectionProps {
  title: string;
}

export const FormSection: React.FC<FormSectionProps> = ({ title }) => (
  <div className="col-span-full mt-6 mb-4 flex items-center gap-4">
    <div className="h-[1px] flex-1 bg-surface-2" />
    <span className="text-accent font-black uppercase tracking-widest text-xs border border-border px-3 py-1 bg-surface-1">
      {title}
    </span>
    <div className="h-[1px] flex-1 bg-surface-2" />
  </div>
);
