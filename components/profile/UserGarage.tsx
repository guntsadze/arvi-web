"use client";

import { useState } from "react";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { carsService } from "@/services/cars/cars.service";
import { Plus, Car as CarIcon, Loader2 } from "lucide-react";

import { ProfileCarCard } from "./ProfileCarCard";
import { CarForm } from "../cars/carForm";
import { CarFullDetails } from "../cars/carDetails/CarFullDetails";
import { Car } from "@/types/car.types";
import { selectCurrentUser } from "@/store/slices/userSlice";
import { useAppSelector } from "@/store/hooks";
import { MultiStepInspectionForm } from "../marketplace/forms/MultiStepInspectionForm";

type Props = {
  userId: string;
};

export function UserGarage({ userId }: Props) {
  const currentUser = useAppSelector(selectCurrentUser);
  const isOwner = currentUser?.id === userId;

  const {
    data: garage,
    loading,
    refresh,
    error,
  } = useInfiniteScroll(
    (page) => carsService.getUserGarage(userId, { page, limit: 10 }),
    [userId],
  );

  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [showInspectionForm, setShowInspectionForm] = useState(false);
  const [carToInspect, setCarToInspect] = useState<Car | null>(null);

  const [isLoadingDetails, setIsLoadingDetails] = useState<string | null>(null);

  const handleEditClick = async (carId: string) => {
    try {
      setIsLoadingDetails(carId);
      const fullCarData = await carsService.getCarDetails(carId);
      setEditingCar(fullCarData);
    } catch (error) {
      console.error("Failed to fetch car details:", error);
    } finally {
      setIsLoadingDetails(null);
    }
  };

  const handleSellVehicle = (car: Car) => {
    setCarToInspect(car);
    setShowInspectionForm(true);
  };

  const onInspectionSuccess = (inspectionData: any) => {
    if (carToInspect) {
      setShowInspectionForm(false);
      setCarToInspect(null);
    }
  };

  const onInspectionClose = () => {
    setShowInspectionForm(false);
    setCarToInspect(null);
  };

  if (selectedCar) {
    return (
      <CarFullDetails
        car={selectedCar}
        onEdit={(car) => {
          setSelectedCar(null);
          handleEditClick(car.id);
        }}
        onClose={() => setSelectedCar(null)}
        isOwner={selectedCar.userId === currentUser?.id}
      />
    );
  }

  if (showInspectionForm && carToInspect) {
    return (
      <MultiStepInspectionForm
        car={carToInspect}
        onClose={onInspectionClose}
        onSuccess={onInspectionSuccess}
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {isOwner && (
          <button
            onClick={() => setIsAddingNew(true)}
            className="group relative border-2 border-dashed border-stone-800 hover:border-amber-600 transition-all duration-300 flex flex-col items-center justify-center gap-4 bg-stone-900/20 hover:bg-amber-500/5 min-h-[300px]"
          >
            <div className="w-12 h-12 rounded-full border-2 border-stone-800 group-hover:border-amber-500 flex items-center justify-center transition-colors">
              <Plus
                className="text-[#EBE9E1] group-hover:text-amber-500"
                size={24}
              />
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-300 group-hover:text-amber-500">
                ავტმომობილის დამატება გარაჟში
              </p>
              {/* <p className="text-[9px] font-mono text-stone-300 uppercase mt-1">
                Add to garage storage
              </p> */}
            </div>
            <div className="absolute bottom-2 right-2 opacity-20 group-hover:opacity-100 transition-opacity">
              <CarIcon
                size={40}
                className="text-stone-400 group-hover:text-amber-900"
              />
            </div>
          </button>
        )}

        {/* GARAGE LIST */}
        {garage.map((car) => (
          <div key={car.id} className="relative">
            <ProfileCarCard
              car={car}
              onClick={() => {
                if (isOwner) handleEditClick(car.id);
              }}
              onViewFullDetails={(car) => setSelectedCar(car)}
              onSell={handleSellVehicle}
            />

            {/* ლოადერი ქარდზე, სანამ ინფორმაცია მოდის */}
            {isLoadingDetails === car.id && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
                <Loader2 className="text-amber-500 animate-spin" size={32} />
              </div>
            )}
          </div>
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
