import React from "react";
import { Info } from "lucide-react";
import { SectionHeader } from "../shared/SectionHeader";
import { formatDate } from "../../../../utils/carHelpers";
import { Car } from "../../../../types/car.types";

interface HistorySectionProps {
  car: Car;
}

export const HistorySection: React.FC<HistorySectionProps> = ({ car }) => (
  <div className="bg-[#201d1b] border border-stone-800 p-6 h-full">
    <SectionHeader icon={Info} title="Build Notes / History" />

    <div className="prose prose-invert max-w-none">
      {car.description ? (
        <div className="font-mono text-sm text-[#d1cfc7] leading-relaxed whitespace-pre-wrap bg-stone-900/50 p-4 border-l-2 border-amber-600">
          {car.description}
        </div>
      ) : (
        <div className="text-stone-600 font-mono italic text-sm py-10 text-center border-2 border-dashed border-stone-800">
          No description data available in mainframe.
        </div>
      )}
    </div>

    <div className="mt-8 pt-6 border-t border-stone-800">
      <div className="flex justify-between items-center text-[10px] font-mono text-stone-500 uppercase">
        <span>Created: {formatDate(car.createdAt)}</span>
        <span>Updated: {formatDate(car.updatedAt)}</span>
      </div>
    </div>
  </div>
);
