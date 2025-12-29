"use client";

import { useState } from "react";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { carsService } from "@/services/cars/cars.service";

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

  const { data: garage, refresh } = useInfiniteScroll(
    (page) => carsService.getUserGarage(userId, page, 10),
    [userId]
  );

  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  if (selectedCar) {
    return (
      <CarFullDetails
        car={selectedCar}
        onEdit={(car) => {
          setSelectedCar(null);
          setEditingCar(car);
        }}
        onClose={() => setSelectedCar(null)}
        isOwner={selectedCar.userId === currentUser.id}
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {garage.map((car) => (
          <ProfileCarCard
            key={car.id}
            car={car}
            onClick={() => {
              // მხოლოდ თავის მანქანაზე აჭერს რედაქტირება
              if (car.userId === currentUser.id) {
                setEditingCar(car);
              }
            }}
            onViewFullDetails={(car) => setSelectedCar(car)} // ყველას შეუძლია ნახოს დეტალურად
          />
        ))}
      </div>

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
