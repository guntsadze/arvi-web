"use client";

import { useState } from "react";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { carsService } from "@/services/cars/cars.service";
import { Plus, Car as CarIcon } from "lucide-react";

import { ProfileCarCard } from "./ProfileCarCard";
import { CarForm } from "../cars/carForm";
import { CarFullDetails } from "../cars/carDetails/CarFullDetails";
import { Car } from "@/types/car.types";
import { selectCurrentUser } from "@/store/slices/userSlice";
import { useAppSelector } from "@/store/hooks";

type Props = {
  userId: string;
};

export function UserGarage({ userId }: Props) {
  const currentUser = useAppSelector(selectCurrentUser);
  const isOwner = currentUser?.id === userId;

  const { data: garage, refresh } = useInfiniteScroll(
    (page) => carsService.getUserGarage(userId, page, 10),
    [userId]
  );

  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  if (selectedCar) {
    return (
      <CarFullDetails
        car={selectedCar}
        onEdit={(car) => {
          setSelectedCar(null);
          setEditingCar(car);
        }}
        onClose={() => setSelectedCar(null)}
        isOwner={selectedCar.userId === currentUser?.id}
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {isOwner && (
          <button
            onClick={() => setIsAddingNew(true)}
            className="group relative border-2 border-dashed border-stone-800 hover:border-amber-600 transition-all duration-300 flex flex-col items-center justify-center gap-4 bg-stone-900/20 hover:bg-amber-500/5"
          >
            <div className="w-12 h-12 rounded-full border-2 border-stone-800 group-hover:border-amber-500 flex items-center justify-center transition-colors">
              <Plus
                className="text-stone-600 group-hover:text-amber-500"
                size={24}
              />
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 group-hover:text-amber-500">
                Register New Car
              </p>
              <p className="text-[9px] font-mono text-stone-700 uppercase mt-1">
                Add to garage storage
              </p>
            </div>
            {/* დეკორატიული ელემენტი კუთხეში */}
            <div className="absolute bottom-2 right-2 opacity-20 group-hover:opacity-100 transition-opacity">
              <CarIcon
                size={40}
                className="text-stone-800 group-hover:text-amber-900"
              />
            </div>
          </button>
        )}

        {/* GARAGE LIST */}
        {garage.map((car) => (
          <ProfileCarCard
            key={car.id}
            car={car}
            onClick={() => {
              if (isOwner) setEditingCar(car);
            }}
            onViewFullDetails={(car) => setSelectedCar(car)}
          />
        ))}
      </div>

      {/* FORM FOR ADDING (New Car) */}
      {isAddingNew && (
        <CarForm
          onClose={() => setIsAddingNew(false)}
          onSuccess={() => {
            refresh();
            setIsAddingNew(false);
          }}
        />
      )}

      {/* FORM FOR EDITING (Existing Car) */}
      {editingCar && (
        <CarForm
          key={editingCar.id}
          initialData={editingCar}
          onClose={() => setEditingCar(null)}
          onSuccess={() => {
            refresh();
            setEditingCar(null);
          }}
        />
      )}
    </>
  );
}
