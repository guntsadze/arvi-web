import { CarFormData } from "@/types/carForm.types";

// Values must match the backend's Prisma enums exactly (prisma/schema.prisma
// FuelType/TransmissionType/DriveType) — this file previously had several
// values that don't exist backend-side (PLUG_IN_HYBRID vs PLUGIN_HYBRID,
// GAS vs LPG, TIPTRONIC/SEQUENTIAL which have no backend equivalent at all,
// 4WD vs FOURWD), so selecting them would fail @IsEnum validation on submit.
export const FUEL_TYPES = [
  { value: "PETROL", label: "ბენზინი" },
  { value: "DIESEL", label: "დიზელი" },
  { value: "HYBRID", label: "ჰიბრიდი" },
  { value: "PLUGIN_HYBRID", label: "დატენვადი ჰიბრიდი (PHEV)" },
  { value: "ELECTRIC", label: "ელექტრო" },
  { value: "LPG", label: "თხევადი გაზი / LPG" },
  { value: "CNG", label: "ბუნებრივი გაზი" },
  { value: "HYDROGEN", label: "წყალბადი" },
] as const;

export const TRANSMISSION_TYPES = [
  { value: "MANUAL", label: "მექანიკური" },
  { value: "AUTOMATIC", label: "ავტომატიკა" },
  { value: "SEMI_AUTOMATIC", label: "ნახევრად ავტომატური" },
  { value: "CVT", label: "ვარიატორი" },
  { value: "DCT", label: "DCT (ორმაგი გადაბმულობა)" },
] as const;

export const DRIVE_TYPES = [
  { value: "FWD", label: "წინა წამყვანი (FWD)" },
  { value: "RWD", label: "უკანა წამყვანი (RWD)" },
  { value: "AWD", label: "სრული (AWD)" },
  { value: "FOURWD", label: "4x4 (4WD)" },
] as const;

// Matches the new backend CarCharacter enum (prisma/schema.prisma).
export const CAR_CHARACTER_TAGS = [
  { value: "DAILY_DRIVER", label: "ყოველდღიური" },
  { value: "PROJECT_CAR", label: "პროექტი" },
  { value: "TRACK_BEAST", label: "სავარჯიშო/რბოლის მანქანა" },
  { value: "GARAGE_QUEEN", label: "გარაჟის დედოფალი" },
  { value: "STOCK", label: "საფაბრიკო მდგომარეობა" },
] as const;

// Matches the backend BodyType enum exactly (prisma/schema.prisma) — this
// previously had CABRIOLET/MICROVAN, which don't exist backend-side, and was
// missing CONVERTIBLE/CROSSOVER/VAN/SPORTS_CAR/SUPERCAR entirely, the same
// class of drift FUEL_TYPES/TRANSMISSION_TYPES/DRIVE_TYPES had.
export const BODY_TYPES = [
  { value: "SEDAN", label: "სედანი" },
  { value: "COUPE", label: "კუპე" },
  { value: "CONVERTIBLE", label: "კაბრიოლეტი" },
  { value: "HATCHBACK", label: "ჰეჩბექი" },
  { value: "WAGON", label: "უნივერსალი" },
  { value: "SUV", label: "ჯიპი / SUV" },
  { value: "CROSSOVER", label: "კროსოვერი" },
  { value: "PICKUP", label: "პიკაპი" },
  { value: "VAN", label: "ფურგონი" },
  { value: "MINIVAN", label: "მინივენი" },
  { value: "SPORTS_CAR", label: "სპორტული" },
  { value: "SUPERCAR", label: "სუპერკარი" },
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
  paintCode: "",
  bodyType: undefined,
  mileage: "",
  description: "",
  isProject: false,
  characterTag: undefined,
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
