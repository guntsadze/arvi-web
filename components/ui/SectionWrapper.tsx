import React from "react";

interface SectionWrapperProps {
  title: string;
  children: React.ReactNode;
}

export const SectionWrapper: React.FC<SectionWrapperProps> = ({
  title,
  children,
}) => {
  return (
    <div className="py-8 border-t border-stone-800/50">
      <h2 className="text-xl font-mono text-stone-200 mb-6 uppercase tracking-wider">
        {title}
      </h2>
      <div className="bg-stone-900/40 border border-stone-800/50 rounded-lg p-6">
        {children}
      </div>
    </div>
  );
};
