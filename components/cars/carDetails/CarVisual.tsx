import React from "react";
import { Car } from "lucide-react";
import { Car as CarType } from "../../../types/car.types";

interface CarVisualProps {
  car: CarType;
}

export const CarVisual: React.FC<CarVisualProps> = ({ car }) => (
  <div className="relative w-full max-w-5xl aspect-[16/9] md:aspect-[21/9] flex items-center justify-center group cursor-help">
    <div className="relative w-full h-full grayscale contrast-125 sepia-[0.3] group-hover:grayscale-0 group-hover:sepia-0 group-hover:scale-[1.02] transition-all duration-700 ease-in-out bg-stone-900/50 border-2 border-stone-800 overflow-hidden">
      <div className="w-full h-full flex items-center justify-center">
        <Car className="w-32 h-32 md:w-48 md:h-48 text-stone-700 drop-shadow-[0_20px_30px_rgba(0,0,0,0.9)] transition-colors group-hover:text-[#EBE9E1]" />
      </div>

      <div className="absolute inset-0 bg-stone-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
        <div className="grid grid-cols-2 gap-8 text-left p-8 border border-amber-600/30 bg-black/40">
          <div className="space-y-1">
            <span className="text-[10px] text-amber-600 uppercase tracking-widest block">
              Engine Code
            </span>
            <span className="text-xl font-bold text-white block">
              {car.engine || "N/A"}
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-amber-600 uppercase tracking-widest block">
              Drive Type
            </span>
            <span className="text-xl font-bold text-white block">
              {car.driveType || "N/A"}
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-amber-600 uppercase tracking-widest block">
              Torque
            </span>
            <span className="text-xl font-bold text-white block">
              {car.torque ? `${car.torque} NM` : "N/A"}
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-amber-600 uppercase tracking-widest block">
              Body
            </span>
            <span className="text-xl font-bold text-white block">
              {car.bodyType || "N/A"}
            </span>
          </div>
        </div>

        <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-amber-500" />
        <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-amber-500" />
      </div>
    </div>
  </div>
);
