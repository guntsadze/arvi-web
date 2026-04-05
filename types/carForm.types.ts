export interface CarFormProps {
  onClose: () => void;
  initialData?: any;
  onSuccess: () => void;
}

// types/carForm.types.ts

export const PAINT_CONDITION_OPTIONS = [
  "ORIGINAL",
  "REPAINTED",
  "MINOR_SCRATCHES",
  "MAJOR_SCRATCHES",
] as const;

export const EXHAHAUST_CONDITION_OPTIONS = ["ORIGINAL"];

export const GLASS_STATE_OPTIONS = ["ORIGINAL", "REPLACED", "CRACKED"] as const;

export const OIL_CONDITION_OPTIONS = ["CLEAN", "DARK", "NEEDS_CHANGE"] as const;

export const INTERIOR_GRADE_OPTIONS = ["EXCELLENT", "GOOD", "STAINED"] as const;

export const SUSPENSION_STATUS_OPTIONS = [
  "SOLID",
  "NOISES",
  "NEEDS_REPAIR",
] as const;

export const EXHAUST_CONDITION_OPTIONS = ["CLEAN", "RUSTY", "LEAKING"] as const;

export const TRANSMISSION_SHIFT_OPTIONS = [
  "SMOOTH",
  "JERKY",
  "SLIPPING",
] as const;

export const BRAKE_CONDITION_OPTIONS = [
  "RESPONSIVE",
  "SOFT",
  "VIBRATING",
] as const;

export const COOLANT_STATUS_OPTIONS = ["CLEAR", "MIXED_WITH_OIL"] as const;

export type CarFormData = {
  make: string;
  model: string;
  year: string | number;
  nickname?: string;
  vin?: string;
  licensePlate?: string;
  engine?: string;
  horsepower?: string | number;
  torque?: string | number;
  fuelType: string;
  transmission: string;
  driveType: string;
  color?: string;
  bodyType?: string;
  mileage?: string | number;
  description?: string;
  isProject: boolean;
  isPublic: boolean;
  photos?: any[];

  inspection: {
    // Exterior & Chassis
    bodyCondition?: (typeof PAINT_CONDITION_OPTIONS)[number];
    hasRust: boolean;
    panelSymmetry: boolean;
    glassCondition?: (typeof GLASS_STATE_OPTIONS)[number];

    tireTreadDepth?: number;
    tireAge?: number;
    tireUniformity: boolean;
    chassisCondition?: string;
    suspensionStatus?: (typeof SUSPENSION_STATUS_OPTIONS)[number];

    // Lighting & Exhaust
    lightsFunctional: boolean;
    exhaustCondition?: (typeof EXHAUST_CONDITION_OPTIONS)[number];
    catalystPresent: boolean;

    // Interior & Electronics
    interiorCondition?: (typeof INTERIOR_GRADE_OPTIONS)[number];
    isSmokedIn: boolean;
    hasWaterDamage: boolean;
    acFunctional: boolean;
    dashboardWarnings?: string;
    airbagsIntact: boolean;

    // Engine & Transmission
    engineOilStatus?: (typeof OIL_CONDITION_OPTIONS)[number];
    coolantStatus?: (typeof COOLANT_STATUS_OPTIONS)[number];
    engineNoise?: string;
    transmissionShift?: (typeof TRANSMISSION_SHIFT_OPTIONS)[number];
    brakeCondition?: (typeof BRAKE_CONDITION_OPTIONS)[number];
    oilLeaking: boolean;

    inspectorNotes?: string;

    // --- 1-10 Rating Fields ---
    exteriorVisualRating: number; // ექსტერიერის ვიზუალური მიმზიდველობა
    chassisStructuralRating: number; // შასის გამართულობა
    lightsExhaustRating: number; // განათება და გამონაბოლქვი
    cabinComfortTechRating: number; // სალონის კომფორტი და ტექნიკა
    drivetrainPerformanceRating: number; // ძრავის და მექანიკის გამართულობა
  };
};
