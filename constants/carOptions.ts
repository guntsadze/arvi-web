import { CarFormData } from "@/types/carForm.types";

export const FUEL_TYPES = [
  { value: "PETROL", label: "ბენზინი" },
  { value: "DIESEL", label: "დიზელი" },
  { value: "HYBRID", label: "ჰიბრიდი" },
  { value: "PLUG_IN_HYBRID", label: "დატენვადი ჰიბრიდი (PHEV)" },
  { value: "ELECTRIC", label: "ელექტრო" },
  { value: "GAS", label: "თხევადი გაზი / LPG" },
  { value: "CNG", label: "ბუნებრივი გაზი" },
] as const;

export const TRANSMISSION_TYPES = [
  { value: "MANUAL", label: "მექანიკური" },
  { value: "AUTOMATIC", label: "ავტომატიკა" },
  { value: "TIPTRONIC", label: "ტიპტრონიკი" },
  { value: "DCT", label: "DCT (ორმაგი გადაბმულობა)" },
  { value: "CVT", label: "ვარიატორი" },
  { value: "SEQUENTIAL", label: "სეკვენტალური" },
] as const;

export const DRIVE_TYPES = [
  { value: "FWD", label: "წინა წამყვანი (FWD)" },
  { value: "RWD", label: "უკანა წამყვანი (RWD)" },
  { value: "AWD", label: "სრული (AWD)" },
  { value: "4WD", label: "4x4 (4WD)" },
] as const;

export const BODY_TYPES = [
  { value: "SEDAN", label: "სედანი" },
  { value: "COUPE", label: "კუპე" },
  { value: "SUV", label: "ჯიპი / SUV" },
  { value: "HATCHBACK", label: "ჰეჩბექი" },
  { value: "WAGON", label: "უნივერსალი" },
  { value: "MINIVAN", label: "მინივენი" },
  { value: "CABRIOLET", label: "კაბრიოლეტი" },
  { value: "PICKUP", label: "პიკაპი" },
  { value: "MICROVAN", label: "მიკროავტობუსი" },
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
  photos: [],

  inspection: {
    hasRust: false,
    panelSymmetry: true,
    tireUniformity: true,
    lightsFunctional: true,
    catalystPresent: true,
    isSmokedIn: false,
    hasWaterDamage: false,
    acFunctional: true,
    airbagsIntact: true,
    oilLeaking: false,
    exteriorVisualRating: 5,
    chassisStructuralRating: 5,
    lightsExhaustRating: 5,
    cabinComfortTechRating: 5,
    drivetrainPerformanceRating: 5,
  },
};

export const MODIFICATIONS_TYPES = [
  { value: "ENGINE", label: "ძრავის განახლება" },
  { value: "EXHAUST", label: "გამშვები სისტემა" },
  { value: "SUSPENSION", label: "სავალი ნაწილი / დაკიდება" },
  { value: "BRAKES", label: "სამუხრუჭე სისტემა" },
  { value: "WHEELS", label: "დისკები" },
  { value: "TIRES", label: "საბურავები" },
  { value: "EXTERIOR", label: "ექსტერიერი" },
  { value: "INTERIOR", label: "ინტერიერი" },
  { value: "ELECTRONICS", label: "ელექტრონიკა" },
  { value: "AUDIO", label: "აუდიო სისტემა" },
  { value: "LIGHTING", label: "განათება" },
  { value: "PERFORMANCE", label: "წარმადობის გაუმჯობესება" },
  { value: "COSMETIC", label: "კოსმეტიკური ცვლილებები" },
  { value: "OTHER", label: "სხვა" },
] as const;

export const MAINTENANCE_TYPES = [
  { value: "OIL_CHANGE", label: "ზეთის შეცვლა" },
  { value: "TIRE_ROTATION", label: "საბურავების როტაცია/ბალანსი" },
  { value: "BRAKE_SERVICE", label: "მუხრუჭების სერვისი" },
  { value: "ENGINE_SERVICE", label: "ძრავის სერვისი" },
  { value: "TRANSMISSION_SERVICE", label: "გადაცემათა კოლოფის სერვისი" },
  { value: "INSPECTION", label: "ტექნიკური დათვალიერება" },
  { value: "REPAIR", label: "შეკეთება / რემონტი" },
  { value: "MODIFICATION", label: "მოდიფიკაციის ინსტალაცია" },
  { value: "DETAILING", label: "დეტეილინგი" },
  { value: "OTHER", label: "სხვა" },
] as const;
