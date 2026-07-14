"use client";
import { Car } from "lucide-react";

import { CarCard } from "@/components/cars/CarCard";
import { useRouter } from "next/navigation";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { carsService } from "@/services/cars/cars.service";

export default function CarCollectionPage() {
  const router = useRouter();

  const {
    data: cars,
    loading,
    refresh,
  } = useInfiniteScroll((page) => carsService.search({ page, limit: 10 }));

  const isInitialLoading = loading && (!cars || cars.length === 0);
  const isFetchingNextPage = loading && cars && cars.length > 0;

  return (
    <div className="min-h-screen bg-background bg-[radial-gradient(#292524_1px,transparent_1px)] [background-size:16px_16px] text-text-primary font-sans pb-20">
      <div className="sticky top-0 z-30 border-b-4 border-border bg-background/95 backdrop-blur-sm shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-text-secondary font-mono text-xs tracking-[0.3em] uppercase border-t border-border mt-1 pt-1">
            სულ {cars?.length || 0} რეგისტრირებული ავტომობილი
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isInitialLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-border border-t-accent rounded-full animate-spin" />
          </div>
        ) : cars?.length === 0 ? (
          <div className="text-center py-20 border-4 border-dashed border-border/30 rounded-3xl">
            <Car className="w-24 h-24 mx-auto text-text-muted mb-4 opacity-50" />
            <h3 className="text-2xl font-black text-text-secondary uppercase mb-2">
              Garage Empty
            </h3>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cars?.map((car) => (
                <CarCard
                  key={car.id}
                  car={car}
                  onClick={() => router.push(`/profile/${car.user.username}`)}
                />
              ))}
            </div>

            {isFetchingNextPage && (
              <div className="flex justify-center py-10">
                <div className="w-10 h-10 border-4 border-border border-t-accent rounded-full animate-spin" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
