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
  Tag,
  ExternalLink,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/store/slices/userSlice";
import Image from "next/image";
import { TRANSMISSION_TYPES } from "@/constants/carOptions";
import { Card } from "../ui/Card";

const SellButton = ({ onClick }: any) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    className="relative group/sell overflow-hidden px-4 py-1.5 bg-accent/10 border border-accent/50 hover:bg-primary-hover transition-all duration-300"
  >
    <div className="absolute inset-0 translate-x-[-100%] group-hover/sell:translate-x-[100%] transition-transform duration-500 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    <div className="flex items-center gap-2">
      <Zap
        size={12}
        className="text-accent group-hover/sell:text-black transition-colors"
      />
      <span className="text-[10px]  font-black text-accent group-hover/sell:text-black tracking-tighter">
        გასაყიდად გატანა
      </span>
    </div>
  </button>
);

// "View Listing" ღილაკი — listing-ზე გადასასვლელი
const ViewListingButton = ({ listingId }: { listingId: string }) => (
  <Link
    href={`/listings/${listingId}`}
    onClick={(e) => e.stopPropagation()}
    className="relative group/view overflow-hidden px-4 py-1.5 bg-success/10 border border-success/50 hover:bg-success transition-all duration-300 flex items-center gap-2"
  >
    <div className="absolute inset-0 translate-x-[-100%] group-hover/view:translate-x-[100%] transition-transform duration-500 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    <ExternalLink
      size={12}
      className="text-success group-hover/view:text-black transition-colors"
    />
    <span className="text-[10px] font-mono font-black text-success group-hover/view:text-black uppercase tracking-tighter">
      განცხადების ნახვა
    </span>
  </Link>
);

// --- პორტალის კომპონენტი ---
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
        className="relative w-full max-w-md bg-surface-1 border border-border shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-3 border-b border-border bg-black/20">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-accent animate-pulse" />
            <h3 className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-accent">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-surface-1-hover text-text-muted transition-colors"
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

