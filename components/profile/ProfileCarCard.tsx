"use client";

import { getFuelIcon } from "@/utils/carHelpers";
import {
  Calendar,
  Gauge,
  Settings,
  Car,
  Activity,
  Fuel,
  Eye,
} from "lucide-react";

export const ProfileCarCard = ({
  car,
  onClick, // ✏️ რედაქტირება (ბარათზე დაჭერა)
  onViewFullDetails, // 👁 დეტალურად ნახვა
}) => {
  return (
    <div
      onClick={onClick}
      className="group relative bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-orange-500/40 transition-all cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-40 bg-black flex items-center justify-center overflow-hidden">
        {car.photos?.length ? (
          <img
            src={car.photos[0].url}
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

        {/* გაუმჯობესებული "დეტალურად ნახვა" ღილაკი — მხოლოდ იკონკა */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewFullDetails(car);
          }}
          className="group relative w-full py-2 mt-4
                     bg-black border border-orange-600/30 rounded-lg
                     overflow-hidden
                     hover:border-orange-500 hover:bg-orange-950/20
                     transition-all duration-300"
        >
          {/* Gradient background on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Scanline effect (უფრო რბილი) */}
          <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_48%,rgba(249,115,22,0.08)_50%,transparent_52%)] bg-[length:100%_4px] animate-[scan_4s_linear_infinite] opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* მხოლოდ Eye იკონკა ცენტრში */}
          <div className="relative z-10 flex justify-center">
            <Eye
              size={20}
              className="text-orange-500 group-hover:text-orange-400 
                         group-hover:animate-pulse group-hover:scale-110 
                         transition-all duration-300"
            />
          </div>

          {/* პატარა "loading bars" მარჯვნივ hover-ზე */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-1 h-5 bg-orange-500/40 group-hover:bg-orange-500 transition-all duration-300 delay-75" />
            <div className="w-1 h-5 bg-orange-500/40 group-hover:bg-orange-500 transition-all duration-300 delay-150" />
            <div className="w-1 h-5 bg-orange-500/40 group-hover:bg-orange-500 transition-all duration-300 delay-200" />
          </div>
        </button>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/5 transition-colors pointer-events-none" />
    </div>
  );
};
