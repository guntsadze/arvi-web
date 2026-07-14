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
  <div className="bg-surface-1 border border-border p-6">
    <SectionHeader icon={Gauge} title="Performance" />
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-surface-2/50 p-3 text-center border border-border">
        <span className="text-[10px] text-text-secondary uppercase block">
          Horsepower
        </span>
        <span className="text-2xl font-black text-accent">
          {car.horsepower || "---"}
        </span>
        <span className="text-[10px] text-accent block">HP</span>
      </div>
      <div className="bg-surface-2/50 p-3 text-center border border-border">
        <span className="text-[10px] text-text-secondary uppercase block">
          Torque
        </span>
        <span className="text-2xl font-black text-accent">
          {car.torque || "---"}
        </span>
        <span className="text-[10px] text-accent block">NM</span>
      </div>
    </div>
    <div className="mt-4 pt-4 border-t border-border/50">
      <DataRow
        label="Odometer"
        value={car.mileage ? `${car.mileage.toLocaleString()} km` : undefined}
        icon={Gauge}
      />
    </div>
  </div>
);
