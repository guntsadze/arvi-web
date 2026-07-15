import { useCallback, useEffect, useState } from "react";
import { carsService } from "@/services/cars/cars.service";
import type { Car } from "@/types/car.types";

function extractCars(response: unknown): Car[] {
  if (Array.isArray(response)) return response as Car[];
  if (
    response &&
    typeof response === "object" &&
    "data" in response &&
    Array.isArray((response as { data: unknown }).data)
  ) {
    return (response as { data: Car[] }).data;
  }
  return [];
}

/**
 * Fetches a user's cars once (no per-garage endpoint exists yet — see the
 * Virtual Garage Hub RFC) and buckets them by `garageId` client-side.
 * `ensureDefaultGarage` on the backend guarantees every car has a non-null
 * `garageId` by the time a profile is loaded (it sweeps any pre-Garage-model
 * cars into the default garage at read time), so no "ungrouped" bucket is
 * needed here — a car with a missing/stale garageId is simply skipped
 * rather than guessed at.
 */
export function useGaragedCars(userId: string) {
  const [carsByGarage, setCarsByGarage] = useState<Record<string, Car[]>>({});
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const response: unknown = await carsService.getUserGarage(userId, {
        page: 1,
        limit: 100,
      });
      const cars = extractCars(response);
      const grouped: Record<string, Car[]> = {};
      for (const car of cars) {
        if (!car.garageId) continue;
        (grouped[car.garageId] ??= []).push(car);
      }
      setCarsByGarage(grouped);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { carsByGarage, loading, refresh };
}
