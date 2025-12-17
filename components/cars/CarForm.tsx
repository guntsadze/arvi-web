"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  X,
  Save,
  Sparkles,
  AlertTriangle,
  Upload,
  Cpu,
  FileText,
  Fingerprint,
  Image as ImageIcon,
} from "lucide-react";
import { RuggedInput } from "@/components/ui/RuggedInput";
import { RuggedTextarea } from "@/components/ui/RuggedTextarea";
import { RuggedSelect } from "@/components/ui/RuggedSelect";
import { RuggedCheckbox } from "@/components/ui/RuggedCheckbox";
import { carsService } from "@/services/cars/cars.service";

// მენიუს ღილაკი
const TabButton = ({ active, onClick, icon: Icon, label, error }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-4 border-l-4 transition-all duration-200 group ${
      active
        ? "bg-stone-800 border-amber-600 text-[#EBE9E1]"
        : "border-transparent text-stone-500 hover:bg-stone-800/50 hover:text-stone-300"
    }`}
  >
    <Icon
      className={`w-5 h-5 ${
        active ? "text-amber-600" : "text-stone-600 group-hover:text-stone-400"
      } ${error ? "text-red-500" : ""}`}
    />
    <span className="font-mono text-xs uppercase tracking-widest text-left flex-1">
      {label}
    </span>
    {error && <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
  </button>
);

export const CarForm = ({ onClose, onCarSaved, initialData = null }) => {
  const isEditing = !!initialData;
  const [activeTab, setActiveTab] = useState("identity"); // 'identity', 'specs', 'registration', 'visuals'

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    trigger,
  } = useForm({
    defaultValues: {
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
    },
  });

  useEffect(() => {
    if (initialData) {
      const { id, createdAt, updatedAt, userId, ...rest } = initialData;
      Object.keys(rest).forEach((key) => setValue(key, rest[key]));
    }
  }, [initialData, setValue]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        year: Number(data.year),
        horsepower: data.horsepower ? Number(data.horsepower) : null,
        torque: data.torque ? Number(data.torque) : null,
        mileage: data.mileage ? Number(data.mileage) : null,
      };

      let savedCar;
      if (isEditing) {
        // Mock update logic or service call
        console.log("Updating:", payload);
        savedCar = { ...initialData, ...payload };
        const carId = initialData.id;
        await carsService.update(carId, savedCar);
      } else {
        savedCar = await carsService.create(payload);
      }
      onCarSaved(savedCar);
      onClose();
    } catch (error) {
      console.error("Error saving car:", error);
    }
  };

  // ამოწმებს ველებს ტაბების გადართვისას (ოპციონალური)
  const handleTabChange = async (tab) => {
    // const isValid = await trigger(); // თუ გინდა რომ გადასვლისას ვალიდაცია მოხდეს
    setActiveTab(tab);
  };

  return (
    <div className="fixed inset-0 bg-[#1c1917]/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#44403c_1px,transparent_1px)] [background-size:20px_20px]" />

      {/* Main Modal Container - Fixed Size */}
      <div className="relative z-10 w-full max-w-5xl h-[600px] bg-[#e3e1d5] flex shadow-2xl overflow-hidden border-2 border-stone-600">
        {/* LEFT SIDEBAR (Navigation) */}
        <div className="w-64 bg-[#151413] flex flex-col border-r-2 border-stone-800">
          <div className="p-6 border-b border-stone-800">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span className="text-[10px] font-mono text-stone-500 uppercase">
                System Entry
              </span>
            </div>
            <h2 className="text-xl font-black text-[#EBE9E1] uppercase tracking-tighter leading-none">
              {isEditing ? "Edit Spec" : "New Entry"}
            </h2>
          </div>

          <div className="flex-1 py-4 space-y-1">
            <TabButton
              active={activeTab === "identity"}
              onClick={() => handleTabChange("identity")}
              icon={Fingerprint}
              label="Core Identity"
              error={errors.make || errors.model || errors.year}
            />
            <TabButton
              active={activeTab === "specs"}
              onClick={() => handleTabChange("specs")}
              icon={Cpu}
              label="Technical Specs"
            />
            <TabButton
              active={activeTab === "registration"}
              onClick={() => handleTabChange("registration")}
              icon={FileText}
              label="Registration"
            />
            <TabButton
              active={activeTab === "visuals"}
              onClick={() => handleTabChange("visuals")}
              icon={ImageIcon}
              label="Manifest & Logs"
            />
          </div>

          <div className="p-4 border-t border-stone-800">
            <button
              onClick={onClose}
              className="w-full py-3 text-stone-500 hover:text-red-500 font-mono text-xs uppercase transition-colors border border-stone-800 hover:border-red-900"
            >
              Cancel Operation
            </button>
          </div>
        </div>

        {/* RIGHT SIDE (Content Form) */}
        <div className="flex-1 flex flex-col bg-[#292524] relative">
          {/* Header Bar inside Content */}
          <div className="h-16 border-b border-stone-700 flex items-center justify-between px-8 bg-[#201d1b]">
            <span className="text-amber-600 font-mono text-xs uppercase tracking-[0.2em]">
              {activeTab === "identity" &&
                "// Vehicle Identification Number & Model"}
              {activeTab === "specs" && "// Engine & Drivetrain Configuration"}
              {activeTab === "registration" && "// Legal & Odometer Data"}
              {activeTab === "visuals" && "// Visual Logs & Description"}
            </span>
            <button
              onClick={onClose}
              className="text-stone-500 hover:text-stone-300"
            >
              <X size={20} />
            </button>
          </div>

          {/* SCROLLABLE CONTENT AREA (Only inputs scroll if needed, but designed to fit) */}
          <form
            id="car-form"
            onSubmit={handleSubmit(onSubmit)}
            className="flex-1 p-8 overflow-y-auto custom-scrollbar"
          >
            {/* TAB 1: IDENTITY */}
            {activeTab === "identity" && (
              <div className="grid grid-cols-2 gap-x-8 gap-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="col-span-2 mb-4 p-4 bg-stone-800/30 border border-stone-700/50">
                  <p className="text-stone-400 text-xs font-mono">
                    Please provide the core manufacturing details. Fields marked
                    with <span className="text-amber-600">*</span> are mandatory
                    for database indexing.
                  </p>
                </div>
                <RuggedInput
                  label="Manufacturer"
                  name="make"
                  register={register}
                  required
                  placeholder="BMW"
                  error={errors.make}
                />
                <RuggedInput
                  label="Model"
                  name="model"
                  register={register}
                  required
                  placeholder="M3"
                  error={errors.model}
                />
                <RuggedInput
                  label="Year"
                  name="year"
                  type="number"
                  register={register}
                  required
                  placeholder="1998"
                  error={errors.year}
                />
                <RuggedInput
                  label="Nickname (Optional)"
                  name="nickname"
                  register={register}
                  placeholder="The Beast"
                />
              </div>
            )}

            {/* TAB 2: SPECS */}
            {activeTab === "specs" && (
              <div className="grid grid-cols-2 gap-x-8 gap-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <RuggedInput
                  label="Engine Code"
                  name="engine"
                  register={register}
                  placeholder="S50B30"
                />
                <RuggedSelect
                  label="Fuel Type"
                  name="fuelType"
                  register={register}
                  options={["PETROL", "DIESEL", "ELECTRIC", "HYBRID", "LPG"]}
                />

                <div className="grid grid-cols-2 gap-4">
                  <RuggedInput
                    label="Horsepower"
                    name="horsepower"
                    type="number"
                    register={register}
                    placeholder="286"
                  />
                  <RuggedInput
                    label="Torque (NM)"
                    name="torque"
                    type="number"
                    register={register}
                    placeholder="320"
                  />
                </div>
                <RuggedSelect
                  label="Transmission"
                  name="transmission"
                  register={register}
                  options={["MANUAL", "AUTOMATIC", "DCT", "CVT", "SEQUENTIAL"]}
                />

                <RuggedSelect
                  label="Drive Layout"
                  name="driveType"
                  register={register}
                  options={["RWD", "FWD", "AWD", "4WD"]}
                />
                <RuggedSelect
                  label="Body Style"
                  name="bodyType"
                  register={register}
                  options={["SEDAN", "COUPE", "WAGON", "HATCHBACK", "SUV"]}
                />
              </div>
            )}

            {/* TAB 3: REGISTRATION */}
            {activeTab === "registration" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-2 gap-8">
                  <RuggedInput
                    label="VIN / Chassis"
                    name="vin"
                    register={register}
                    placeholder="WBS..."
                    fullWidth
                  />
                  <RuggedInput
                    label="License Plate"
                    name="licensePlate"
                    register={register}
                    placeholder="GA-000-GE"
                  />
                  <RuggedInput
                    label="Color Code"
                    name="color"
                    register={register}
                    placeholder="Techno Violet"
                  />
                  <RuggedInput
                    label="Odometer (KM)"
                    name="mileage"
                    type="number"
                    register={register}
                    placeholder="150000"
                  />
                </div>

                <div className="border-t border-stone-700 pt-6">
                  <span className="text-stone-500 font-mono text-[10px] uppercase tracking-widest mb-4 block">
                    System Flags
                  </span>
                  <div className="flex gap-6">
                    <RuggedCheckbox
                      label="Restoration Project"
                      icon={AlertTriangle}
                      register={register}
                      name="isProject"
                    />
                    <RuggedCheckbox
                      label="Public Visibility"
                      icon={Sparkles}
                      register={register}
                      name="isPublic"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: VISUALS */}
            {activeTab === "visuals" && (
              <div className="grid grid-cols-2 gap-8 h-full animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="col-span-2 h-40">
                  <RuggedTextarea
                    label="Vehicle Manifest / History"
                    name="description"
                    register={register}
                    placeholder="Enter build details..."
                    rows={5}
                  />
                </div>

                <div className="col-span-2 mt-4">
                  <div className="relative border-2 border-dashed border-stone-600 bg-stone-800/20 hover:bg-stone-800/40 hover:border-amber-600 transition-all rounded-sm h-32 flex flex-col items-center justify-center cursor-pointer group">
                    <Upload className="w-6 h-6 text-stone-500 group-hover:text-amber-500 mb-2 transition-colors" />
                    <span className="text-stone-500 font-mono text-xs uppercase group-hover:text-stone-300">
                      Upload Media Files
                    </span>
                  </div>
                </div>
              </div>
            )}
          </form>

          {/* Fixed Footer Actions */}
          <div className="h-20 bg-[#201d1b] border-t border-stone-700 flex items-center justify-between px-8">
            <div className="flex flex-col">
              <span className="text-[10px] text-stone-600 font-mono uppercase">
                Status
              </span>
              <span className="text-xs text-amber-600 font-bold font-mono uppercase">
                {isSubmitting ? "Uploading..." : "Ready to Commit"}
              </span>
            </div>

            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="bg-amber-700 hover:bg-amber-600 text-stone-900 px-8 py-3 font-black uppercase tracking-widest flex items-center gap-3 transition-all shadow-[4px_4px_0_0_#000] active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="animate-pulse">Processing...</span>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Entry
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
