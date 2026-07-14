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
  <div className="bg-surface-1 border border-border p-6">
    <SectionHeader icon={ShieldCheck} title="იდენტიფიცირება" />
    <div className="space-y-1">
      <DataRow label="VIN - კოდი" value={car.vin} icon={Hash} />
      <DataRow
        label="სახელმწიფო ნომერი"
        value={car.licensePlate}
        icon={FileText}
      />
      <DataRow label="ზედმეტსახელი" value={car.nickname} icon={Sparkles} />
      <DataRow label="წარმოების თარიღი" value={car.year} icon={Calendar} />
      <DataRow label="ფერი" value={car.color} icon={Palette} />
      <DataRow label="ძარის ტიპი" value={car.bodyType} icon={Car} />
    </div>
  </div>
);
