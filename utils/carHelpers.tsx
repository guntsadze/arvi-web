import { ReactNode } from "react";
import { Zap, Fuel } from "lucide-react";

export const getFuelIcon = (fuelType: string): ReactNode => {
  switch (fuelType) {
    case "ELECTRIC":
    case "HYBRID":
    case "PLUGIN_HYBRID":
      return <Zap className="w-5 h-5 text-amber-600" />;
    default:
      return <Fuel className="w-5 h-5 text-amber-600" />;
  }
};

export const formatMileage = (mileage?: number): string | null => {
  if (!mileage) return null;
  return `${mileage.toLocaleString()} km`;
};

export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString();
};
