"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, Save, Sparkles, AlertTriangle, Upload } from "lucide-react";
import { RuggedInput } from "@/components/ui/RuggedInput";
import { RuggedTextarea } from "@/components/ui/RuggedTextarea";
import { RuggedSelect } from "@/components/ui/RuggedSelect";
import { RuggedCheckbox } from "@/components/ui/RuggedCheckbox";
import { carsService } from "@/services/cars/cars.service";

// სექციის გამყოფი
const FormSection = ({ title }) => (
  <div className="col-span-full mt-6 mb-4 flex items-center gap-4">
    <div className="h-[1px] flex-1 bg-stone-700" />
    <span className="text-amber-600 font-black uppercase tracking-widest text-xs border border-stone-700 px-3 py-1 bg-stone-900">
      {title}
    </span>
    <div className="h-[1px] flex-1 bg-stone-700" />
  </div>
);

export const CarForm = ({ onClose, onCarSaved, initialData = null }) => {
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
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

  // თუ რედაქტირების რეჟიმია, ჩავსვათ მონაცემები
  useEffect(() => {
    if (initialData) {
      // ვშლით ID-ს და თარიღებს, რომ არ გადაეწეროს არასწორად
      const { id, createdAt, updatedAt, userId, ...rest } = initialData;

      // სათითაოდ ვავსებთ ველებს
      Object.keys(rest).forEach((key) => {
        setValue(key, rest[key]);
      });
    }
  }, [initialData, setValue]);

  const onSubmit = async (data) => {
    try {
      // რიცხვითი მნიშვნელობების კონვერტაცია
      const payload = {
        ...data,
        year: Number(data.year),
        horsepower: data.horsepower ? Number(data.horsepower) : null,
        torque: data.torque ? Number(data.torque) : null,
        mileage: data.mileage ? Number(data.mileage) : null,
      };

      let savedCar;
      if (isEditing) {
        // აქ უნდა იყოს update მეთოდი
        // savedCar = await carsService.update(initialData.id, payload);
        console.log("Updating car:", initialData.id, payload);
        savedCar = { ...initialData, ...payload }; // Mock update
      } else {
        savedCar = await carsService.create(payload);
      }

      onCarSaved(savedCar);
      onClose();
    } catch (error) {
      console.error("Error saving car:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#1c1917] z-50 overflow-y-auto">
      {/* Background Grid (იგივე რაც DetailView-ში) */}
      <div
        className="fixed inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #44403c 1px, transparent 1px),
            linear-gradient(to bottom, #44403c 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto min-h-screen py-10 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-12 border-b-2 border-stone-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
              <span className="text-xs text-amber-600 font-mono uppercase tracking-wider">
                System Entry Interface
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-[#dcd8c8] tracking-tight uppercase">
              {isEditing ? `Edit Configuration` : "New Machine Entry"}
            </h1>
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center border-2 border-stone-700 bg-stone-800 text-stone-400 hover:text-white hover:border-red-600 hover:bg-red-900/20 transition-all duration-300"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-20">
          {/* SECTION 1: IDENTITY */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

          {/* SECTION 2: TECHNICAL SPECS */}
          <FormSection title="Technical Specifications" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-6">
              <RuggedInput
                label="Engine Code/Size"
                name="engine"
                register={register}
                placeholder="S50B30 / 3.0L"
              />
              <RuggedSelect
                label="Fuel Type"
                name="fuelType"
                register={register}
                options={[
                  "PETROL",
                  "DIESEL",
                  "ELECTRIC",
                  "HYBRID",
                  "PLUGIN_HYBRID",
                  "LPG",
                ]}
              />
            </div>
            <div className="space-y-6">
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
            </div>
            <div className="space-y-6">
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
                options={[
                  "SEDAN",
                  "COUPE",
                  "WAGON",
                  "HATCHBACK",
                  "SUV",
                  "CONVERTIBLE",
                  "TRUCK",
                ]}
              />
            </div>
          </div>

          {/* SECTION 3: REGISTRATION & DETAILS */}
          <FormSection title="Registration & Details" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <RuggedInput
              label="VIN / Chassis Code"
              name="vin"
              register={register}
              placeholder="WBS..."
            />
            <RuggedInput
              label="License Plate"
              name="licensePlate"
              register={register}
              placeholder="GA-000-GE"
            />
            <div className="grid grid-cols-2 gap-4">
              <RuggedInput
                label="Color"
                name="color"
                register={register}
                placeholder="Techno Violet"
              />
              <RuggedInput
                label="Mileage (KM)"
                name="mileage"
                type="number"
                register={register}
                placeholder="150000"
              />
            </div>
          </div>

          {/* SECTION 4: STORY & VISUALS */}
          <FormSection title="Manifest & Visuals" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <RuggedTextarea
                label="Vehicle Description / Build Story"
                name="description"
                register={register}
                placeholder="Describe modifications, history, and restoration details..."
                rows={6}
              />
            </div>

            {/* Visual Placeholder for Image Upload */}
            <div className="relative border-2 border-dashed border-stone-700 bg-stone-800/30 flex flex-col items-center justify-center p-6 text-stone-500 hover:border-amber-600 hover:text-amber-500 transition-colors cursor-pointer group h-full min-h-[160px]">
              <Upload className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs uppercase tracking-widest font-mono text-center">
                Upload Photos
              </span>
              <span className="text-[9px] text-stone-600 mt-2 font-mono text-center px-4">
                Drag drop or click to access local storage
              </span>
              {/* Hidden file input would go here */}
            </div>
          </div>

          {/* SECTION 5: CLASSIFICATION */}
          <FormSection title="System Classification" />
          <div className="flex flex-col sm:flex-row gap-6 p-6 bg-stone-800/20 border border-stone-700">
            <RuggedCheckbox
              label="Restoration Project (WIP)"
              icon={AlertTriangle}
              register={register}
              name="isProject"
            />
            <div className="h-px sm:h-auto sm:w-px bg-stone-700" />
            <RuggedCheckbox
              label="Publicly Visible"
              icon={Sparkles}
              register={register}
              name="isPublic"
            />
          </div>

          {/* ACTIONS */}
          <div className="flex gap-4 pt-10 border-t border-stone-800 sticky bottom-0 bg-[#1c1917]/95 backdrop-blur py-6 z-20">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-amber-700 text-stone-900 py-4 font-black uppercase tracking-[0.2em] hover:bg-amber-600 transition-all shadow-[0_0_20px_rgba(180,83,9,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] active:scale-[0.99] flex items-center justify-center gap-3 clip-path-slant"
            >
              {isSubmitting ? (
                "Processing Data..."
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {isEditing ? "Update Records" : "Initialize Entry"}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-4 font-bold uppercase tracking-wider text-stone-500 border-2 border-stone-800 hover:border-stone-600 hover:text-stone-300 transition-colors bg-[#1c1917]"
            >
              Abort
            </button>
          </div>
        </form>
      </div>

      {/* Scanning Line Effect */}
      <div className="fixed top-0 left-0 w-full h-1 bg-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.3)] animate-scan opacity-20 pointer-events-none z-0" />
    </div>
  );
};
