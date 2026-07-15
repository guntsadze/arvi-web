"use client";

import { useRouter } from "next/navigation";
import { GarageInductionWizard } from "@/components/cars/onboarding/GarageInductionWizard";

/**
 * "Add Your First Car" onboarding — a thin wrapper around
 * GarageInductionWizard (the single create/edit surface for cars, shared
 * with the profile page's "add a car" flow). This route keeps the exact
 * first-time-user framing: full-page layout, skip link instead of a close
 * button, redirect to /feed on close or success.
 */
export default function OnboardingGaragePage() {
  const router = useRouter();
  const goToFeed = () => router.push("/feed");

  return (
    <GarageInductionWizard
      variant="onboarding"
      onClose={goToFeed}
      onSuccess={goToFeed}
    />
  );
}
