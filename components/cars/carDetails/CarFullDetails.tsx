import React from "react";
import { FileText, Settings } from "lucide-react";
import { IdentitySection } from "./sections/IdentitySection";
import { ClassificationSection } from "./sections/ClassificationSection";
import { DrivetrainSection } from "./sections/DrivetrainSection";
import { PerformanceSection } from "./sections/PerformanceSection";
import { HistorySection } from "./sections/HistorySection";
import { Car } from "../../../types/car.types";

interface CarFullDetailsProps {
  car: Car;
  onEdit: (car: Car) => void;
}

export const CarFullDetails: React.FC<CarFullDetailsProps> = ({
  car,
  onEdit,
}) => (
  <div className="relative z-10 max-w-7xl mx-auto pt-10 pb-20 px-4 md:px-8 animate-in slide-in-from-bottom-10 duration-500">
    {/* Detail Header */}
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-stone-800 pb-6">
      <div>
        <div className="flex items-center gap-2 text-amber-600 mb-2">
          <FileText size={16} />
          <span className="text-xs font-mono uppercase tracking-widest">
            Complete Vehicle Manifest
          </span>
        </div>
        <h2 className="text-4xl font-black text-[#EBE9E1] uppercase">
          {car.make} {car.model}
        </h2>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => onEdit(car)}
          className="flex items-center gap-2 px-6 py-3 bg-stone-800 hover:bg-amber-600 text-stone-400 hover:text-stone-900 font-bold uppercase tracking-wider transition-all border border-stone-700"
        >
          <Settings className="w-4 h-4" />
          <span>Edit Data</span>
        </button>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      {/* Column 1: Identity & Classification */}
      <div className="space-y-8">
        <IdentitySection car={car} />
        <ClassificationSection car={car} />
      </div>

      {/* Column 2: Technical Specs */}
      <div className="space-y-8">
        <DrivetrainSection car={car} />
        <PerformanceSection car={car} />
      </div>

      {/* Column 3: History */}
      <div className="lg:col-span-1">
        <HistorySection car={car} />
      </div>
    </div>
  </div>
);
