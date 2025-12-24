"use client";

import { getFuelIcon } from "@/utils/carHelpers";
import { Calendar, Gauge, Settings, Car, Activity } from "lucide-react";

export const ProfileCarCard = ({ car, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group relative bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-orange-500/40 transition-all cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-40 bg-black flex items-center justify-center overflow-hidden">
        {car.photos?.length ? (
          <img
            src={car?.photos[0].url} // პირველი სურათი
            alt={`${car.make} ${car.model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <Car className="w-16 h-16 text-neutral-700" />
        )}

        {/* Plate */}
        <div className="absolute top-2 left-2 bg-black/70 backdrop-blur px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest border border-neutral-700">
          {car.licensePlate}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div>
          <p className="text-[10px] text-neutral-500 uppercase tracking-widest">
            {car.model}
          </p>
          <h3 className="text-xl font-black italic tracking-tight">
            {car.make}
          </h3>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-neutral-400">
          <div className="flex items-center gap-1">
            <Calendar size={12} /> {car.year}
          </div>
          <div className="flex items-center gap-1">
            <Activity size={12} /> {car.engine}L
          </div>
          <div className="flex items-center gap-1 text-orange-400">
            <Gauge size={12} /> {car.horsepower} HP
          </div>
          <div className="flex items-center gap-1">
            <Settings size={12} /> {car.transmission}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-[10px] font-mono uppercase tracking-widest text-neutral-500">
          <span className="flex items-center gap-1">
            {getFuelIcon(car.fuelType)}
            {car.fuelType}
          </span>
          <span>
            {car.mileage ? `${car.mileage.toLocaleString()} km` : "—"}
          </span>
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/5 transition-colors pointer-events-none" />
    </div>
  );
};
