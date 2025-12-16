"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Plus,
  Zap,
  Fuel,
  Settings,
  Eye,
  EyeOff,
  Wrench,
  Calendar,
  Gauge,
  Car,
  ChevronDown,
  X,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
// შეცვალე გზა შენი ფაილების მიხედვით
import { carsService } from "@/services/cars/cars.service";
import Input from "@/components/ui/Input";

// --- Helper Component: Rugged Select ---
const RuggedSelect = ({ label, options, register, name, required }) => (
  <div className="relative w-full">
    <div className="flex items-center justify-between mb-1 pl-2">
      <label className="uppercase tracking-[0.2em] text-[10px] font-black font-mono text-[#EBE9E1]">
        {label}
      </label>
    </div>
    <div className="relative group h-16">
      <div className="absolute inset-0 bg-[#1a1918] transform translate-x-1 translate-y-1 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
      <div className="absolute inset-0 bg-[#EBE9E1] border-2 border-stone-800" />
      <select
        {...register(name, { required })}
        className="relative z-10 w-full h-full bg-transparent px-4 font-serif text-xl text-stone-900 outline-none appearance-none cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-0 text-stone-600 pointer-events-none">
        <ChevronDown size={24} />
      </div>
    </div>
  </div>
);

// --- Helper Component: Rugged Checkbox ---
const RuggedCheckbox = ({ label, icon: Icon, register, name }) => (
  <label className="relative flex items-center gap-4 cursor-pointer group p-4 border-2 border-stone-600 border-dashed hover:border-amber-500 hover:bg-stone-800/50 transition-all">
    <input type="checkbox" {...register(name)} className="peer sr-only" />
    <div className="w-6 h-6 border-2 border-[#EBE9E1] bg-stone-900 peer-checked:bg-amber-500 peer-checked:border-amber-500 transition-colors flex items-center justify-center">
      <div className="w-4 h-1 bg-stone-900 transform -rotate-45 hidden peer-checked:block" />
    </div>
    <span className="text-[#EBE9E1] font-mono uppercase tracking-wider text-xs flex items-center gap-2 group-hover:text-amber-400 transition-colors">
      <Icon className="w-4 h-4" />
      {label}
    </span>
  </label>
);

