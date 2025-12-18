import { CarFormData } from "@/types/carForm.types";

export const FUEL_TYPES = [
  "PETROL",
  "DIESEL",
  "ELECTRIC",
  "HYBRID",
  "PLUGIN_HYBRID",
  "LPG",
] as const;

export const TRANSMISSION_TYPES = [
  "MANUAL",
  "AUTOMATIC",
  "DCT",
  "CVT",
  "SEQUENTIAL",
] as const;

export const DRIVE_TYPES = ["RWD", "FWD", "AWD", "4WD"] as const;

export const BODY_TYPES = [
  "SEDAN",
  "COUPE",
  "WAGON",
  "HATCHBACK",
  "SUV",
  "CONVERTIBLE",
  "TRUCK",
] as const;

export const DEFAULT_FORM_VALUES: CarFormData = {
  make: "",
  model: "",
  year: "",
  nickname: "",
  vin: "",
  licensePlate: "",
  engine: "",
  horsepower: "",
  torque: "",
  fuelType: "PETROL",
  transmission: "MANUAL",
  driveType: "RWD",
  color: "",
  bodyType: "",
  mileage: "",
  description: "",
  isProject: false,
  isPublic: true,
  images: [],
};
