"use client";
import React, { useState } from "react";
import { BackgroundGrid } from "../../ui/BackgroundGrid";
import { CarOverview } from "./CarOverview";
import { CarFullDetails } from "./CarFullDetails";
import { Car, ViewMode } from "../../../types/car.types";
import { CarHeader } from "./CarHeader";

interface CarDetailViewProps {
  car: Car;
  onClose: () => void;
  onEdit: (car: Car) => void;
}

export const CarDetailView: React.FC<CarDetailViewProps> = ({
  car,
  onClose,
  onEdit,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>("overview");

  const handleBackClick = (): void => {
    if (viewMode === "full") {
      setViewMode("overview");
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden bg-[#1c1917] z-50 flex flex-col">
      {/* Background */}
      <BackgroundGrid />

      {/* Large Brand Text */}
      <div className="fixed top-20 -left-10 text-[20vw] font-black text-stone-800/20 leading-none select-none pointer-events-none whitespace-nowrap z-0">
        {car.make}
      </div>

      {/* Header - Fixed Height (e.g., 64px) */}
      <div className="relative z-20 flex-none">
        <CarHeader viewMode={viewMode} onBackClick={handleBackClick} />
      </div>

      {/* Content - Takes remaining height */}
      <div className="flex-1 relative z-10 overflow-hidden">
        {viewMode === "overview" ? (
          <CarOverview
            car={car}
            onViewFullDetails={() => setViewMode("full")}
          />
        ) : (
          <CarFullDetails car={car} onEdit={onEdit} />
        )}
      </div>
    </div>
  );
};
