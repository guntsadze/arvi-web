export interface CarFormData {
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
  images?: File[];
}

export interface CarFormProps {
  onClose: () => void;
  onCarSaved: (car: any) => void;
  initialData?: any;
}
