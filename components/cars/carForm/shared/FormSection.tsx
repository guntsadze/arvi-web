import React from "react";

interface FormSectionProps {
  title: string;
}

export const FormSection: React.FC<FormSectionProps> = ({ title }) => (
  <div className="col-span-full mt-6 mb-4 flex items-center gap-4">
    <div className="h-[1px] flex-1 bg-stone-700" />
    <span className="text-amber-600 font-black uppercase tracking-widest text-xs border border-stone-700 px-3 py-1 bg-stone-900">
      {title}
    </span>
    <div className="h-[1px] flex-1 bg-stone-700" />
  </div>
);
