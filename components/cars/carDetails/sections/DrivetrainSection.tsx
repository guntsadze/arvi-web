import React from "react";
import { Cpu, Activity, Gauge, Fuel, Settings, Move } from "lucide-react";
import { SectionHeader } from "../shared/SectionHeader";
import { DataRow } from "../shared/DataRow";
import { Car } from "../../../../types/car.types";

interface DrivetrainSectionProps {
  car: Car;
}

export const DrivetrainSection: React.FC<DrivetrainSectionProps> = ({
  car,
}) => (
  <div className="bg-surface-1 border border-border p-6">
    <SectionHeader icon={Cpu} title="Drivetrain" />
    <div className="space-y-1">
      <DataRow label="ძრავი" value={car.engine} icon={Activity} />
      <DataRow
        label="Displacement"
        value={car.engineCapacity ? `${car.engineCapacity}L` : undefined}
        icon={Gauge}
      />
      <DataRow label="საწვავის ტიპი" value={car.fuelType} icon={Fuel} />
      <DataRow
        label="გადაცემათა კოლოფი"
        value={car.transmission}
        icon={Settings}
      />
      <DataRow label="წამყვანი თვლები" value={car.driveType} icon={Move} />
    </div>
  </div>
);
