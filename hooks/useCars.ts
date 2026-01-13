import { useState, useEffect, useCallback } from "react";
import { carsService } from "@/services/cars/cars.service";

export const useCars = () => {
  const [cars, setCars] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCars = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await carsService.search();

      setCars(res.data || res || []);
      setError(null);
    } catch (err) {
      console.error("Error loading cars:", err);
      setError("Failed to load cars");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  return { cars, isLoading, error, refetch: fetchCars };
};
