"use client";

import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { carsService } from "@/services/cars/cars.service";
import { ProfileCarCard } from "./ProfileCarCard";

type Props = {
  userId: string;
};

export function UserGarage({ userId }: Props) {
  const {
    data: garage,
    loading,
    refresh,
  } = useInfiniteScroll(
    (page) => carsService.getUserGarage(userId, page, 10),
    [userId]
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {garage.map((car) => (
        <ProfileCarCard key={car.id} car={car} />
      ))}
    </div>
  );
}
