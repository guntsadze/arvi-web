"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Car as CarIcon, Loader2 } from "lucide-react";
import { carsService } from "@/services/cars/cars.service";
import { getErrorMessage } from "@/lib/error-handler";
import type { Car } from "@/types/car.types";
import type { GarageSummary } from "@/types/user";

interface ParkVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetGarageId: string;
  targetGarageName: string;
  /** All of the user's cars across every garage — filtered down here to the ones not already in targetGarageId. */
  cars: Car[];
  garages: GarageSummary[];
  onParked: (carId: string, garageId: string) => void;
}

/**
 * Reassigns an existing car into targetGarageId — distinct from CarForm,
 * which creates a brand-new car. Backed by PUT /cars/:id with just
 * { garageId }, which CreateCarDto/UpdateCarDto already support end to end
 * (UpdateCarDto extends PartialType(CreateCarDto)); CarsService.updateCar
 * now also verifies the target garage belongs to the requesting user before
 * applying it.
 */
export function ParkVehicleModal({
  isOpen,
  onClose,
  targetGarageId,
  targetGarageName,
  cars,
  garages,
  onParked,
}: ParkVehicleModalProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [movingId, setMovingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!mounted) return null;

  const garageNameById = new Map(garages.map((g) => [g.id, g.name]));
  const eligibleCars = cars.filter((car) => car.garageId !== targetGarageId);

  const handlePark = async (car: Car) => {
    setMovingId(String(car.id));
    setError(null);
    try {
      await carsService.update(car.id, { garageId: targetGarageId });
      onParked(String(car.id), targetGarageId);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setMovingId(null);
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[210] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/90 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="glass-card relative w-full max-w-md p-6"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-text-muted transition-colors hover:text-text-primary"
              aria-label="დახურვა"
            >
              <X size={16} />
            </button>

            <h2 className="mb-1 text-lg font-black uppercase tracking-tight text-text-primary">
              მანქანის შემოყვანა
            </h2>
            <p className="mb-5 text-xs text-text-secondary">
              აირჩიე რომელი მანქანა გადმოიტანო{" "}
              <span className="text-primary font-semibold">{targetGarageName}</span>
              -ში
            </p>

            {error && <p className="mb-3 text-xs text-error">{error}</p>}

            {eligibleCars.length === 0 ? (
              <p className="py-6 text-center text-xs uppercase tracking-widest text-text-muted">
                აღარ არის გადმოსატანი მანქანა
              </p>
            ) : (
              <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
                {eligibleCars.map((car) => {
                  const title = car.nickname || `${car.make} ${car.model}`;
                  const currentGarage = car.garageId
                    ? garageNameById.get(car.garageId)
                    : undefined;
                  const isMoving = movingId === String(car.id);

                  return (
                    <button
                      key={car.id}
                      onClick={() => handlePark(car)}
                      disabled={movingId !== null}
                      className="group flex w-full items-center gap-3 rounded-lg border border-border bg-surface-1 px-3 py-2.5 text-left transition-all duration-150 hover:border-primary/50 hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border/60 bg-surface-2">
                        <CarIcon size={16} className="text-text-secondary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-text-primary">
                          {title}
                        </p>
                        {currentGarage && (
                          <p className="truncate text-[10px] uppercase tracking-widest text-text-muted">
                            ამჟამად: {currentGarage}
                          </p>
                        )}
                      </div>
                      {isMoving ? (
                        <Loader2 size={16} className="animate-spin text-primary" />
                      ) : (
                        <ArrowRight
                          size={16}
                          className="text-text-muted transition-colors group-hover:text-primary"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
