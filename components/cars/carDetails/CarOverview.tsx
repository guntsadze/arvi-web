import React from "react";
import { Sparkles, Gauge, Calendar, Settings, List } from "lucide-react";
import { SpecBox } from "./shared/SpecBox";
import { CarVisual } from "./CarVisual";
import { getFuelIcon } from "../../../utils/carHelpers";
import { Car } from "../../../types/car.types";

interface CarOverviewProps {
  car: Car;
  onViewFullDetails: () => void;
}

export const CarOverview: React.FC<CarOverviewProps> = ({
  car,
  onViewFullDetails,
}) => (
  // Main Container: h-full guarantees it fills the parent, flex-col organizes vertical layout
  <div className="relative z-10 h-full w-full max-w-7xl mx-auto flex flex-col px-4 pb-4 pt-2">
    {/* --- TOP SECTION (Header) : flex-none (Doesn't shrink) --- */}
    <div className="flex-none text-center mb-2 md:mb-4">
      <div className="inline-flex items-center gap-2 mb-2 px-4 py-2 border border-amber-700/30 bg-amber-950/20 rounded-full">
        <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
        <span className="text-xs md:text-sm text-amber-600 font-mono uppercase tracking-wider">
          System Overview
        </span>
      </div>

      <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-[#dcd8c8] mb-1 tracking-tight">
        {car.make} {car.model}
      </h1>

      {car.nickname && (
        <div className="text-center mt-1 mb-2">
          <span className="text-xl md:text-2xl font-black text-amber-600 italic tracking-widest uppercase relative px-4">
            "{car.nickname}"
            <span className="absolute -top-1 -right-2 text-[8px] text-stone-500 not-italic">
              CODENAME
            </span>
          </span>
        </div>
      )}

      <p className="text-xs md:text-sm text-stone-400 font-mono">
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

    {/* --- MIDDLE SECTION (Visual) : flex-1 & min-h-0 (Shrinks to fit available space) --- */}
    <div className="flex-1 min-h-0 w-full flex items-center justify-center relative my-2">
      {/* CarVisual is wrapped so it stays contained */}
      <div className="w-full h-full flex items-center justify-center">
        <CarVisual car={car} />
      </div>
    </div>

    {/* --- BOTTOM SECTION (Specs & Button) : flex-none (Always visible at bottom) --- */}
    <div className="flex-none flex flex-col items-center gap-4 w-full">
      {/* Basic Specs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 w-full max-w-4xl border-t border-stone-700 pt-4">
        {car.horsepower && (
          <SpecBox
            icon={<Gauge className="text-amber-600 w-4 h-4 md:w-5 md:h-5" />}
            label="Power Output"
            value={`${car.horsepower} HP`}
            sub="Performance"
          />
        )}
        <SpecBox
          icon={getFuelIcon(car.fuelType)}
          label="Fuel Type"
          value={car.fuelType}
          sub="Source"
        />
        <SpecBox
          icon={<Settings className="text-amber-600 w-4 h-4 md:w-5 md:h-5" />}
          label="Transmission"
          value={car.transmission}
          sub="Gearbox"
        />
        {car.mileage ? (
          <SpecBox
            icon={<Gauge className="text-amber-600 w-4 h-4 md:w-5 md:h-5" />}
            label="Mileage"
            value={`${car.mileage.toLocaleString()} km`}
            sub="Odometer"
          />
        ) : (
          <SpecBox
            icon={<Calendar className="text-amber-600 w-4 h-4 md:w-5 md:h-5" />}
            label="Production"
            value={car.year}
            sub="Year"
          />
        )}
      </div>

      {/* View Full Details Button */}
      <button
        onClick={onViewFullDetails}
        className="group relative px-6 py-3 md:px-8 md:py-4 bg-transparent border-2 border-stone-600 hover:border-amber-600 transition-colors overflow-hidden mt-2 shrink-0"
      >
        <div className="absolute inset-0 bg-stone-800 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        <span className="relative z-10 flex items-center gap-3 text-stone-400 group-hover:text-amber-500 font-black uppercase tracking-[0.2em] text-xs md:text-sm">
          <List className="w-4 h-4" />
          Access Full Manifest
        </span>
      </button>
    </div>

    {/* Vehicle ID Badge (Absolute positioned, ignores flow) */}
    <div className="absolute top-4 right-4 md:top-10 md:right-10 border-2 border-amber-700 p-2 rotate-[-5deg] opacity-80 mix-blend-screen hidden md:block pointer-events-none">
      <div className="border border-amber-700 px-4 py-1">
        <span className="text-amber-600 font-black text-xl tracking-widest uppercase">
          ID: {car.id.toString().slice(-6)}
        </span>
      </div>
    </div>
  </div>
);
