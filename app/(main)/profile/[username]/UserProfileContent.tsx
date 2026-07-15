"use client";

import { useState } from "react";
import { Activity, Users, UserPlus } from "lucide-react";
import { UserPosts } from "@/components/profile/UserPosts";
import { UserFollowers } from "@/components/profile/UserFollowers";
import { UserFollowing } from "@/components/profile/UserFollowing";
import { GaragesAlley } from "@/components/profile/GaragesAlley";
import { ParkVehicleModal } from "@/components/profile/ParkVehicleModal";
import { GarageInductionWizard } from "@/components/cars/onboarding/GarageInductionWizard";
import { useGaragedCars } from "@/hooks/useGaragedCars";
import type { GarageSummary } from "@/types/user";
import type { Car } from "@/types/car.types";

type TabType = "posts" | "followers" | "following";

interface Props {
  user: any;
  userId: string;
  online: boolean;
  isOwner: boolean;
}

/**
 * The Virtual Garage Hub layout — GaragesAlley is the hero (~80% of the
 * page), Posts/Followers/Following are demoted to a compact secondary tab
 * strip below it. The old 4-col bio/stats sidebar moved into
 * ProfileDetailsDrawer (reached via ProfileMiniHeader's info button, above
 * this component) rather than living here.
 */
export default function ProfileContentWrapper({
  user,
  userId,
  isOwner,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabType>("posts");
  const [garages, setGarages] = useState<GarageSummary[]>(user.garages ?? []);
  const [addingCarToGarage, setAddingCarToGarage] = useState<string | null>(
    null,
  );
  const [parkingIntoGarage, setParkingIntoGarage] = useState<string | null>(
    null,
  );
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  const { carsByGarage, refresh: refreshCars } = useGaragedCars(userId);

  const handleGarageCreated = (garage: GarageSummary) => {
    setGarages((prev) => [...prev, garage]);
  };

  // ParkVehicleModal needs to see every one of the user's cars regardless of
  // which garage they're currently in, so it can offer "move this one over"
  // — carsByGarage is already fetched for the alley, just flattened here
  // instead of triggering a second fetch.
  const allCars = Object.values(carsByGarage).flat();
  const parkingIntoGarageName = garages.find(
    (g) => g.id === parkingIntoGarage,
  )?.name;

  // carCount from the initial profile payload can go stale the moment a car
  // is added client-side (no full profile re-fetch happens) — once
  // carsByGarage has loaded for a garage, its actual length is the source
  // of truth instead.
  const displayGarages = garages.map((g) => ({
    ...g,
    carCount: carsByGarage[g.id]?.length ?? g.carCount,
  }));

  return (
    <div className="min-h-screen bg-background relative selection:bg-accent/30">
      {/* GLOBAL BACKGROUND GRID */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      <div
        className="fixed inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #44403c 1px, transparent 1px),
            linear-gradient(to bottom, #44403c 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl space-y-10 px-4 py-10 md:px-10">
        {/* ── GARAGES ALLEY — the hero ── */}
        <GaragesAlley
          garages={displayGarages}
          carsByGarage={carsByGarage}
          isOwner={isOwner}
          onAddCar={(garageId) => setAddingCarToGarage(garageId)}
          onParkVehicle={(garageId) => setParkingIntoGarage(garageId)}
          onEditCar={(car) => setEditingCar(car)}
          onGarageCreated={handleGarageCreated}
        />

        {/* ── DEMOTED SECONDARY TABS ── */}
        <div className="border border-border bg-surface-1">
          <div className="flex border-b border-border font-mono text-[10px] tracking-widest">
            <TabButton
              icon={<Activity size={12} />}
              label="სიახლეები"
              isActive={activeTab === "posts"}
              onClick={() => setActiveTab("posts")}
            />
            <TabButton
              icon={<Users size={12} />}
              label="გამომწერები"
              count={user.followersCount}
              isActive={activeTab === "followers"}
              onClick={() => setActiveTab("followers")}
            />
            <TabButton
              icon={<UserPlus size={12} />}
              label="გამოწერილი"
              count={user.followingCount}
              isActive={activeTab === "following"}
              onClick={() => setActiveTab("following")}
            />
          </div>
          <div className="p-4">
            {activeTab === "posts" && <UserPosts userId={userId} />}
            {activeTab === "followers" && <UserFollowers userId={userId} />}
            {activeTab === "following" && <UserFollowing userId={userId} />}
          </div>
        </div>
      </div>

      {addingCarToGarage && (
        <GarageInductionWizard
          variant="modal"
          garageId={addingCarToGarage}
          onClose={() => setAddingCarToGarage(null)}
          onSuccess={() => {
            refreshCars();
            setAddingCarToGarage(null);
          }}
        />
      )}

      {parkingIntoGarage && (
        <ParkVehicleModal
          isOpen
          onClose={() => setParkingIntoGarage(null)}
          targetGarageId={parkingIntoGarage}
          targetGarageName={parkingIntoGarageName ?? ""}
          cars={allCars}
          garages={garages}
          onParked={() => refreshCars()}
        />
      )}

      {editingCar && (
        <GarageInductionWizard
          variant="modal"
          initialData={editingCar}
          onClose={() => setEditingCar(null)}
          onSuccess={() => {
            refreshCars();
            setEditingCar(null);
          }}
        />
      )}
    </div>
  );
}

function TabButton({
  icon,
  label,
  count,
  isActive,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  count?: number;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-1 items-center justify-center gap-1.5 border-r border-border/50 px-4 py-3 uppercase transition-all last:border-r-0 ${
        isActive
          ? "bg-accent/5 text-accent"
          : "text-text-secondary hover:bg-surface-1-hover/30"
      }`}
    >
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
      )}
      <span className={isActive ? "text-accent" : "text-text-secondary"}>
        {icon}
      </span>
      <span className="hidden sm:inline">{label}</span>
      {count !== undefined && (
        <span className="text-[9px] opacity-50">[{count}]</span>
      )}
    </button>
  );
}
