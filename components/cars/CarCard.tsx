"use client";
import { Zap, Fuel, Calendar, Gauge, Settings, Car } from "lucide-react";

export const CarCard = ({ car, onClick }) => {
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

  return (
    <div
      onClick={onClick}
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
            <span className="font-bold text-stone-900 text-sm">{car.year}</span>
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
            <span className="font-bold text-stone-900">{car.fuelType}</span>
          </div>

          <div className="flex justify-between items-center border-b border-dashed border-stone-300 pb-1">
            <span className="flex items-center gap-2">
              <Settings size={14} /> TRANS
            </span>
            <span className="font-bold text-stone-900">{car.transmission}</span>
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
  );
};
