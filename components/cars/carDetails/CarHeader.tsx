import React from "react";
import { ArrowLeft } from "lucide-react";
import { ViewMode } from "../../../types/car.types";

interface CarHeaderProps {
  viewMode: ViewMode;
  onBackClick: () => void;
}

export const CarHeader: React.FC<CarHeaderProps> = ({
  viewMode,
  onBackClick,
}) => (
  <div className="h-16 flex justify-between items-center px-6 bg-[#1c1917]/90 backdrop-blur-md border-b border-stone-800/50 z-50">
    <button
      onClick={onBackClick}
      className="flex items-center gap-2 px-4 py-2 bg-stone-800 text-[#EBE9E1] hover:bg-amber-600 hover:text-stone-900 font-bold uppercase tracking-wider transition-all duration-300 border border-stone-700"
    >
      <ArrowLeft className="w-4 h-4" />
      <span>
        {viewMode === "full" ? "Return to Overview" : "Close Terminal"}
      </span>
    </button>

    {viewMode === "full" && (
      <div className="hidden md:flex items-center gap-2 text-stone-500 font-mono text-xs uppercase">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        Reading from Database...
      </div>
    )}
  </div>
);