// --- CAR DETAIL VIEW Component (E34 Hero Style) ---
const CarDetailView = ({ car, onClose }) => {
  const getFuelIcon = (fuelType) => {
    switch (fuelType) {
      case "ELECTRIC":
      case "HYBRID":
      case "PLUGIN_HYBRID":
        return <Zap className="text-amber-600" />;
      default:
        return <Fuel className="text-amber-600" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-[#1c1917] z-50 overflow-y-auto">
      {/* Blueprint Grid Background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, #44403c 1px, transparent 1px),
            linear-gradient(to bottom, #44403c 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Decorative Background Text */}
      <div className="absolute top-10 left-4 md:left-20 text-[120px] md:text-[200px] font-black text-stone-800/40 leading-none select-none z-0 tracking-tighter">
        {car.make}
      </div>
      <div className="absolute bottom-0 right-0 text-[100px] md:text-[180px] font-black text-stone-800/30 leading-none select-none z-0 tracking-tighter">
        {car.year}
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto min-h-screen flex flex-col justify-center items-center pt-20 pb-10 px-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 left-6 md:top-10 md:left-10 flex items-center gap-2 px-6 py-3 bg-stone-800 hover:bg-amber-600 text-[#EBE9E1] hover:text-stone-900 font-bold uppercase tracking-wider transition-all duration-300 border-2 border-stone-700 hover:border-amber-600"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden md:inline">Back</span>
        </button>

        {/* Header Badge */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 border border-amber-700/30 bg-amber-950/20 rounded-full">
            <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
            <span className="text-xs md:text-sm text-amber-600 font-mono uppercase tracking-wider">
              Vehicle Specification
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-[#dcd8c8] mb-3 tracking-tight">
            {car.make} {car.model}
          </h1>
          <p className="text-sm md:text-base text-stone-400 font-mono">
            Year: <span className="text-amber-600">{car.year}</span>
            {car.engineCapacity && (
              <>
                {" "}
                | Engine:{" "}
                <span className="text-amber-600">{car.engineCapacity}L</span>
              </>
            )}
          </p>
        </div>

        {/* Car Visual Area (Placeholder for now - you can add image later) */}
        <div className="relative w-full max-w-5xl aspect-[16/9] md:aspect-[21/9] flex items-center justify-center group mb-10">
          <div className="relative w-full h-full grayscale contrast-125 sepia-[0.3] group-hover:grayscale-0 group-hover:sepia-0 group-hover:scale-105 transition-all duration-700 ease-in-out">
            {/* Placeholder Icon - შემდეგში შეგიძლია სურათი დაამატო */}
            <div className="w-full h-full flex items-center justify-center bg-stone-900/50 border-2 border-stone-800">
              <Car className="w-32 h-32 md:w-48 md:h-48 text-stone-700 drop-shadow-[0_20px_30px_rgba(0,0,0,0.9)]" />
            </div>
          </div>

          {/* Technical Annotations */}
          {car.horsepower && (
            <div className="absolute top-[30%] left-[20%] w-[1px] h-20 bg-amber-600/60 hidden md:block group-hover:bg-amber-500 transition-colors">
              <div className="absolute -top-2 -left-1 w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              <div className="absolute bottom-0 left-0 w-32 h-[1px] bg-amber-600/60 group-hover:w-40 transition-all" />
              <div className="absolute bottom-2 left-2 text-[10px] font-mono text-amber-500 uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                Power: {car.horsepower} HP
              </div>
            </div>
          )}

          <div className="absolute bottom-[25%] left-[23%] w-[1px] h-16 bg-stone-500/60 hidden md:block rotate-12 group-hover:bg-stone-400 transition-colors">
            <div className="absolute top-0 left-0 w-20 h-[1px] bg-stone-500/60 -translate-x-full group-hover:w-24 transition-all" />
            <div className="absolute -top-4 -left-28 text-[10px] font-mono text-stone-400 uppercase text-right opacity-0 group-hover:opacity-100 transition-opacity">
              Trans: {car.transmission}
            </div>
          </div>

          {car.mileage && (
            <div className="absolute top-[35%] right-[15%] w-[1px] h-24 bg-stone-500/60 hidden md:block group-hover:bg-stone-400 transition-colors">
              <div className="absolute top-0 right-0 w-24 h-[1px] bg-stone-500/60 group-hover:w-32 transition-all" />
              <div className="absolute -top-5 right-0 text-[10px] font-mono text-stone-400 uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                ODO: {car.mileage.toLocaleString()} km
              </div>
            </div>
          )}
        </div>

        {/* Specifications Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full max-w-4xl border-t border-stone-700 pt-6 md:pt-8">
          {car.horsepower && (
            <SpecBox
              icon={<Gauge className="text-amber-600" />}
              label="Power Output"
              value={`${car.horsepower} HP`}
              sub={
                car.engineCapacity
                  ? `${car.engineCapacity}L Engine`
                  : "Performance"
              }
            />
          )}

          <SpecBox
            icon={getFuelIcon(car.fuelType)}
            label="Fuel Type"
            value={car.fuelType}
            sub="Power Source"
          />

          <SpecBox
            icon={<Settings className="text-amber-600" />}
            label="Transmission"
            value={car.transmission}
            sub="Gearbox Type"
          />

          {car.mileage ? (
            <SpecBox
              icon={<Gauge className="text-amber-600" />}
              label="Mileage"
              value={`${car.mileage.toLocaleString()} km`}
              sub="Odometer Reading"
            />
          ) : (
            <SpecBox
              icon={<Calendar className="text-amber-600" />}
              label="Production"
              value={car.year}
              sub="Manufacturing Year"
            />
          )}
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-4 mt-10 justify-center">
          {car.isProject && (
            <div className="border-2 border-amber-700 px-6 py-2 bg-amber-950/20">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-amber-600" />
                <span className="text-amber-600 font-black text-sm uppercase tracking-widest">
                  Restoration Project
                </span>
              </div>
            </div>
          )}

          {car.isPublic ? (
            <div className="border-2 border-stone-700 px-6 py-2 bg-stone-800/50">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-stone-400" />
                <span className="text-stone-400 font-black text-sm uppercase tracking-widest">
                  Public Listing
                </span>
              </div>
            </div>
          ) : (
            <div className="border-2 border-red-900 px-6 py-2 bg-red-950/20">
              <div className="flex items-center gap-2">
                <EyeOff className="w-5 h-5 text-red-600" />
                <span className="text-red-600 font-black text-sm uppercase tracking-widest">
                  Private Collection
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Vehicle ID Badge */}
        <div className="absolute top-10 right-10 border-2 border-amber-700 p-2 rotate-[-5deg] opacity-80 mix-blend-screen hidden md:block">
          <div className="border border-amber-700 px-4 py-1">
            <span className="text-amber-600 font-black text-xl tracking-widest uppercase">
              ID: {car.id.toString().slice(-6)}
            </span>
          </div>
        </div>
      </div>

      {/* Scanning Effect */}
      <div className="absolute top-0 left-0 w-full h-1 bg-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.5)] animate-scan opacity-30 pointer-events-none" />

      <style jsx>{`
        @keyframes scan {
          0% {
            top: 0%;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            top: 100%;
            opacity: 0;
          }
        }
        .animate-scan {
          animation: scan 4s linear infinite;
        }
      `}</style>
    </div>
  );
};

// Spec Box Component
function SpecBox({ icon, label, value, sub }) {
  return (
    <div className="flex flex-col items-start p-3 md:p-4 border border-stone-800 bg-[#292524] hover:border-amber-700/50 hover:bg-[#312e29] transition-all duration-300 group cursor-pointer hover:shadow-[0_0_15px_rgba(245,158,11,0.1)]">
      <div className="mb-2 opacity-70 group-hover:opacity-100 transition-opacity group-hover:scale-110 transform duration-300">
        {icon}
      </div>
      <span className="text-[10px] md:text-xs text-stone-500 font-mono uppercase tracking-widest mb-1">
        {label}
      </span>
      <span className="text-lg md:text-xl lg:text-2xl font-black text-[#dcd8c8] group-hover:text-amber-600 transition-colors break-words">
        {value}
      </span>
      <span className="text-[8px] md:text-[9px] text-amber-700 font-mono mt-1 group-hover:text-amber-500 transition-colors">
        {sub}
      </span>
    </div>
  );
}

export default function CarCollectionPage() {
  const [cars, setCars] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      fuelType: "PETROL",
      transmission: "MANUAL",
      isPublic: true,
      isProject: false,
    },
  });

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    try {
      setIsLoading(true);
      const data = await carsService.search();
      setCars(data.data.data);
    } catch (error) {
      console.error("Error loading cars:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const newCar = await carsService.create({
        ...data,
        year: Number(data.year),
        horsepower: data.horsepower ? Number(data.horsepower) : undefined,
        mileage: data.mileage ? Number(data.mileage) : undefined,
      });
      setCars((prev) => [newCar, ...prev]);
      reset();
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error creating car:", error);
    }
  };

  const getFuelIcon = (fuelType) => {
    switch (fuelType) {
      case "ELECTRIC":
      case "HYBRID":
      case "PLUGIN_HYBRID":
        return <Zap className="w-4 h-4" />;
      default:
        return <Fuel className="w-4 h-4" />;
    }
  };

  // თუ მანქანა არჩეულია, ვაჩვენებთ detail view-ს
  if (selectedCar) {
    return (
      <CarDetailView car={selectedCar} onClose={() => setSelectedCar(null)} />
    );
  }

  return (
    <div className="min-h-screen bg-[#1c1917] bg-[radial-gradient(#292524_1px,transparent_1px)] [background-size:16px_16px] text-[#EBE9E1] font-sans selection:bg-amber-500 selection:text-stone-900 pb-20">
      {/* HEADER */}
      <div className="sticky top-0 z-30 border-b-4 border-stone-800 bg-[#1c1917]/95 backdrop-blur-sm shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-600 flex items-center justify-center rounded-sm shadow-[4px_4px_0px_0px_#000]">
                <Car className="text-stone-900 w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter text-[#EBE9E1] drop-shadow-lg">
                  Garage <span className="text-amber-600">Inventory</span>
                </h1>
                <p className="text-stone-500 font-mono text-xs tracking-[0.3em] uppercase border-t border-stone-700 mt-1 pt-1">
                  Log Record: {cars.length} units
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="relative group overflow-hidden bg-[#EBE9E1] px-8 py-3 font-black uppercase tracking-widest text-stone-900 border-2 border-transparent hover:border-amber-500 shadow-[6px_6px_0px_0px_#ea580c] hover:shadow-[2px_2px_0px_0px_#ea580c] hover:translate-x-1 hover:translate-y-1 transition-all duration-200"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add New Machine
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* ADD CAR FORM */}
        {isFormOpen && (
          <div className="mb-16 relative">
            <div
              className="absolute inset-0 bg-stone-900/80 z-0 transform translate-x-4 translate-y-4"
              style={{ filter: "url(#rugged-tear)" }}
            />

            <div
              className="relative z-10 bg-[#e3e1d5] p-8 md:p-12 w-full"
              style={{ filter: "url(#rugged-tear)" }}
            >
              <div className="absolute top-4 left-4 w-3 h-3 rounded-full bg-stone-400 border border-stone-500 shadow-inner" />
              <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-stone-400 border border-stone-500 shadow-inner" />
              <div className="absolute bottom-4 left-4 w-3 h-3 rounded-full bg-stone-400 border border-stone-500 shadow-inner" />
              <div className="absolute bottom-4 right-4 w-3 h-3 rounded-full bg-stone-400 border border-stone-500 shadow-inner" />

              <div className="flex items-center justify-between mb-10 border-b-2 border-stone-800 pb-4 border-dashed">
                <h2 className="text-3xl font-black text-stone-800 uppercase tracking-tight">
                  Vehicle <span className="text-amber-700">Registration</span>{" "}
                  Form
                </h2>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="w-10 h-10 flex items-center justify-center border-2 border-stone-800 text-stone-800 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                  <Input
                    label="Manufacturer"
                    {...register("make", { required: true })}
                    placeholder="e.g. ALFA ROMEO"
                  />

                  <Input
                    label="Model Name"
                    {...register("model", { required: true })}
                    placeholder="e.g. GIULIA GT"
                  />

                  <Input
                    label="Year of Mfg"
                    type="number"
                    {...register("year", { required: true })}
                    placeholder="1972"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Engine (L)"
                      {...register("engineCapacity")}
                      placeholder="2.0"
                    />
                    <Input
                      label="Horsepower"
                      type="number"
                      {...register("horsepower")}
                      placeholder="130"
                    />
                  </div>

                  <Input
                    label="Odometer (KM)"
                    type="number"
                    {...register("mileage")}
                    placeholder="89000"
                  />

                  <RuggedSelect
                    label="Fuel Source"
                    name="fuelType"
                    register={register}
                    required
                    options={[
                      "PETROL",
                      "DIESEL",
                      "ELECTRIC",
                      "HYBRID",
                      "PLUGIN_HYBRID",
                      "LPG",
                      "HYDROGEN",
                    ]}
                  />

                  <RuggedSelect
                    label="Transmission"
                    name="transmission"
                    register={register}
                    required
                    options={[
                      "MANUAL",
                      "AUTOMATIC",
                      "SEMI_AUTOMATIC",
                      "CVT",
                      "DCT",
                    ]}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-6 p-6 bg-stone-800/10 border border-stone-800/20 mt-4">
                  <RuggedCheckbox
                    label="Restoration Project"
                    icon={Wrench}
                    register={register}
                    name="isProject"
                  />
                  <RuggedCheckbox
                    label="Visible to Public"
                    icon={Eye}
                    register={register}
                    name="isPublic"
                  />
                </div>

                <div className="flex gap-4 pt-6 border-t-2 border-stone-800 border-dashed">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-stone-800 text-[#EBE9E1] py-4 font-black uppercase tracking-[0.2em] hover:bg-amber-600 hover:text-stone-900 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-none"
                  >
                    {isSubmitting ? "Processing..." : "Register Vehicle"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-8 py-4 font-bold uppercase tracking-wider text-stone-600 border-2 border-stone-400 hover:border-stone-800 hover:text-stone-800 transition-colors"
                  >
                    Discard
                  </button>
                </div>

                {Object.keys(errors).length > 0 && (
                  <div className="text-red-700 font-mono text-xs uppercase tracking-widest border-l-4 border-red-700 pl-2">
                    Error: Missing required fields in the manifest.
                  </div>
                )}
              </form>
            </div>
          </div>
        )}

        {/* CARS GRID */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-stone-600 border-t-amber-500 rounded-full animate-spin" />
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-20 border-4 border-dashed border-stone-800/30 rounded-3xl">
            <Car className="w-24 h-24 mx-auto text-stone-700 mb-4 opacity-50" />
            <h3 className="text-2xl font-black text-stone-500 uppercase mb-2">
              Garage Empty
            </h3>
            <p className="text-stone-600 font-mono mb-8">
              No machinery records found.
            </p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="text-amber-500 font-bold uppercase tracking-widest underline hover:text-amber-400"
            >
              Start First Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.map((car) => (
              <div
                key={car.id}
                onClick={() => setSelectedCar(car)}
                className="group relative bg-[#f2f0e9] min-h-[400px] flex flex-col shadow-xl transition-transform hover:-translate-y-2 duration-300 cursor-pointer"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 bg-[#e8dcc0] opacity-90 rotate-1 shadow-sm z-20" />

                <div className="h-40 bg-[#1c1917] relative flex items-center justify-center overflow-hidden border-b-4 border-stone-800">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-stone-500 to-black" />
                  <Car className="w-20 h-20 text-stone-600 group-hover:text-amber-500 transition-colors duration-500" />

                  <div className="absolute top-2 right-2 flex flex-col gap-1">
                    {car.isProject && (
                      <span className="bg-amber-600 text-stone-900 text-[10px] font-black uppercase px-2 py-0.5 shadow-sm">
                        Project
                      </span>
                    )}
                    {car.isPublic ? (
                      <span className="bg-stone-300 text-stone-900 text-[10px] font-bold uppercase px-2 py-0.5 shadow-sm">
                        Public
                      </span>
                    ) : (
                      <span className="bg-red-900 text-white text-[10px] font-bold uppercase px-2 py-0.5 shadow-sm">
                        Private
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-6 border-b border-stone-300 pb-4">
                    <h3 className="text-sm font-bold text-stone-500 uppercase tracking-widest mb-1">
                      {car.make}
                    </h3>
                    <p className="text-3xl font-black text-stone-900 uppercase leading-none truncate">
                      {car.model}
                    </p>
                  </div>

                  <div className="space-y-3 font-mono text-xs text-stone-600">
                    <div className="flex justify-between items-center border-b border-dashed border-stone-300 pb-1">
                      <span className="flex items-center gap-2">
                        <Calendar size={14} /> YEAR
                      </span>
                      <span className="font-bold text-stone-900 text-sm">
                        {car.year}
                      </span>
                    </div>

                    {car.horsepower && (
                      <div className="flex justify-between items-center border-b border-dashed border-stone-300 pb-1">
                        <span className="flex items-center gap-2">
                          <Gauge size={14} /> POWER
                        </span>
                        <span className="font-bold text-stone-900 text-sm">
                          {car.horsepower} HP
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center border-b border-dashed border-stone-300 pb-1">
                      <span className="flex items-center gap-2">
                        {getFuelIcon(car.fuelType)} FUEL
                      </span>
                      <span className="font-bold text-stone-900">
                        {car.fuelType}
                      </span>
                    </div>

                    <div className="flex justify-between items-center border-b border-dashed border-stone-300 pb-1">
                      <span className="flex items-center gap-2">
                        <Settings size={14} /> TRANS
                      </span>
                      <span className="font-bold text-stone-900">
                        {car.transmission}
                      </span>
                    </div>

                    {car.mileage && (
                      <div className="flex justify-between items-center pt-2">
                        <span className="uppercase tracking-widest text-[10px]">
                          Odometer:
                        </span>
                        <span className="font-bold text-stone-800 bg-stone-200 px-2 py-0.5 rounded-sm">
                          {car.mileage.toLocaleString()} km
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-stone-200 p-2 text-center border-t border-stone-300">
                  <span className="font-mono text-[10px] text-stone-400 uppercase tracking-[0.2em]">
                    ID: {car.id.toString().slice(-6)}
                  </span>
                </div>

                {/* Click to View Indicator */}
                <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/10 transition-colors pointer-events-none" />
                <div className="absolute bottom-16 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs font-mono text-amber-700 uppercase tracking-wider">
                    Click to View →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SVG FILTERS */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <filter id="rugged-tear" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.045"
              numOctaves="5"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="6"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
