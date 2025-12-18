export interface Car {
  id: string | number;
  make: string;
  model: string;
  year: number;
  nickname?: string;
  vin?: string;
  licensePlate?: string;
  color?: string;
  bodyType?: string;
  engine?: string;
  engineCapacity?: number;
  fuelType: string;
  transmission: string;
  driveType?: string;
  horsepower?: number;
  torque?: number;
  mileage?: number;
  description?: string;
  isProject?: boolean;
  isPublic?: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export type ViewMode = "overview" | "full";

export type FuelType =
  | "ELECTRIC"
  | "HYBRID"
  | "PLUGIN_HYBRID"
  | "PETROL"
  | "DIESEL"
  | "GAS";
