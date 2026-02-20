"use client";

import React, { useState } from "react";
import { createPortal } from "react-dom";
import {
  Calendar,
  Gauge,
  Settings,
  Car,
  Activity,
  Eye,
  Edit3,
  Zap,
  Database,
  X,
  Terminal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const SellButton = ({ onClick }: any) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    className="relative group/sell overflow-hidden px-4 py-1.5 bg-orange-600/10 border border-orange-500/50 hover:bg-orange-500 transition-all duration-300"
  >
    {/* Button Shine Effect */}
    <div className="absolute inset-0 translate-x-[-100%] group-hover/sell:translate-x-[100%] transition-transform duration-500 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

    <div className="flex items-center gap-2">
      <Zap
        size={12}
        className="text-orange-500 group-hover/sell:text-black transition-colors"
      />
      <span className="text-[10px] font-mono font-black text-orange-500 group-hover/sell:text-black uppercase tracking-tighter">
        Sell_Vehicle
      </span>
    </div>
  </button>
);

// --- პორტალის კომპონენტი (INDUSTRIAL THEME) ---
const InfoPortal = ({ title, isOpen, onClose, children }: any) => {
  if (typeof document === "undefined" || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-md bg-[#201d1b] border border-stone-800 shadow-2xl overflow-hidden"
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between p-3 border-b border-stone-800 bg-black/20">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 animate-pulse" />
            <h3 className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-orange-500">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-stone-800 text-stone-500 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-4 max-h-[60vh] overflow-y-auto font-mono">
          {children}
        </div>
      </motion.div>
    </div>,
    document.body,
  );
};

// --- ACTION BUTTON (SYSTEM STYLE) ---
const ActionButton = ({ icon: Icon, onClick, label }: any) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    className="group/btn flex items-center gap-2 bg-black/40 border border-stone-800 px-3 py-2 hover:border-orange-500 transition-all active:scale-95"
  >
    <Icon
      size={14}
      className="text-stone-500 group-hover/btn:text-orange-500"
    />
    <span className="text-[9px] font-mono text-stone-500 group-hover/btn:text-stone-200 uppercase tracking-widest">
      {label}
    </span>
  </button>
);

