import React from "react";
import { Gauge } from "lucide-react";
import { SectionHeader } from "../shared/SectionHeader";
import { DataRow } from "../shared/DataRow";
import { Car } from "../../../../types/car.types";

interface PerformanceSectionProps {
  car: Car;
}

export const PerformanceSection: React.FC<PerformanceSectionProps> = ({
  car,
}) => (
  <div className="bg-[#201d1b] border border-stone-800 p-6">
    <SectionHeader icon={Gauge} title="Performance" />
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-stone-800/50 p-3 text-center border border-stone-700">
        <span className="text-[10px] text-stone-500 uppercase block">
          Horsepower
        </span>
        <span className="text-2xl font-black text-amber-500">
          {car.horsepower || "---"}
        </span>
        <span className="text-[10px] text-amber-700 block">HP</span>
      </div>
      <div className="bg-stone-800/50 p-3 text-center border border-stone-700">
        <span className="text-[10px] text-stone-500 uppercase block">
          Torque
        </span>
        <span className="text-2xl font-black text-amber-500">
          {car.torque || "---"}
        </span>
        <span className="text-[10px] text-amber-700 block">NM</span>
      </div>
    </div>
    <div className="mt-4 pt-4 border-t border-stone-800/50">
      <DataRow
        label="Odometer"
        value={car.mileage ? `${car.mileage.toLocaleString()} km` : undefined}
        icon={Gauge}
      />
    </div>
  </div>
);
