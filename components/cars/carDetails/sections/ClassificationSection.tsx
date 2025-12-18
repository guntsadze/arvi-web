import React from "react";
import { Globe, Wrench, ShieldCheck, Lock } from "lucide-react";
import { SectionHeader } from "../shared/SectionHeader";
import { Car } from "../../../../types/car.types";

interface ClassificationSectionProps {
  car: Car;
}

export const ClassificationSection: React.FC<ClassificationSectionProps> = ({
  car,
}) => (
  <div className="bg-[#201d1b] border border-stone-800 p-6">
    <SectionHeader icon={Globe} title="Classification" />
    <div className="flex flex-col gap-3">
      {car.isProject ? (
        <span className="flex items-center gap-2 p-3 bg-amber-900/20 border border-amber-800/50 text-amber-500 text-xs font-mono uppercase">
          <Wrench size={14} /> Active Restoration Project
        </span>
      ) : (
        <span className="flex items-center gap-2 p-3 bg-emerald-900/20 border border-emerald-800/50 text-emerald-500 text-xs font-mono uppercase">
          <ShieldCheck size={14} /> Road Worthy Status
        </span>
      )}
      {car.isPublic ? (
        <span className="flex items-center gap-2 p-3 bg-stone-800 border border-stone-700 text-stone-400 text-xs font-mono uppercase">
          <Globe size={14} /> Visible in Public Index
        </span>
      ) : (
        <span className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-900/50 text-red-500 text-xs font-mono uppercase">
          <Lock size={14} /> Restricted / Private
        </span>
      )}
    </div>
  </div>
);
