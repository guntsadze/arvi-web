import React from "react";
import { Info } from "lucide-react";
import { SectionHeader } from "../shared/SectionHeader";
import { formatDate } from "../../../../utils/carHelpers";
import { Car } from "../../../../types/car.types";

interface HistorySectionProps {
  car: Car;
}

export const HistorySection: React.FC<HistorySectionProps> = ({ car }) => (
  <div className="bg-surface-1 border border-border p-6 h-full">
    <SectionHeader icon={Info} title="სერვისები /  ისტორია" />

    <div className="prose prose-invert max-w-none">
      {car.description ? (
        <div className="font-mono text-sm text-text-secondary leading-relaxed whitespace-pre-wrap bg-surface-1/50 p-4 border-l-2 border-accent">
          {car.description}
        </div>
      ) : (
        <div className="text-text-secondary font-mono italic text-sm py-10 text-center border-2 border-dashed border-border">
          No description data available in mainframe.
        </div>
      )}
    </div>

    <div className="mt-8 pt-6 border-t border-border">
      <div className="flex justify-between items-center text-[10px] font-mono text-text-secondary uppercase">
        <span>დარეგისტრირდა: {formatDate(car.createdAt)}</span>
        <span>განახლდა: {formatDate(car.updatedAt)}</span>
      </div>
    </div>
  </div>
);
