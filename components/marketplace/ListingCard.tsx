"use client";

import { ActivityHeader, ActivityVariant } from "../shared/ActivityHeader";
import { ActivityMenu } from "../shared/ActivityMenu";
import { MediaSlider } from "../ui/MediaSlider";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/store/slices/userSlice";
import { usePresence } from "@/context/PresenceContext";
import {
  MapPin,
  Phone,
  MessageCircle,
  Tag,
  Gauge,
  Calendar,
  CheckCircle2,
  Wrench,
  Settings,
  Hash,
  Fingerprint,
  Info,
} from "lucide-react";
import { Card } from "../ui/Card";

interface ListingCardProps {
  activity: any;
  refresh: () => void;
}

const CONDITION_LABEL: Record<string, string> = {
  NEW: "ახალი",
  LIKE_NEW: "როგორც ახალი",
  EXCELLENT: "იდეალური",
  GOOD: "კარგი",
  FAIR: "საშუალო",
  POOR: "ცუდი",
  FOR_PARTS: "დაშლილი",
};

const CONDITION_COLOR: Record<string, string> = {
  NEW: "text-success border-success/50 bg-success/10",
  LIKE_NEW: "text-success border-success/50 bg-success/10",
  EXCELLENT: "text-info border-info/50 bg-info/10",
  GOOD: "text-accent border-accent/50 bg-accent/10",
  FAIR: "text-warning border-warning/50 bg-warning/10",
  POOR: "text-error border-error/50 bg-error/10",
  FOR_PARTS: "text-text-secondary border-border bg-surface-2",
};

export function ListingCard({ activity, refresh }: ListingCardProps) {
  const currentUser = useAppSelector(selectCurrentUser);
  const { isUserOnline } = usePresence();
  const online = isUserOnline(activity.user.id);
  const isOwner = currentUser?.id === activity.user.id;

  const listing = activity.listing;
  const car = listing?.car || activity.car;
  const post = activity.post;
  const variant = activity.type.toLowerCase() as ActivityVariant;

  const photos = listing?.car?.photos || car?.photos || post?.media || [];

  return (
    <div className="relative mb-12 group/card">
      <Card className="overflow-hidden shadow-2xl">
        {/* Neon Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent z-10" />

        <ActivityHeader
          user={activity.user}
          createdAt={activity.createdAt}
          variant={variant}
          online={online}
          menu={<ActivityMenu isOwner={isOwner} onDelete={() => {}} />}
        />

        {photos.length > 0 && (
          <MediaSlider media={photos} aspectRatio="aspect-[7/3]" />
        )}

        <div className="p-5 space-y-6">
          {/* 1. Header Section: Title & Price */}
          {(listing || car) && (
            <div className="flex justify-between items-start border-b border-border/50 pb-4">
              <div>
                <h3 className="text-xl text-text-primary font-mono font-black tracking-tighter uppercase italic">
                  {listing?.title || `${car?.year} ${car?.make} ${car?.model}`}
                </h3>
                {car?.nickname && (
                  <span className="text-accent/80 text-xs font-mono tracking-widest uppercase">
                    "{car.nickname}"
                  </span>
                )}
              </div>
              {listing?.price !== undefined && (
                <div className="text-right bg-accent/10 border border-accent/20 p-2 rounded-sm">
                  <span className="text-2xl text-accent font-mono font-bold leading-none block">
                    {listing.price.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-accent font-mono font-bold uppercase tracking-[0.2em]">
                    {listing.currency}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* 2. Technical Grid: VIN, Plate, Mileage */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {car?.vin && (
              <div className="bg-surface-1/40 border border-border p-2 group/info">
                <div className="flex items-center gap-2 text-text-secondary mb-1">
                  <Fingerprint
                    size={12}
                    className="group-hover/info:text-accent transition-colors"
                  />
                  <span className="text-[10px] uppercase font-bold tracking-tighter">
                    VIN Code
                  </span>
                </div>
                <p className="text-xs text-text-secondary font-mono truncate uppercase">
                  {car.vin}
                </p>
              </div>
            )}
            {car?.licensePlate && (
              <div className="bg-surface-1/40 border border-border p-2">
                <div className="flex items-center gap-2 text-text-secondary mb-1">
                  <Hash size={12} />
                  <span className="text-[10px] uppercase font-bold tracking-tighter">
                    Plate
                  </span>
                </div>
                <div className="inline-block px-1.5 py-0.5 border border-border rounded-sm text-[11px] font-bold text-text-primary bg-white/5">
                  {listing?.car.licensePlate}
                </div>
              </div>
            )}
            {car?.mileage && (
              <div className="bg-surface-1/40 border border-border p-2">
                <div className="flex items-center gap-2 text-text-secondary mb-1">
                  <Gauge size={12} />
                  <span className="text-[10px] uppercase font-bold tracking-tighter">
                    Mileage
                  </span>
                </div>
                <p className="text-xs text-text-secondary font-mono font-bold">
                  {listing.car.mileage.toLocaleString()} KM
                </p>
              </div>
            )}
          </div>

          {/* 3. Description Section */}
          {(listing?.description || post?.content) && (
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-accent/50 to-transparent" />
              <p className="text-text-secondary text-sm font-mono leading-relaxed pl-4 italic">
                {listing?.description || post?.content}
              </p>
            </div>
          )}

          {/* 4. Modifications & Services */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mods */}
            {car?.modifications?.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-accent/70 uppercase text-[10px] font-black tracking-widest">
                  <Settings size={12} /> Modifications
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {car.modifications.map((mod: any, i: number) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-surface-2 border border-border text-text-secondary text-[10px] font-mono"
                    >
                      + {mod.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {/* Service Records */}
            {car?.maintenanceRecords?.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-info/70 uppercase text-[10px] font-black tracking-widest">
                  <Wrench size={12} /> Service History
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {car.maintenanceRecords.map((record: any, i: number) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-info/10 border border-info/30 text-info text-[10px] font-mono flex items-center gap-1"
                    >
                      <CheckCircle2 size={8} /> {record.type.replace("_", " ")}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 5. Footer Specs Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border/80">
            {listing?.condition && (
              <div
                className={`px-2 py-0.5 border text-[9px] font-black uppercase tracking-tighter ${CONDITION_COLOR[listing.condition]}`}
              >
                {CONDITION_LABEL[listing.condition]}
              </div>
            )}
            {listing?.location && (
              <div className="flex items-center gap-1 text-text-secondary text-[10px] font-mono">
                <MapPin size={10} /> {listing.location}
              </div>
            )}

            <div className="ml-auto flex items-center gap-2">
              {listing?.phone && (
                <a
                  href={`tel:${listing.phone}`}
                  className="p-2 border border-border text-text-secondary hover:border-accent hover:text-accent transition-all flex items-center gap-2"
                >
                  <Phone size={14} />

                  {listing.phone}
                </a>
              )}
              {listing?.allowMessages && (
                <button className="flex items-center gap-2 px-4 py-2 bg-accent text-background text-[10px] font-black uppercase tracking-widest hover:bg-primary-hover transition-colors">
                  <MessageCircle size={14} />
                  Contact
                </button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
