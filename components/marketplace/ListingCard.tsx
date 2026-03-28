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
  NEW: "text-green-400 border-green-800/50 bg-green-900/20",
  LIKE_NEW: "text-green-400 border-green-800/50 bg-green-900/20",
  EXCELLENT: "text-blue-400 border-blue-800/50 bg-blue-900/20",
  GOOD: "text-amber-400 border-amber-800/50 bg-amber-900/20",
  FAIR: "text-orange-400 border-orange-800/50 bg-orange-900/20",
  POOR: "text-red-400 border-red-800/50 bg-red-900/20",
  FOR_PARTS: "text-stone-400 border-stone-700 bg-stone-800",
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
      <div className="bg-[#1a1817] border border-stone-800/60 hover:border-stone-500 transition-all duration-500 overflow-hidden shadow-2xl">
        {/* Neon Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent z-10" />

        <ActivityHeader
          user={activity.user}
          createdAt={activity.createdAt}
          variant={variant}
          online={online}
          menu={<ActivityMenu isOwner={isOwner} onDelete={() => {}} />}
        />

        {photos.length > 0 && (
          <MediaSlider media={photos} aspectRatio="aspect-[16/9]" />
        )}

        <div className="p-5 space-y-6">
          {/* 1. Header Section: Title & Price */}
          {(listing || car) && (
            <div className="flex justify-between items-start border-b border-stone-800/50 pb-4">
              <div>
                <h3 className="text-xl text-stone-100 font-mono font-black tracking-tighter uppercase italic">
                  {listing?.title || `${car?.year} ${car?.make} ${car?.model}`}
                </h3>
                {car?.nickname && (
                  <span className="text-amber-500/80 text-xs font-mono tracking-widest uppercase">
                    "{car.nickname}"
                  </span>
                )}
              </div>
              {listing?.price !== undefined && (
                <div className="text-right bg-amber-500/10 border border-amber-500/20 p-2 rounded-sm">
                  <span className="text-2xl text-amber-500 font-mono font-bold leading-none block">
                    {listing.price.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-amber-600 font-mono font-bold uppercase tracking-[0.2em]">
                    {listing.currency}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* 2. Technical Grid: VIN, Plate, Mileage */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {car?.vin && (
              <div className="bg-stone-900/40 border border-stone-800 p-2 group/info">
                <div className="flex items-center gap-2 text-stone-500 mb-1">
                  <Fingerprint
                    size={12}
                    className="group-hover/info:text-amber-500 transition-colors"
                  />
                  <span className="text-[10px] uppercase font-bold tracking-tighter">
                    VIN Code
                  </span>
                </div>
                <p className="text-xs text-stone-300 font-mono truncate uppercase">
                  {car.vin}
                </p>
              </div>
            )}
            {car?.plateNumber && (
              <div className="bg-stone-900/40 border border-stone-800 p-2">
                <div className="flex items-center gap-2 text-stone-500 mb-1">
                  <Hash size={12} />
                  <span className="text-[10px] uppercase font-bold tracking-tighter">
                    Plate
                  </span>
                </div>
                <div className="inline-block px-1.5 py-0.5 border border-stone-600 rounded-sm text-[11px] font-bold text-stone-200 bg-white/5">
                  {car.plateNumber}
                </div>
              </div>
            )}
            {listing?.mileage && (
              <div className="bg-stone-900/40 border border-stone-800 p-2">
                <div className="flex items-center gap-2 text-stone-500 mb-1">
                  <Gauge size={12} />
                  <span className="text-[10px] uppercase font-bold tracking-tighter">
                    Mileage
                  </span>
                </div>
                <p className="text-xs text-stone-300 font-mono font-bold">
                  {listing.mileage.toLocaleString()} KM
                </p>
              </div>
            )}
          </div>

          {/* 3. Description Section */}
          {(listing?.description || post?.content) && (
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-amber-500/50 to-transparent" />
              <p className="text-stone-400 text-sm font-mono leading-relaxed pl-4 italic">
                {listing?.description || post?.content}
              </p>
            </div>
          )}

          {/* 4. Modifications & Services */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mods */}
            {car?.modifications?.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-amber-500/70 uppercase text-[10px] font-black tracking-widest">
                  <Settings size={12} /> Modifications
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {car.modifications.map((mod: any, i: number) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-stone-800 border border-stone-700 text-stone-300 text-[10px] font-mono"
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
                <div className="flex items-center gap-2 text-blue-500/70 uppercase text-[10px] font-black tracking-widest">
                  <Wrench size={12} /> Service History
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {car.maintenanceRecords.map((record: any, i: number) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-blue-950/20 border border-blue-900/30 text-blue-400 text-[10px] font-mono flex items-center gap-1"
                    >
                      <CheckCircle2 size={8} /> {record.type.replace("_", " ")}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 5. Footer Specs Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-stone-800/80">
            {listing?.condition && (
              <div
                className={`px-2 py-0.5 border text-[9px] font-black uppercase tracking-tighter ${CONDITION_COLOR[listing.condition]}`}
              >
                {CONDITION_LABEL[listing.condition]}
              </div>
            )}
            {listing?.location && (
              <div className="flex items-center gap-1 text-stone-500 text-[10px] font-mono">
                <MapPin size={10} /> {listing.location}
              </div>
            )}

            <div className="ml-auto flex items-center gap-2">
              {listing?.phone && (
                <a
                  href={`tel:${listing.phone}`}
                  className="p-2 border border-stone-800 text-stone-400 hover:border-amber-600 hover:text-amber-500 transition-all"
                >
                  <Phone size={14} />
                </a>
              )}
              {listing?.allowMessages && (
                <button className="flex items-center gap-2 px-4 py-2 bg-stone-100 text-stone-950 text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 transition-colors">
                  <MessageCircle size={14} />
                  Contact
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
