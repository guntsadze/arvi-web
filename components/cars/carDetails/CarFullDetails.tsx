"use client";
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { FileText, Settings, X } from "lucide-react";

import { IdentitySection } from "./sections/IdentitySection";
import { ClassificationSection } from "./sections/ClassificationSection";
import { DrivetrainSection } from "./sections/DrivetrainSection";
import { PerformanceSection } from "./sections/PerformanceSection";
import { HistorySection } from "./sections/HistorySection";
import { Car } from "../../../types/car.types";

interface CarFullDetailsProps {
  car: Car;
  onEdit: (car: Car) => void;
  onClose: () => void;
  isOwner: boolean; // 💡 ახალი prop
}

export const CarFullDetails: React.FC<CarFullDetailsProps> = ({
  car,
  onEdit,
  onClose,
  isOwner,
}) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[9999]">
      {/* Background */}
      <div
        className="absolute inset-0 bg-[#1c1917] bg-[radial-gradient(#292524_1px,transparent_1px)] [background-size:16px_16px] backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Content */}
      <div className="relative h-full w-full overflow-y-auto">
        <div className="relative max-w-7xl mx-auto pt-10 pb-20 px-4 md:px-8 animate-in slide-in-from-bottom-10 duration-500">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-stone-800 pb-6">
            <div>
              <div className="flex items-center gap-2 text-amber-600 mb-2">
                <FileText size={16} />
                <span className="text-xs font-mono uppercase tracking-widest">
                  ავტომობილის სრული ინფორმაცია
                </span>
              </div>
              <h2 className="text-4xl font-black text-[#EBE9E1] uppercase">
                {car.make} {car.model}
              </h2>
            </div>

            <div className="flex gap-4">
              {isOwner && (
                <button
                  onClick={() => onEdit(car)}
                  className="flex items-center gap-2 px-6 py-3 bg-stone-800 hover:bg-amber-600
                             text-stone-300 hover:text-stone-900 font-bold uppercase tracking-wider
                             transition-all border border-stone-700"
                >
                  <Settings className="w-4 h-4" />
                  <span>ინფორმაციის განახლება</span>
                </button>
              )}

              <button
                onClick={onClose}
                className="flex items-center gap-2 px-6 py-3 border border-stone-700
                           text-stone-300 hover:text-red-400 hover:border-red-500
                           transition-all uppercase font-bold"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="space-y-8">
              <IdentitySection car={car} />
              <ClassificationSection car={car} />
            </div>

            <div className="space-y-8">
              <DrivetrainSection car={car} />
              <PerformanceSection car={car} />
            </div>

            <div className="lg:col-span-1">
              <HistorySection car={car} />
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};
