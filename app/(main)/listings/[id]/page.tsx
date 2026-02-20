"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { marketplaceService } from "@/services/marketplace.service";
import { BackgroundGrid } from "@/components/ui/BackgroundGrid";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import {
  MapPin,
  Calendar,
  User,
  Tag,
  Fuel,
  Gauge,
  Settings2,
  ShieldCheck,
  CircleDollarSign,
} from "lucide-react";
import { MediaSlider } from "@/components/ui/MediaSlider";

const DetailItem: React.FC<{
  label: string;
  value: any;
  icon?: React.ReactNode;
}> = ({ label, value, icon }) => {
  if (value === null || value === undefined || value === "" || value === 0)
    return null;

  let displayValue =
    typeof value === "boolean" ? (value ? "Yes" : "No") : value;

  return (
    <div className="group p-4 rounded-xl bg-stone-900/20 border border-stone-800/50 hover:border-stone-700 transition-all">
      <div className="flex items-center gap-2 mb-1">
        {icon && <span className="text-stone-500">{icon}</span>}
        <p className="text-stone-500 text-[10px] font-mono uppercase tracking-widest">
          {label}
        </p>
      </div>
      <p className="text-stone-200 text-sm font-medium">{displayValue}</p>
    </div>
  );
};

const ListingDetailPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      marketplaceService
        .getListingById(id as string)
        .then(setListing)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen bg-[#1c1917] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );

  if (!listing) return null;

  const car = listing.car;
  const inspection = listing.vehicleInspections?.[0];

  // მონაცემების მორგება სლაიდერისთვის (თქვენს ობიექტში სურათები car.photos-შია)
  const mediaItems =
    car?.photos?.map((p: any) => ({
      url: p.url,
      mediaType: "IMAGE",
    })) || [];

  return (
    <div className="fixed inset-0 bg-[#1c1917] z-[60] overflow-y-auto selection:bg-amber-500/30">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <BackgroundGrid />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto py-10 px-4">
        <PageHeader
          title={listing.title || `${car?.year} ${car?.make} ${car?.model}`}
          onBack={() => router.push("/marketplace")}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          {/* მარცხენა მხარე: სლაიდერი და დეტალები */}
          <div className="lg:col-span-8 space-y-8">
            <div className="rounded-2xl overflow-hidden border border-stone-800 shadow-2xl bg-stone-900">
              <MediaSlider media={mediaItems} aspectRatio="aspect-[16/10]" />
            </div>

            <SectionWrapper title="Vehicle Specifications">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <DetailItem
                  label="Make"
                  value={car?.make}
                  icon={<Tag size={14} />}
                />
                <DetailItem
                  label="Model"
                  value={car?.model}
                  icon={<Settings2 size={14} />}
                />
                <DetailItem
                  label="Year"
                  value={car?.year}
                  icon={<Calendar size={14} />}
                />
                <DetailItem
                  label="Mileage"
                  value={car?.mileage > 0 ? `${car.mileage} km` : "Brand New"}
                  icon={<Gauge size={14} />}
                />
                <DetailItem
                  label="Fuel"
                  value={car?.fuelType}
                  icon={<Fuel size={14} />}
                />
                <DetailItem label="Engine" value={car?.engine} />
                <DetailItem
                  label="Horsepower"
                  value={car?.horsepower ? `${car.horsepower} HP` : null}
                />
                <DetailItem label="Transmission" value={car?.transmission} />
                <DetailItem label="Drive" value={car?.driveType} />
              </div>

              {listing.description && (
                <div className="mt-8 p-6 rounded-xl bg-stone-900/40 border border-stone-800">
                  <h4 className="text-stone-400 text-xs font-mono uppercase mb-3 tracking-widest">
                    Description
                  </h4>
                  <p className="text-stone-300 leading-relaxed whitespace-pre-line">
                    {listing.description}
                  </p>
                </div>
              )}
            </SectionWrapper>

            {inspection && (
              <SectionWrapper title="Inspection Report">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 flex flex-col items-center">
                    <span className="text-amber-500 text-2xl font-bold">
                      {inspection.exteriorVisualRating}/10
                    </span>
                    <span className="text-[10px] text-stone-500 uppercase mt-1">
                      Exterior
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex flex-col items-center">
                    <span className="text-blue-500 text-2xl font-bold">
                      {inspection.chassisStructuralRating}/10
                    </span>
                    <span className="text-[10px] text-stone-500 uppercase mt-1">
                      Structural
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/10 flex flex-col items-center">
                    <span className="text-green-500 text-2xl font-bold">
                      {inspection.drivetrainPerformanceRating}/10
                    </span>
                    <span className="text-[10px] text-stone-500 uppercase mt-1">
                      Drivetrain
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10 flex flex-col items-center">
                    <span className="text-purple-500 text-2xl font-bold">
                      {inspection.cabinComfortTechRating}/10
                    </span>
                    <span className="text-[10px] text-stone-500 uppercase mt-1">
                      Interior
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <DetailItem
                    label="AC Status"
                    value={inspection.acFunctional}
                  />
                  <DetailItem
                    label="Rust Presence"
                    value={inspection.hasRust}
                  />
                  <DetailItem label="Oil Leaks" value={inspection.oilLeaking} />
                  <DetailItem
                    label="Tire Tread"
                    value={`${inspection.tireTreadDepth}mm`}
                  />
                </div>
              </SectionWrapper>
            )}
          </div>

          {/* მარჯვენა მხარე: ფასი და კონტაქტი */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-10 space-y-6">
              {/* ფასის ბარათი */}
              <div className="p-8 rounded-3xl bg-gradient-to-br from-stone-800 to-stone-900 border border-stone-700 shadow-xl">
                <div className="flex items-center gap-2 text-amber-500 mb-2">
                  <CircleDollarSign size={20} />
                  <span className="text-xs font-mono uppercase font-bold tracking-tighter">
                    Asking Price
                  </span>
                </div>
                <h2 className="text-5xl font-black text-white mb-6">
                  {listing.price > 0
                    ? `${listing.price.toLocaleString()} ${listing.currency}`
                    : "Price on Call"}
                </h2>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-stone-400 text-sm">
                    <MapPin size={16} />{" "}
                    {listing.location || "Location not specified"}
                  </div>
                  <div className="flex items-center gap-3 text-stone-400 text-sm">
                    <ShieldCheck size={16} /> Verified Listing
                  </div>
                </div>

                <button className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-amber-500/20">
                  Contact Seller
                </button>
              </div>

              {/* გამყიდველის ბარათი */}
              <div className="p-6 rounded-2xl bg-stone-900/50 border border-stone-800/50 backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-stone-800 flex items-center justify-center border border-stone-700">
                    <User className="text-stone-500" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold">
                      {listing.user?.firstName} {listing.user?.lastName}
                    </h4>
                    <p className="text-stone-500 text-xs">
                      @{listing.user?.username}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailPage;
