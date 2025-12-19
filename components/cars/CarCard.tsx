"use client";
import { getFuelIcon } from "@/utils/carHelpers";
import {
  Calendar,
  Gauge,
  Settings,
  Car,
  Activity,
  ArrowRightLeft,
} from "lucide-react";

export const CarCard = ({ car, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group relative bg-[#f2f0e9] min-h-[450px] flex flex-col shadow-xl transition-all hover:-translate-y-2 duration-300 cursor-pointer border border-stone-300"
    >
      {/* ზედა დეკორატიული "წებოვანი ლენტი" */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 bg-[#e8dcc0] opacity-90 rotate-1 shadow-sm z-20 border-x border-stone-400/20 flex justify-center items-center">
        <span className="text-stone-900 font-semibold text-sm drop-shadow-sm">
          {car.licensePlate}
        </span>
      </div>

      {/* სურათის/Header-ის სექცია */}
      <div className="h-44 bg-[#1c1917] relative flex items-center justify-center overflow-hidden border-b-4 border-stone-800">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-stone-500 to-black" />

        {/* Nickname "Badge" */}
        {car.nickname && (
          <div className="absolute top-4 left-4 z-10 flex flex-col">
            <span className="bg-amber-500 text-stone-900 text-[10px] font-black px-2 py-1 rounded-sm shadow-lg uppercase tracking-tighter">
              "{car.nickname}"
            </span>
            {car.description && (
              <span className="bg-white/10 text-stone-400 text-[9px] font-mono px-1 border border-white/10 mt-1">
                {car.description}
              </span>
            )}
          </div>
        )}

        <Car className="w-24 h-24 text-stone-700 group-hover:text-amber-500 transition-colors duration-500" />

        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
          {car.isProject && (
            <span className="bg-amber-600 text-stone-900 text-[10px] font-black uppercase px-2 py-0.5 shadow-sm">
              Project
            </span>
          )}
          <span
            className={`${
              car.isPublic
                ? "bg-stone-300 text-stone-900"
                : "bg-red-900 text-white"
            } text-[10px] font-bold uppercase px-2 py-0.5 shadow-sm`}
          >
            {car.isPublic ? "Public" : "Private"}
          </span>
          {/* {car.licensePlate && (
            <span className="bg-white/10 text-stone-400 text-[9px] font-mono px-1 border border-white/10 mt-1">
              {car.licensePlate}
            </span>
          )} */}
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        {/* სათაური */}
        <div className="mb-4 border-b-2 border-stone-900 pb-2">
          <h3 className="text-xs font-bold text-stone-500 uppercase tracking-[0.2em]">
            {car.model}
          </h3>
          <p className="text-3xl font-black text-stone-900 uppercase leading-none truncate">
            {car.make}
          </p>
        </div>

        {/* ტექნიკური მონაცემების ბლოკი */}
        <div className="grid grid-cols-1 gap-2 font-mono text-[11px] text-stone-600">
          {/* Year & Engine Row */}
          <div className="flex justify-between items-center border-b border-dashed border-stone-300 pb-1">
            <span className="flex items-center gap-2">
              <Calendar size={12} /> YEAR
            </span>
            <span className="font-bold text-stone-900">{car.year}</span>
          </div>

          <div className="flex justify-between items-center border-b border-dashed border-stone-300 pb-1">
            <span className="flex items-center gap-2">
              <Activity size={12} /> ENGINE
            </span>
            <span className="font-bold text-stone-900">{car.engine}L</span>
          </div>

          {/* Power & Torque Row */}
          <div className="flex justify-between items-center border-b border-dashed border-stone-300 pb-1 text-amber-800">
            <span className="flex items-center gap-2">
              <Gauge size={12} /> PERFORMANCE
            </span>
            <span className="font-bold uppercase">
              {car.horsepower} HP / {car.torque} NM
            </span>
          </div>

          {/* Drive & Body Row */}
          <div className="flex justify-between items-center border-b border-dashed border-stone-300 pb-1">
            <span className="flex items-center gap-2">
              <ArrowRightLeft size={12} /> DRIVE / BODY
            </span>
            <span className="font-bold text-stone-900 uppercase">
              {car.driveType} / {car.bodyType}
            </span>
          </div>

          {/* Transmission & Fuel */}
          <div className="flex justify-between items-center border-b border-dashed border-stone-300 pb-1">
            <span className="flex items-center gap-2">
              <Settings size={12} /> TRANS
            </span>
            <span className="font-bold text-stone-900 uppercase">
              {car.transmission}
            </span>
          </div>

          <div className="flex justify-between items-center border-b border-dashed border-stone-300 pb-1">
            <span className="flex items-center gap-2">
              {getFuelIcon(car.fuelType)} FUEL
            </span>
            <span className="font-bold text-stone-900 uppercase">
              {car.fuelType}
            </span>
          </div>

          {/* Mileage Section */}
          {car.mileage && (
            <div className="mt-4 bg-stone-900 text-[#f2f0e9] p-2 flex justify-between items-center">
              <span className="text-[9px] uppercase tracking-widest opacity-70">
                Odometer Reading:
              </span>
              <span className="font-bold text-sm italic">
                {car.mileage.toLocaleString()}{" "}
                <small className="text-[10px]">KM</small>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ID & Footer */}
      <div className="bg-stone-300/50 p-2 text-center border-t border-stone-300 flex justify-between px-4 items-center">
        <span className="font-mono text-[9px] text-stone-500 uppercase tracking-widest">
          SN: {car.id.toString().slice(-8).toUpperCase()}
        </span>
        <div className="flex gap-1">
          <div className="w-1 h-1 bg-stone-400 rounded-full" />
          <div className="w-1 h-1 bg-stone-400 rounded-full" />
          <div className="w-1 h-1 bg-stone-400 rounded-full" />
        </div>
      </div>

      {/* Hover ეფექტი */}
      <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/5 transition-colors pointer-events-none" />
    </div>
  );
};
