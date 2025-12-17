"use client";
import { useState } from "react";
import {
  ArrowLeft,
  Sparkles,
  Car,
  Gauge,
  Fuel,
  Zap,
  Settings,
  Calendar,
  Wrench,
  Info,
  Activity,
  Hash,
  Palette,
  FileText,
  ShieldCheck,
  Globe,
  Lock,
  List,
  Cpu,
  Move,
} from "lucide-react";

// --- Helper: Spec Box (Grid Item) ---
function SpecBox({ icon, label, value, sub }) {
  if (!value) return null;
  return (
    <div className="flex flex-col items-start p-4 border border-stone-800 bg-[#292524] hover:border-amber-700/50 hover:bg-[#312e29] transition-all duration-300 group cursor-pointer hover:shadow-[0_0_15px_rgba(245,158,11,0.1)] h-full justify-between">
      <div>
        <div className="mb-2 opacity-70 group-hover:opacity-100 transition-opacity text-amber-600/80 group-hover:text-amber-500">
          {icon}
        </div>
        <span className="text-[10px] text-stone-500 font-mono uppercase tracking-widest mb-1 block">
          {label}
        </span>
      </div>
      <div>
        <span className="text-lg md:text-xl font-black text-[#dcd8c8] group-hover:text-amber-500 transition-colors break-words leading-none block">
          {value}
        </span>
        <span className="text-[9px] text-stone-600 font-mono mt-1 group-hover:text-stone-400 transition-colors block">
          {sub}
        </span>
      </div>
    </div>
  );
}

// --- Helper: Data Row (For Detail View) ---
const DataRow = ({ label, value, icon: Icon }) => {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between py-3 border-b border-stone-800/50 hover:bg-stone-800/20 px-2 transition-colors group">
      <div className="flex items-center gap-3">
        {Icon && (
          <Icon
            size={14}
            className="text-stone-600 group-hover:text-amber-600 transition-colors"
          />
        )}
        <span className="text-xs font-mono text-stone-500 uppercase tracking-wider">
          {label}
        </span>
      </div>
      <span className="text-sm font-bold text-[#EBE9E1] font-mono text-right">
        {value}
      </span>
    </div>
  );
};

