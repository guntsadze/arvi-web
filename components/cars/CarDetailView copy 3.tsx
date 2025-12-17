"use client";
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
  Activity,
  Hash,
  Palette,
  FileText,
  ShieldCheck,
  Globe,
  Lock,
} from "lucide-react";

// --- Helper Component: Spec Box (Grid Item) ---
function SpecBox({ icon, label, value, sub }) {
  if (!value) return null; // არ გამოაჩინოს თუ ცარიელია
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

// --- Helper Component: Data Row (List Item) ---
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
  const getFuelIcon = (fuelType) => {
    switch (fuelType) {
      case "ELECTRIC":
      case "HYBRID":
      case "PLUGIN_HYBRID":
        return <Zap className="w-5 h-5" />;
      default:
        return <Fuel className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-[#1c1917] z-50 overflow-y-auto custom-scrollbar">
      {/* --- Background Effects --- */}
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
      {/* Big Decorative Text */}
      <div className="fixed top-20 -left-10 text-[20vw] font-black text-stone-800/20 leading-none select-none pointer-events-none whitespace-nowrap z-0">
        {car.make}
      </div>

      {/* --- MAIN CONTENT WRAPPER --- */}
      <div className="relative z-10 max-w-7xl mx-auto min-h-screen flex flex-col pt-6 pb-20 px-4 md:px-8">
        {/* TOP NAVIGATION */}
        <div className="flex justify-between items-start mb-8 sticky top-0 z-50 py-4 bg-[#1c1917]/90 backdrop-blur-sm border-b border-stone-800/50">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 bg-stone-800/80 hover:bg-amber-600 text-[#EBE9E1] hover:text-stone-900 font-bold uppercase tracking-wider transition-all duration-300 border border-stone-700 hover:border-amber-600 clip-path-slant"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            onClick={() => onEdit(car)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-700/10 hover:bg-amber-600 text-amber-600 hover:text-stone-900 font-bold uppercase tracking-wider transition-all duration-300 border border-amber-700/50 hover:border-amber-600"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden md:inline">Modify Spec</span>
          </button>
        </div>

        {/* --- HERO SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-center">
          {/* Left: Headers */}
          <div>
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 border border-amber-700/30 bg-amber-950/20 rounded-full">
              <Sparkles className="w-3 h-3 text-amber-600 animate-pulse" />
              <span className="text-[10px] text-amber-600 font-mono uppercase tracking-widest">
                Vehicle ID: {car.id.slice(-8)}
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-[#EBE9E1] mb-2 tracking-tighter leading-[0.9]">
              {car.make}
              <br />
              <span className="text-stone-600">{car.model}</span>
            </h1>

            {car.nickname && (
              <div className="mt-4 inline-block border-l-4 border-amber-600 pl-4">
                <span className="text-sm font-mono text-stone-500 uppercase tracking-widest block">
                  Codename
                </span>
                <span className="text-2xl font-bold text-amber-500 italic">
                  "{car.nickname}"
                </span>
              </div>
            )}

            <div className="flex flex-wrap gap-3 mt-8">
              {car.isProject ? (
                <span className="flex items-center gap-2 px-3 py-1 bg-amber-900/30 border border-amber-800/50 text-amber-500 text-xs font-mono uppercase">
                  <Wrench size={12} /> Restoration Project
                </span>
              ) : (
                <span className="flex items-center gap-2 px-3 py-1 bg-emerald-900/30 border border-emerald-800/50 text-emerald-500 text-xs font-mono uppercase">
                  <ShieldCheck size={12} /> Road Ready
                </span>
              )}

              {car.isPublic ? (
                <span className="flex items-center gap-2 px-3 py-1 bg-stone-800 border border-stone-700 text-stone-400 text-xs font-mono uppercase">
                  <Globe size={12} /> Public Index
                </span>
              ) : (
                <span className="flex items-center gap-2 px-3 py-1 bg-red-900/20 border border-red-900/50 text-red-500 text-xs font-mono uppercase">
                  <Lock size={12} /> Private Collection
                </span>
              )}
            </div>
          </div>

          {/* Right: Visual */}
          <div className="relative aspect-video flex items-center justify-center group">
            {/* Main Image Container */}
            <div className="absolute inset-0 border-2 border-stone-800 bg-[#151413] flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#292524_0%,_#000000_100%)] opacity-50" />

              {/* Fallback Icon */}
              <Car
                className="w-48 h-48 text-stone-800 group-hover:text-stone-700 transition-colors duration-500 drop-shadow-2xl"
                strokeWidth={1}
              />

              {/* Overlay Grid lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:20px_20px]" />
            </div>

            {/* Tech Corners */}
            <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-amber-600" />
            <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-amber-600" />
            <div className="absolute top-1/2 -right-3 w-1 h-12 bg-stone-700 group-hover:bg-amber-600 transition-colors" />
            <div className="absolute top-1/2 -left-3 w-1 h-12 bg-stone-700 group-hover:bg-amber-600 transition-colors" />
          </div>
        </div>

        {/* --- SPECS GRID (Expanded) --- */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-stone-800" />
            <h3 className="text-stone-500 font-mono text-sm uppercase tracking-[0.3em]">
              Technical Telemetry
            </h3>
            <div className="h-px flex-1 bg-stone-800" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Row 1: Power & Engine */}
            <SpecBox
              icon={<Gauge className="w-5 h-5" />}
              label="Power Output"
              value={car.horsepower ? `${car.horsepower} HP` : "N/A"}
              sub="Peak Horsepower"
            />
            <SpecBox
              icon={<Activity className="w-5 h-5" />}
              label="Torque"
              value={car.torque ? `${car.torque} NM` : null}
              sub="Engine Torque"
            />
            <SpecBox
              icon={<Settings className="w-5 h-5" />}
              label="Engine Layout"
              value={car.engine || "Standard"}
              sub={
                car.engineCapacity
                  ? `${car.engineCapacity}L Capacity`
                  : "Configuration"
              }
            />
            <SpecBox
              icon={getFuelIcon(car.fuelType)}
              label="Fuel System"
              value={car.fuelType}
              sub="Energy Source"
            />

            {/* Row 2: Drivetrain & Body */}
            <SpecBox
              icon={<Car className="w-5 h-5" />}
              label="Body Style"
              value={car.bodyType}
              sub="Chassis Configuration"
            />
            <SpecBox
              icon={<Settings className="w-5 h-5 rotate-90" />}
              label="Transmission"
              value={car.transmission}
              sub="Gearbox"
            />
            <SpecBox
              icon={<Gauge className="w-5 h-5" />}
              label="Drivetrain"
              value={car.driveType}
              sub="Power Delivery"
            />
            <SpecBox
              icon={<Calendar className="w-5 h-5" />}
              label="Production"
              value={car.year}
              sub="Model Year"
            />
          </div>
        </div>

        {/* --- LOWER SECTION: DETAILS & MANIFEST --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Left: Detailed Registry (Data Table) */}
          <div className="bg-[#201d1b] border border-stone-800 p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <ShieldCheck size={100} />
            </div>

            <h4 className="text-amber-600 font-bold uppercase tracking-widest text-xs mb-6 border-b-2 border-amber-600/20 pb-2 inline-block">
              Registry Data
            </h4>

            <div className="space-y-1 relative z-10">
              <DataRow
                label="VIN / Chassis"
                value={car.vin || "---"}
                icon={Hash}
              />
              <DataRow
                label="License Plate"
                value={car.licensePlate || "---"}
                icon={FileText}
              />
              <DataRow
                label="Exterior Color"
                value={car.color || "---"}
                icon={Palette}
              />
              <DataRow
                label="Odometer"
                value={
                  car.mileage ? `${car.mileage.toLocaleString()} km` : "---"
                }
                icon={Gauge}
              />
              <DataRow
                label="Last Update"
                value={new Date(
                  car.updatedAt || Date.now()
                ).toLocaleDateString()}
                icon={Calendar}
              />
            </div>
          </div>

          {/* Right: Description (Manifest) */}
          <div className="md:col-span-2 relative">
            <div className="absolute -left-3 top-0 bottom-0 w-1 bg-stone-800 flex flex-col justify-between py-2 items-center">
              <div className="w-1.5 h-1.5 bg-amber-600 rounded-full" />
              <div className="w-px h-full bg-stone-700/50 my-2" />
              <div className="w-1.5 h-1.5 bg-stone-600 rounded-full" />
            </div>

            <div className="pl-6">
              <h4 className="text-stone-500 font-mono uppercase tracking-[0.2em] text-xs mb-4">
                Owner's Manifest / Build Log
              </h4>

              {car.description ? (
                <div className="prose prose-invert max-w-none">
                  <p className="font-mono text-sm md:text-base text-[#d1cfc7] leading-relaxed whitespace-pre-wrap border-l-2 border-stone-800 pl-4 py-2 bg-stone-800/20">
                    {car.description}
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-3 py-10 opacity-50">
                  <FileText className="text-stone-600" />
                  <span className="text-stone-600 font-mono italic text-sm">
                    No manifest data logged for this vehicle unit.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- DECORATIVE FOOTER --- */}
        <div className="mt-20 border-t border-stone-800 pt-6 flex justify-between items-end text-[10px] text-stone-600 font-mono uppercase">
          <div>
            System Status: <span className="text-emerald-600">ONLINE</span>
          </div>
          <div className="text-right">
            Garage Inventory Management System
            <br />
            V.2.0.4 // {new Date().getFullYear()}
          </div>
        </div>
      </div>

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
          animation: scan 5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .clip-path-slant {
          clip-path: polygon(
            10px 0,
            100% 0,
            100% calc(100% - 10px),
            calc(100% - 10px) 100%,
            0 100%,
            0 10px
          );
        }
      `}</style>
    </div>
  );
};
