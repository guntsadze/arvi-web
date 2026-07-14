"use client";

import { MediaSlider } from "../ui/MediaSlider";
import { ActivityHeader, ActivityVariant } from "../shared/ActivityHeader";
import { ActivityMenu } from "../shared/ActivityMenu";
import { ActivityActions } from "../shared/ActivityActions";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/store/slices/userSlice";
import { usePresence } from "@/context/PresenceContext";
import { Gauge, Fuel, Settings2, Palette } from "lucide-react";
import { useLikeAction } from "@/hooks/useLikeAction";

interface CarCardProps {
  activity: any;
  refresh: () => void;
}

export function CarAddedCard({ activity, refresh }: CarCardProps) {
  const currentUser = useAppSelector(selectCurrentUser);
  const { isUserOnline } = usePresence();
  const online = isUserOnline(activity.user.id);
  const isOwner = currentUser?.id === activity.user.id;

  console.log("🚀 ~ CarAddedCard ~ activity:", activity);
  const { isLiked, likesCount, handleLike } = useLikeAction({
    id: activity.car.id,
    type: "cars",
    initialIsLiked: activity.car.isLiked,
    initialCount: activity.car.likesCount,
  });
  const variant = activity.type.toLowerCase() as ActivityVariant;
  console.log("🚀 ~ CarAddedCard ~ variant:", variant);

  const car = activity.car;
  if (!car) return null;

  const specs = [
    { icon: <Palette size={10} />, value: car.color },
    { icon: <Fuel size={10} />, value: car.fuelType },
    { icon: <Settings2 size={10} />, value: car.transmission },
    {
      icon: <Gauge size={10} />,
      value: car.horsepower ? `${car.horsepower} HP` : null,
      highlight: true,
    },
  ].filter((s) => s.value);

  return (
    <div className="relative mb-8 group/card">
      <div className="bg-surface-1 border border-border hover:border-border transition-colors duration-300 overflow-hidden">
        {/* Top accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-50 z-10" />
        {/* Bottom accent */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-50 z-10" />

        {/* Header */}
        <ActivityHeader
          user={activity.user}
          createdAt={activity.createdAt}
          variant={variant}
          online={online}
          menu={
            <ActivityMenu
              isOwner={isOwner}
              onDelete={() => {
                // TODO: handleDelete
              }}
            />
          }
        />

        {/* Photos */}
        {car.photos?.length > 0 && (
          <MediaSlider media={car.photos} aspectRatio="aspect-[7/3]" />
        )}

        {/* Car Info */}
        <div className="p-4 space-y-3 bg-surface-1">
          {/* Title row */}
          <div className="flex items-end justify-between gap-3">
            <div className="flex items-end gap-3 flex-wrap">
              <h3 className="text-accent font-mono font-bold text-lg leading-none">
                {car.year} {car.make} {car.model}
              </h3>
              {car.nickname && (
                <span className="text-text-secondary text-xs font-mono pb-0.5">
                  "{car.nickname}"
                </span>
              )}
            </div>

            {/* isProject badge */}
            {car.isProject && (
              <span className="shrink-0 px-2 py-0.5 border border-accent/50 bg-accent/10 text-accent text-[9px] font-mono uppercase tracking-widest">
                Project Car
              </span>
            )}
          </div>

          {/* Specs */}
          {specs.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {specs.map((spec, i) => (
                <span
                  key={i}
                  className={`flex items-center gap-1 px-2 py-0.5 border text-[10px] font-mono uppercase tracking-wider ${
                    spec.highlight
                      ? "bg-accent/20 border-accent/50 text-accent"
                      : "bg-surface-2 border-border text-text-secondary"
                  }`}
                >
                  {spec.icon}
                  {spec.value}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          {car.description && (
            <p className="text-text-secondary text-sm font-mono leading-relaxed border-l-2 border-border pl-3">
              {car.description}
            </p>
          )}
        </div>

        {/* Actions — PostCard-ის იდენტური სტრუქტურა */}
        <ActivityActions
          variant="car"
          likesCount={likesCount}
          isLiked={isLiked || car.likes?.length > 0}
          onLike={handleLike}
        />
      </div>
    </div>
  );
}