export const CarDetailView = ({ car, onClose, onEdit }) => {
  const [viewMode, setViewMode] = useState("overview"); // 'overview' | 'full'

  const getFuelIcon = (fuelType) => {
    switch (fuelType) {
      case "ELECTRIC":
      case "HYBRID":
      case "PLUGIN_HYBRID":
        return <Zap className="w-5 h-5 text-amber-600" />;
      default:
        return <Fuel className="w-5 h-5 text-amber-600" />;
    }
  };

  // --- CONTENT: OVERVIEW MODE ---
  const renderOverview = () => (
    <div className="relative z-10 max-w-7xl mx-auto min-h-screen flex flex-col justify-center items-center pt-10 pb-10 px-4 animate-in fade-in duration-500">
      {/* Header Badge */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 border border-amber-700/30 bg-amber-950/20 rounded-full">
          <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
          <span className="text-xs md:text-sm text-amber-600 font-mono uppercase tracking-wider">
            System Overview
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-[#dcd8c8] mb-1 tracking-tight">
          {car.make} {car.model}
        </h1>

        {/* NICKNAME DISPLAY */}
        {car.nickname && (
          <div className="text-center mt-2 mb-4">
            <span className="text-2xl font-black text-amber-600 italic tracking-widest uppercase relative px-4">
              "{car.nickname}"
              <span className="absolute -top-1 -right-2 text-[8px] text-stone-500 not-italic">
                CODENAME
              </span>
            </span>
          </div>
        )}

        <p className="text-sm md:text-base text-stone-400 font-mono mt-2">
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

      {/* --- CAR VISUAL WITH HOVER HUD --- */}
      <div className="relative w-full max-w-5xl aspect-[16/9] md:aspect-[21/9] flex items-center justify-center group mb-10 cursor-help">
        <div className="relative w-full h-full grayscale contrast-125 sepia-[0.3] group-hover:grayscale-0 group-hover:sepia-0 group-hover:scale-[1.02] transition-all duration-700 ease-in-out bg-stone-900/50 border-2 border-stone-800 overflow-hidden">
          {/* The Image/Icon */}
          <div className="w-full h-full flex items-center justify-center">
            <Car className="w-32 h-32 md:w-48 md:h-48 text-stone-700 drop-shadow-[0_20px_30px_rgba(0,0,0,0.9)] transition-colors group-hover:text-[#EBE9E1]" />
          </div>

          {/* HOVER OVERLAY (HUD) */}
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

            {/* Decorative Lines */}
            <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-amber-500" />
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-amber-500" />
          </div>
        </div>
      </div>

      {/* Basic Specs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full max-w-4xl border-t border-stone-700 pt-6 md:pt-8 mb-10">
        {car.horsepower && (
          <SpecBox
            icon={<Gauge className="text-amber-600" />}
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
          icon={<Settings className="text-amber-600" />}
          label="Transmission"
          value={car.transmission}
          sub="Gearbox"
        />
        {car.mileage ? (
          <SpecBox
            icon={<Gauge className="text-amber-600" />}
            label="Mileage"
            value={`${car.mileage.toLocaleString()} km`}
            sub="Odometer"
          />
        ) : (
          <SpecBox
            icon={<Calendar className="text-amber-600" />}
            label="Production"
            value={car.year}
            sub="Year"
          />
        )}
      </div>

      {/* VIEW FULL DETAILS BUTTON */}
      <button
        onClick={() => setViewMode("full")}
        className="group relative px-8 py-4 bg-transparent border-2 border-stone-600 hover:border-amber-600 transition-colors overflow-hidden"
      >
        <div className="absolute inset-0 bg-stone-800 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        <span className="relative z-10 flex items-center gap-3 text-stone-400 group-hover:text-amber-500 font-black uppercase tracking-[0.2em] text-sm">
          <List className="w-4 h-4" />
          Access Full Manifest
        </span>
      </button>

      {/* Vehicle ID Badge */}
      <div className="absolute top-10 right-10 border-2 border-amber-700 p-2 rotate-[-5deg] opacity-80 mix-blend-screen hidden md:block">
        <div className="border border-amber-700 px-4 py-1">
          <span className="text-amber-600 font-black text-xl tracking-widest uppercase">
            ID: {car.id.toString().slice(-6)}
          </span>
        </div>
      </div>
    </div>
  );

  // --- CONTENT: FULL DETAILS MODE ---
  const renderFullDetails = () => (
    <div className="relative z-10 max-w-7xl mx-auto min-h-screen pt-10 pb-20 px-4 md:px-8 animate-in slide-in-from-bottom-10 duration-500">
      {/* Detail Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-stone-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-amber-600 mb-2">
            <FileText size={16} />
            <span className="text-xs font-mono uppercase tracking-widest">
              Complete Vehicle Manifest
            </span>
          </div>
          <h2 className="text-4xl font-black text-[#EBE9E1] uppercase">
            {car.make} {car.model}
          </h2>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => onEdit(car)}
            className="flex items-center gap-2 px-6 py-3 bg-stone-800 hover:bg-amber-600 text-stone-400 hover:text-stone-900 font-bold uppercase tracking-wider transition-all border border-stone-700"
          >
            <Settings className="w-4 h-4" />
            <span>Edit Data</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Column 1: Identity & Registration */}
        <div className="space-y-8">
          <div className="bg-[#201d1b] border border-stone-800 p-6">
            <h3 className="text-stone-500 font-mono text-xs uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <ShieldCheck size={14} /> Identity
            </h3>
            <div className="space-y-1">
              <DataRow label="VIN / Chassis" value={car.vin} icon={Hash} />
              <DataRow
                label="License Plate"
                value={car.licensePlate}
                icon={FileText}
              />
              <DataRow label="Nickname" value={car.nickname} icon={Sparkles} />
              <DataRow
                label="Production Year"
                value={car.year}
                icon={Calendar}
              />
              <DataRow
                label="Exterior Color"
                value={car.color}
                icon={Palette}
              />
              <DataRow label="Body Style" value={car.bodyType} icon={Car} />
            </div>
          </div>

          <div className="bg-[#201d1b] border border-stone-800 p-6">
            <h3 className="text-stone-500 font-mono text-xs uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <Globe size={14} /> Classification
            </h3>
            <div className="flex flex-col gap-3">
              {car.isProject ? (
                <span className="flex items-center gap-2 p-3 bg-amber-900/20 border border-amber-800/50 text-amber-500 text-xs font-mono uppercase">
                  <Wrench size={14} /> Active Restoration Project
                </span>
              ) : (
                <span className="flex items-center gap-2 p-3 bg-emerald-900/20 border border-emerald-800/50 text-emerald-500 text-xs font-mono uppercase">
                  <ShieldCheck size={14} /> Road Worthy Status
                </span>
              )}
              {car.isPublic ? (
                <span className="flex items-center gap-2 p-3 bg-stone-800 border border-stone-700 text-stone-400 text-xs font-mono uppercase">
                  <Globe size={14} /> Visible in Public Index
                </span>
              ) : (
                <span className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-900/50 text-red-500 text-xs font-mono uppercase">
                  <Lock size={14} /> Restricted / Private
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Column 2: Technical Telemetry */}
        <div className="space-y-8">
          <div className="bg-[#201d1b] border border-stone-800 p-6">
            <h3 className="text-stone-500 font-mono text-xs uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <Cpu size={14} /> Drivetrain
            </h3>
            <div className="space-y-1">
              <DataRow label="Engine Code" value={car.engine} icon={Activity} />
              <DataRow
                label="Displacement"
                value={car.engineCapacity ? `${car.engineCapacity}L` : null}
                icon={Gauge}
              />
              <DataRow label="Fuel System" value={car.fuelType} icon={Fuel} />
              <DataRow
                label="Transmission"
                value={car.transmission}
                icon={Settings}
              />
              <DataRow label="Drive Layout" value={car.driveType} icon={Move} />
            </div>
          </div>

          <div className="bg-[#201d1b] border border-stone-800 p-6">
            <h3 className="text-stone-500 font-mono text-xs uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <Gauge size={14} /> Performance
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-stone-800/50 p-3 text-center border border-stone-700">
                <span className="text-[10px] text-stone-500 uppercase block">
                  Horsepower
                </span>
                <span className="text-2xl font-black text-amber-500">
                  {car.horsepower || "---"}
                </span>
                <span className="text-[10px] text-amber-700 block">HP</span>
              </div>
              <div className="bg-stone-800/50 p-3 text-center border border-stone-700">
                <span className="text-[10px] text-stone-500 uppercase block">
                  Torque
                </span>
                <span className="text-2xl font-black text-amber-500">
                  {car.torque || "---"}
                </span>
                <span className="text-[10px] text-amber-700 block">NM</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-stone-800/50">
              <DataRow
                label="Odometer"
                value={
                  car.mileage ? `${car.mileage.toLocaleString()} km` : "---"
                }
                icon={Gauge}
              />
            </div>
          </div>
        </div>

        {/* Column 3: History & Description */}
        <div className="lg:col-span-1">
          <div className="bg-[#201d1b] border border-stone-800 p-6 h-full">
            <h3 className="text-stone-500 font-mono text-xs uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <Info size={14} /> Build Notes / History
            </h3>

            <div className="prose prose-invert max-w-none">
              {car.description ? (
                <div className="font-mono text-sm text-[#d1cfc7] leading-relaxed whitespace-pre-wrap bg-stone-900/50 p-4 border-l-2 border-amber-600">
                  {car.description}
                </div>
              ) : (
                <div className="text-stone-600 font-mono italic text-sm py-10 text-center border-2 border-dashed border-stone-800">
                  No description data available in mainframe.
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-stone-800">
              <div className="flex justify-between items-center text-[10px] font-mono text-stone-500 uppercase">
                <span>
                  Created: {new Date(car.createdAt).toLocaleDateString()}
                </span>
                <span>
                  Updated: {new Date(car.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-[#1c1917] z-50 overflow-y-auto custom-scrollbar">
      {/* Background Elements */}
      <div
        className="fixed inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #44403c 1px, transparent 1px),
            linear-gradient(to bottom, #44403c 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />
      <div className="fixed top-20 -left-10 text-[20vw] font-black text-stone-800/20 leading-none select-none pointer-events-none whitespace-nowrap z-0">
        {car.make}
      </div>

      {/* --- TOP NAVIGATION BAR --- */}
      <div className="sticky top-0 z-50 flex justify-between items-center px-6 py-4 bg-[#1c1917]/90 backdrop-blur-md border-b border-stone-800/50">
        <button
          onClick={() => {
            if (viewMode === "full") setViewMode("overview");
            else onClose();
          }}
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

      {/* --- RENDER CONTENT BASED ON MODE --- */}
      {viewMode === "overview" ? renderOverview() : renderFullDetails()}

      {/* Scanning Line Animation */}
      <div className="fixed top-0 left-0 w-full h-1 bg-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.5)] animate-scan opacity-20 pointer-events-none z-50" />

      <style jsx>{`
        @keyframes scan {
          0% {
            top: 0%;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            top: 100%;
            opacity: 0;
          }
        }
        .animate-scan {
          animation: scan 4s linear infinite;
        }
      `}</style>
    </div>
  );
};
