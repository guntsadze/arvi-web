"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { GarageDoorTile } from "@/components/profile/GarageDoorTile";
import { CreateGarageModal } from "@/components/profile/CreateGarageModal";
import type { GarageSummary } from "@/types/user";
import type { Car } from "@/types/car.types";

interface GaragesAlleyProps {
  garages: GarageSummary[];
  carsByGarage: Record<string, Car[]>;
  isOwner: boolean;
  onAddCar: (garageId: string) => void;
  onParkVehicle: (garageId: string) => void;
  onEditCar: (car: Car) => void;
  onGarageCreated: (garage: GarageSummary) => void;
}

/**
 * The profile page's hero — a row/grid of GarageDoorTile, one per garage,
 * plus (owner-only) a matching "+ ახალი გარაჟი" tile that opens
 * CreateGarageModal. Purely presentational for the garages themselves (data
 * comes from the parent); owns only its own create-garage modal state.
 */
export function GaragesAlley({
  garages,
  carsByGarage,
  isOwner,
  onAddCar,
  onParkVehicle,
  onEditCar,
  onGarageCreated,
}: GaragesAlleyProps) {
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {garages.map((garage) => (
          <GarageDoorTile
            key={garage.id}
            garage={garage}
            cars={carsByGarage[garage.id] ?? []}
            isOwner={isOwner}
            onAddCar={() => onAddCar(garage.id)}
            onParkVehicle={() => onParkVehicle(garage.id)}
            onEditCar={onEditCar}
          />
        ))}

        {isOwner && (
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="group flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-surface-1/30 text-text-secondary transition-all duration-200 hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-current">
              <Plus size={18} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest">
              ახალი გარაჟი
            </span>
          </button>
        )}
      </div>

      <CreateGarageModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={onGarageCreated}
      />
    </div>
  );
}
