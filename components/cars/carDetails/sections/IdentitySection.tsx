import React from "react";
import {
  ShieldCheck,
  Hash,
  FileText,
  Sparkles,
  Calendar,
  Palette,
  Car,
} from "lucide-react";
import { SectionHeader } from "../shared/SectionHeader";
import { DataRow } from "../shared/DataRow";
import { Car as CarType } from "../../../../types/car.types";

interface IdentitySectionProps {
  car: CarType;
}

export const IdentitySection: React.FC<IdentitySectionProps> = ({ car }) => (
  <div className="bg-[#201d1b] border border-stone-800 p-6">
    <SectionHeader icon={ShieldCheck} title="Identity" />
    <div className="space-y-1">
      <DataRow label="VIN / Chassis" value={car.vin} icon={Hash} />
      <DataRow label="License Plate" value={car.licensePlate} icon={FileText} />
      <DataRow label="Nickname" value={car.nickname} icon={Sparkles} />
      <DataRow label="Production Year" value={car.year} icon={Calendar} />
      <DataRow label="Exterior Color" value={car.color} icon={Palette} />
      <DataRow label="Body Style" value={car.bodyType} icon={Car} />
    </div>
  </div>
);
