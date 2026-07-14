"use client";

import Link from "next/link";
import { Car, Plus } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/store/slices/userSlice";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { carsService } from "@/services/cars/cars.service";
import type { Car as CarType } from "@/services/cars/cars.service";

/**
 * Shown on /feed only for an authenticated user with zero cars in their
 * garage — invites them to add their first one. Reuses the same
 * useInfiniteScroll + carsService.getUserGarage pattern already used by
 * components/profile/UserGarage.tsx rather than a new fetching mechanism.
 * /onboarding/garage → /garage works fine outside the signup moment too,
 * it's just a normal authenticated page now.
 */
export function EmptyGarageCard() {
  const currentUser = useAppSelector(selectCurrentUser);

  const {
    data: garage,
    loading,
    error,
  } = useInfiniteScroll<CarType>(
    (page) =>
      currentUser?.id
        ? carsService.getUserGarage(currentUser.id, { page, limit: 1 })
        : Promise.resolve([]),
    [currentUser?.id],
  );

  if (!currentUser?.id || loading || error || garage.length > 0) return null;

  return (
    <Link
      href="/onboarding/garage"
      className="group mb-12 flex items-center gap-4 rounded-xl border border-border bg-surface-1 p-5 transition-colors hover:border-accent/50"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
        <Car size={22} />
      </div>

      <div className="flex-1">
        <p className="text-sm font-semibold text-text-primary">
          დაამატე შენი პირველი ავტომობილი
        </p>
        <p className="mt-0.5 text-xs text-text-secondary">
          დაამატე მანქანა გარაჟში და გაუზიარე საზოგადოებას
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 rounded-md bg-accent px-3 py-2 text-xs font-semibold text-text-primary transition-opacity group-hover:opacity-90">
        <Plus size={14} />
        დამატება
      </div>
    </Link>
  );
}