export const ProfileCarCard = ({
  car,
  onClick,
  onViewFullDetails,
  onSell,
}: any) => {
  const [modalType, setModalType] = useState<"mods" | "logs" | null>(null);

  return (
    <>
      <div className="group relative bg-[#201d1b] border border-stone-800 transition-all hover:border-stone-700 flex flex-col h-full overflow-hidden">
        {/* Image Section with Scanline effect */}
        <div className="relative h-48 bg-black overflow-hidden border-b border-stone-800">
          {car.photos?.[0] ? (
            <img
              src={car.photos[0].url}
              alt={car.model}
              className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 grayscale hover:grayscale-0"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#1c1917]">
              <Car className="w-12 h-12 text-stone-800" />
            </div>
          )}

          {/* Overlay Grid */}
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

          {/* Plate Number (System Tag) */}
          <div className="absolute top-4 left-4 font-mono">
            <div className="bg-orange-500 text-black text-[9px] font-bold px-2 py-0.5 uppercase tracking-tighter">
              {car.licensePlate || "NO_DATA"}
            </div>
          </div>

          {/* Hover Actions */}
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ActionButton icon={Edit3} label="Modify_Data" onClick={onClick} />
            <ActionButton
              icon={Eye}
              label="View_Telemetry"
              onClick={() => onViewFullDetails(car)}
            />
          </div>
        </div>

        {/* Info Section */}
        <div className="p-5 flex-1 flex flex-col relative">
          {/* Subtle Terminal Icon Background */}
          <Terminal
            size={60}
            className="absolute bottom-4 right-4 opacity-[0.03] text-stone-500 pointer-events-none"
          />

          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-1 bg-stone-600" />
              <span className="text-[9px] font-mono text-stone-500 uppercase tracking-[0.3em]">
                {car.make} // Source
              </span>
            </div>
            <h3 className="text-xl font-mono font-bold text-stone-100 uppercase tracking-tight">
              {car.model}
            </h3>
          </div>

          {/* Technical Grid */}
          <div className="grid grid-cols-2 gap-y-4 gap-x-6 mb-6">
            <DataField
              label="Manufactured"
              value={car.year}
              icon={<Calendar size={12} />}
            />
            <DataField
              label="Displacement"
              value={`${car.engine}L`}
              icon={<Activity size={12} />}
            />
            <DataField
              label="Output_Power"
              value={`${car.horsepower} HP`}
              icon={<Gauge size={12} />}
              isOrange
            />
            <DataField
              label="Transmission"
              value={car.transmission}
              icon={<Settings size={12} />}
            />
          </div>

          {/* Bottom Action Bar */}
          <div className="mt-auto pt-4 border-t border-stone-800/50 flex flex-col gap-4">
            {/* ზედა ზოლი: Mods & Logs */}
            <div className="flex items-center justify-between font-mono">
              <div className="flex gap-4">
                <button
                  onClick={() => setModalType("mods")}
                  className="flex items-center gap-1.5 text-[9px] font-bold uppercase text-stone-500 hover:text-orange-500 transition-colors"
                >
                  <Zap size={10} /> [Mods]
                </button>
                <button
                  onClick={() => setModalType("logs")}
                  className="flex items-center gap-1.5 text-[9px] font-bold uppercase text-stone-500 hover:text-stone-300 transition-colors"
                >
                  <Database size={10} /> [Logs]
                </button>
              </div>
              <div className="text-[9px] text-stone-600 font-mono italic">
                {car.mileage?.toLocaleString() || 0} _KM_LOGGED
              </div>
            </div>

            {/* ქვედა ზოლი: Sell Button */}
            <div className="flex items-center justify-between gap-2 border-t border-stone-800/30 pt-3">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500/50 animate-pulse" />
                <span className="text-[8px] text-stone-600 font-mono uppercase">
                  System_Active
                </span>
              </div>

              <SellButton onClick={() => onSell(car)} />
            </div>
          </div>
        </div>
      </div>

      {/* --- Portals (MODS & LOGS) --- */}
      <AnimatePresence>
        {modalType === "mods" && (
          <InfoPortal
            title="Modification_Database"
            isOpen
            onClose={() => setModalType(null)}
          >
            {car.modifications?.length > 0 ? (
              <div className="space-y-2">
                {car.modifications.map((mod: any) => (
                  <div
                    key={mod.id}
                    className="p-3 bg-black/20 border border-stone-800/50 flex justify-between items-center group hover:border-orange-500/30 transition-colors"
                  >
                    <div>
                      <div className="text-[10px] font-bold text-stone-300 uppercase">
                        {mod.name}
                      </div>
                      <div className="text-[8px] text-stone-600 uppercase tracking-widest">
                        {mod.brand}
                      </div>
                    </div>
                    <div className="text-[10px] text-orange-500 font-bold">
                      +{mod.hpGain} HP
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 opacity-40 text-[10px] tracking-widest uppercase">
                No_Modifications_Found
              </div>
            )}
          </InfoPortal>
        )}

        {modalType === "logs" && (
          <InfoPortal
            title="Service_Manifest_Log"
            isOpen
            onClose={() => setModalType(null)}
          >
            {car.maintenanceRecords?.length > 0 ? (
              <div className="space-y-4">
                {car.maintenanceRecords.map((log: any) => (
                  <div
                    key={log.id}
                    className="relative pl-4 border-l border-stone-700"
                  >
                    <div className="absolute top-0 -left-[1px] w-1 h-2 bg-orange-500" />
                    <div className="text-[8px] text-stone-600 mb-1">
                      {new Date(log.serviceDate).toLocaleDateString()} //
                      SYSTEM_LOG
                    </div>
                    <div className="text-[10px] font-bold text-stone-300 uppercase tracking-wider">
                      {log.type}
                    </div>
                    <div className="text-[9px] text-stone-500 italic mt-1 font-sans">
                      {log.location}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 opacity-40 text-[10px] tracking-widest uppercase">
                No_Records_Logged
              </div>
            )}
          </InfoPortal>
        )}
      </AnimatePresence>
    </>
  );
};

// დამხმარე კომპონენტი ინფოსთვის
function DataField({ label, value, icon, isOrange }: any) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 text-[8px] text-stone-600 uppercase tracking-widest font-mono">
        {icon} {label}
      </div>
      <div
        className={cn(
          "text-[11px] font-bold font-mono",
          isOrange ? "text-orange-500" : "text-stone-300",
        )}
      >
        {value}
      </div>
    </div>
  );
}
