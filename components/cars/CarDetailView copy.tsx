"use client";
import {
  ArrowLeft,
  Sparkles,
  Car,
  Gauge,
  Fuel,
  Zap,
  Settings,
  Calendar,
  Wrench,
} from "lucide-react";

// Helper internal component
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

export const CarDetailView = ({ car, onClose, onEdit }) => {
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
    <div className="fixed inset-0 bg-[#1c1917] z-50 ">
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

        {/* Car Visual Area */}
        <div className="relative w-full max-w-5xl aspect-[16/9] md:aspect-[21/9] flex items-center justify-center group mb-10">
          <div className="relative w-full h-full grayscale contrast-125 sepia-[0.3] group-hover:grayscale-0 group-hover:sepia-0 group-hover:scale-105 transition-all duration-700 ease-in-out">
            <div className="w-full h-full flex items-center justify-center bg-stone-900/50 border-2 border-stone-800">
              <Car className="w-32 h-32 md:w-48 md:h-48 text-stone-700 drop-shadow-[0_20px_30px_rgba(0,0,0,0.9)]" />
            </div>
          </div>

          {/* Technical Annotations (Keeping the original styling) */}
          {car.horsepower && (
            <div className="absolute top-[30%] left-[20%] w-[1px] h-20 bg-amber-600/60 hidden md:block group-hover:bg-amber-500 transition-colors">
              <div className="absolute -top-2 -left-1 w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              <div className="absolute bottom-0 left-0 w-32 h-[1px] bg-amber-600/60 group-hover:w-40 transition-all" />
              <div className="absolute bottom-2 left-2 text-[10px] font-mono text-amber-500 uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                Power: {car.horsepower} HP
              </div>
            </div>
          )}
          {/* ... Other annotations can be added here similar to original ... */}
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

          <div className="absolute top-6 right-6 md:top-10 md:right-10 flex gap-4">
            <button
              onClick={() => onEdit(car)}
              className="flex items-center gap-2 px-6 py-3 bg-amber-700/20 hover:bg-amber-600 text-amber-500 hover:text-stone-900 font-bold uppercase tracking-wider transition-all duration-300 border-2 border-amber-700/50 hover:border-amber-600"
            >
              <Settings className="w-5 h-5" />
              <span className="hidden md:inline">Modify Spec</span>
            </button>
          </div>
          {/* ... Public/Private badges ... */}
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

      {/* Scanning Effect Style */}
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