const ActionButton = ({ icon: Icon, onClick, label }: any) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    className="group/btn flex items-center gap-2 bg-black/40 border border-border px-3 py-2 hover:border-accent transition-all active:scale-95"
  >
    <Icon
      size={14}
      className="text-text-muted group-hover/btn:text-accent"
    />
    <span className="text-[9px] font-mono text-text-muted group-hover/btn:text-text-primary uppercase tracking-widest">
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

  const currentUser = useAppSelector(selectCurrentUser);

  const isOwner = car.userId === currentUser?.id;
  console.log("🚀 ~ ProfileCarCard ~ isOwner:", isOwner);

  const isListed = !!car.listings.length;
  // listings შეიძლება იყოს object ან array — ორივეს ვამუშავებთ
  const listingId = Array.isArray(car.listings)
    ? car.listings[0]?.id
    : car.listings?.id;

  return (
    <>
      <Card className="group relative flex flex-col h-full overflow-hidden transition-all">
        {/* ──── IMAGE SECTION ──── */}
        <div className="relative h-48 bg-black overflow-hidden border-b border-border">
          {/* {car.photos?.[0] ? (
            <Image
              src={car.photos[0].url}
              alt={car.model}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 grayscale hover:grayscale-0"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-surface-1">
              <Car className="w-12 h-12 text-text-secondary" />
            </div>
          )} */}

          {car.photos?.[0] ? (
            <Image
              src={car.photos[0].url}
              alt={car.model}
              fill
              className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 grayscale-[0.5] group-hover:grayscale-0"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-surface-1">
              <Car className="w-12 h-12 text-text-secondary" />
            </div>
          )}
          <div className="absolute top-2 right-2 z-20 flex gap-2">
            <button
              onClick={() => onViewFullDetails(car)}
              className="p-2 bg-black/60 backdrop-blur-md border border-white/10 text-white hover:text-accent transition-colors"
            >
              <Info size={14} />
            </button>
            {isOwner && (
              <button
                onClick={onClick}
                className="p-2 bg-black/60 backdrop-blur-md border border-white/10 text-white hover:text-accent transition-colors"
              >
                <Edit3 size={14} />
              </button>
            )}
          </div>

          {/* Carbon texture */}
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

          {/* License Plate */}
          <div className="absolute bottom-3 left-3 z-20">
            <div className="bg-white/90 backdrop-blur text-black text-[9px] font-bold px-2 py-0.5 rounded-sm border-l-4 border-info">
              {car.licensePlate || "NO_PLATE"}
            </div>
          </div>

          {/* ── LISTED FOR SALE OVERLAY BADGE ── */}
          {isListed && (
            <div className="absolute top-2 left-2">
              <div className="flex items-center gap-1.5 bg-success/10/90 border border-success/60 px-2 py-1 backdrop-blur-sm">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-success" />
                </span>
                <Tag size={9} className="text-success" />
                <span className="text-[8px]  text-success  tracking-wider">
                  გასულია გააყიდად
                </span>
              </div>
            </div>
          )}

          {/* ── LISTED: სურათზე მსუბუქი მწვანე border glow ── */}
          {isListed && (
            <div className="absolute inset-0 pointer-events-none border-2 border-success/20" />
          )}

          {/* Hover Actions */}
          {/* <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {isOwner && (
              <ActionButton
                icon={Edit3}
                label="Modify_Data"
                onClick={onClick}
              />
            )}
            <ActionButton
              icon={Eye}
              label="View_Telemetry"
              onClick={() => onViewFullDetails(car)}
            />
          </div> */}
        </div>

        {/* ──── INFO SECTION ──── */}
        <div className="p-3 flex-1 flex flex-col relative">
          <Terminal
            size={60}
            className="absolute bottom-4 right-4 opacity-[0.03] text-text-muted pointer-events-none"
          />

          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-1 bg-text-muted" />
              <span className="text-s  text-text-muted uppercase tracking-[0.3em]">
                {car.make}
              </span>
              <h3 className="text-xs  font-bold text-text-primary uppercase tracking-tight">
                {car.model}
              </h3>
            </div>
          </div>

          {/* Technical Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 mb-6">
            <DataField
              label="წელი"
              value={car.year}
              icon={<Calendar size={11} className="text-text-secondary" />}
            />
            <DataField
              label="ძრავი"
              value={`${car.engine}L`}
              icon={<Activity size={11} className="text-text-secondary" />}
            />
            <DataField
              label="ცხენისძალა"
              value={`${car.horsepower} HP`}
              icon={<Gauge size={11} className="text-accent/50" />}
              isOrange
            />
            <DataField
              label="გადაცემათა კოლოფი"
              value={
                TRANSMISSION_TYPES.find((t) => t.value === car.transmission)
                  ?.label || car.transmission
              }
              icon={<Settings size={11} className="text-text-secondary" />}
            />
          </div>

          <div className="flex align-center items-center justify-between">
            <div className="text-[13px] text-text-secondary">გარბენი</div>
            <div className="text-[9px]">
              {car.mileage?.toLocaleString() || 0}
            </div>
          </div>

          {/* ──── BOTTOM ACTION BAR ──── */}
          <div className="mt-auto pt-4 border-t border-border/50 flex flex-col gap-4">
            {/* Mods & Logs + mileage */}
            <div className="flex items-center justify-between font-mono">
              <div className="flex gap-4">
                <button
                  onClick={() => setModalType("mods")}
                  className="flex items-center gap-1.5 text-[9px] font-bold uppercase text-text-muted hover:text-accent transition-colors"
                >
                  <Zap size={10} /> [მოდიფიკაციები]
                </button>
                <button
                  onClick={() => setModalType("logs")}
                  className="flex items-center gap-1.5 text-[9px] font-bold uppercase text-text-muted hover:text-text-secondary transition-colors"
                >
                  <Database size={10} /> [სერვისები]
                </button>
              </div>
            </div>

            {/* Status + Action */}
            {isOwner && (
              <div className="flex items-center justify-between gap-2 border-t border-border/30 pt-3">
                {/* Status indicator */}
                {isListed ? (
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-success" />
                    </span>
                    <span className="text-[8px] text-success font-mono uppercase">
                      იყიდება
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-success/50 animate-pulse" />
                    {/* <span className="text-[8px] text-text-secondary font-mono uppercase">
                    System_Active
                  </span> */}
                  </div>
                )}

                {/* Action: Sell ან View Listing */}
                {isListed && car ? (
                  <ViewListingButton listingId={listingId} />
                ) : (
                  isOwner && <SellButton onClick={() => onSell(car)} />
                )}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* ──── PORTALS ──── */}
      <AnimatePresence>
        {modalType === "mods" && (
          <InfoPortal
            title="ავტომობილის მოდიფიკაციები"
            isOpen
            onClose={() => setModalType(null)}
          >
            {car.modifications?.length > 0 ? (
              <div className="space-y-2">
                {car.modifications.map((mod: any) => (
                  <div
                    key={mod.id}
                    className="p-3 bg-black/20 border border-border/50 flex justify-between items-center hover:border-accent/30 transition-colors"
                  >
                    <div>
                      <div className="text-[10px] font-bold text-text-secondary uppercase">
                        {mod.name}
                      </div>
                      <div className="text-[8px] text-text-muted uppercase tracking-widest">
                        {mod.brand}
                      </div>
                    </div>
                    <div className="text-[10px] text-accent font-bold">
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
            title="სერვისის ჩანაწერები"
            isOpen
            onClose={() => setModalType(null)}
          >
            {car.maintenanceRecords?.length > 0 ? (
              <div className="space-y-4">
                {car.maintenanceRecords.map((log: any) => (
                  <div
                    key={log.id}
                    className="relative pl-4 border-l border-border"
                  >
                    <div className="absolute top-0 -left-[1px] w-1 h-2 bg-accent" />
                    <div className="text-[8px] text-text-secondary mb-1">
                      {new Date(log.serviceDate).toLocaleDateString()} //
                      SYSTEM_LOG
                    </div>
                    <div className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                      {log.type}
                    </div>
                    <div className="text-[9px] text-text-muted italic mt-1 font-sans">
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

function DataField({ label, value, icon, isOrange }: any) {
  return (
    <div className="flex flex-col gap-1 p-2 rounded-sm bg-black/20 border-l border-border hover:border-border transition-colors">
      <div className="flex items-center gap-1.5 text-[9px] text-text-muted uppercase tracking-tighter font-mono">
        {icon} <span>{label}</span>
      </div>
      <div
        className={cn(
          "text-[9px] font-black font-mono leading-none",
          isOrange ? "text-accent" : "text-text-secondary",
        )}
      >
        {value}
      </div>
    </div>
  );
}
