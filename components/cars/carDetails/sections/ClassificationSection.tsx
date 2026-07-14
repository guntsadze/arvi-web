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
  <div className="bg-surface-1 border border-border p-6">
    <SectionHeader icon={Globe} title="Classification" />
    <div className="flex flex-col gap-3">
      {car.isProject ? (
        <span className="flex items-center gap-2 p-3 bg-accent/10 border border-accent/50 text-accent text-xs font-mono uppercase">
          <Wrench size={14} /> Active Restoration Project
        </span>
      ) : (
        <span className="flex items-center gap-2 p-3 bg-success/10/20 border border-success/50 text-success text-xs font-mono uppercase">
          <ShieldCheck size={14} /> Road Worthy Status
        </span>
      )}
      {car.isPublic ? (
        <span className="flex items-center gap-2 p-3 bg-surface-2 border border-border text-text-secondary text-xs font-mono uppercase">
          <Globe size={14} /> Visible in Public Index
        </span>
      ) : (
        <span className="flex items-center gap-2 p-3 bg-error/10/20 border border-error/50 text-error text-xs font-mono uppercase">
          <Lock size={14} /> Restricted / Private
        </span>
      )}
    </div>
  </div>
);
