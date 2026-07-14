"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { marketplaceService } from "@/services/marketplace.service";
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
  Edit3,
  AlertTriangle,
  Loader2,
  Trash2,
  X,
} from "lucide-react";
import { MediaSlider } from "@/components/ui/MediaSlider";
import { UserAvatarItem } from "@/components/ui/UserAvatarItem";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/store/slices/userSlice";
import { EditListingPanel } from "@/components/marketplace/EditListingPanel";
import { motion, AnimatePresence } from "framer-motion";
import { usePresence } from "@/context/PresenceContext";

const DetailItem: React.FC<{
  label: string;
  value: any;
  icon?: React.ReactNode;
}> = ({ label, value, icon }) => {
  if (value === null || value === undefined || value === "" || value === 0)
    return null;

  const displayValue =
    typeof value === "boolean" ? (value ? "Yes" : "No") : value;

  return (
    <div className="group p-4 rounded-xl bg-surface-1/20 border border-border/50 hover:border-border transition-all">
      <div className="flex items-center gap-2 mb-1">
        {icon && <span className="text-text-secondary">{icon}</span>}
        <p className="text-text-secondary text-[10px] font-mono uppercase tracking-widest">
          {label}
        </p>
      </div>
      <p className="text-text-primary text-sm font-medium">{displayValue}</p>
    </div>
  );
};

const DeleteConfirmModal = ({
  isOpen,
  title,
  onConfirm,
  onCancel,
  loading,
}: {
  isOpen: boolean;
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 12 }}
          transition={{ type: "spring", damping: 24, stiffness: 300 }}
          className="relative w-full max-w-sm bg-surface-1 border border-error/50 shadow-2xl"
        >
          {/* Red top accent */}
          <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-error to-transparent" />

          <div className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 bg-error/10/30 border border-error/50 flex items-center justify-center shrink-0">
                <AlertTriangle size={16} className="text-error" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-error">
                  Confirm_Delete
                </p>
                <p className="text-[11px] font-mono text-text-secondary mt-0.5 truncate">
                  {title}
                </p>
              </div>
              <button
                onClick={onCancel}
                className="text-text-muted hover:text-text-secondary transition-colors shrink-0"
              >
                <X size={14} />
              </button>
            </div>

            <p className="text-text-secondary text-xs font-mono leading-relaxed mb-6 border-l-2 border-error/50 pl-3">
              This action is{" "}
              <span className="text-error font-bold">permanent</span> and
              cannot be undone. The listing will be removed from the
              marketplace.
            </p>

            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 py-2.5 border border-border text-text-secondary font-mono text-[10px] uppercase tracking-wider hover:border-border hover:text-text-primary transition-all"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className="flex-1 py-2.5 bg-error/10/40 border border-error/50 hover:bg-error text-error hover:text-white font-mono text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Trash2 size={12} />
                )}
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const ListingDetailPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const currentUser = useAppSelector(selectCurrentUser);
  const { isUserOnline } = usePresence();
  const [listing, setListing] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      marketplaceService
        .getListingById(id as string)
        .then(setListing)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await marketplaceService.deleteListing(listing.id);
      router.push("/marketplace");
    } catch (err) {
      console.error("Delete failed:", err);
      setDeleting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
      </div>
    );

  if (!listing) return null;

  const car = listing.car;
  const inspection = listing.vehicleInspections?.[0];
  const isOwner = currentUser?.id === listing.userId;
  const online = isUserOnline(listing.user.id);

  const mediaItems =
    car?.photos?.map((p: any) => ({
      url: p.url,
      mediaType: "IMAGE",
    })) || [];

  return (
    <div className="fixed inset-0 bg-background z-[60] overflow-y-auto selection:bg-accent/30">
      <div className="relative z-10 max-w-6xl mx-auto py-10 px-4">
        <PageHeader
          title={listing.title || `${car?.year} ${car?.make} ${car?.model}`}
          onBack={() => router.push("/marketplace")}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          {/* ── LEFT ── */}
          <div className="lg:col-span-8 space-y-8">
            <div className="rounded-2xl overflow-hidden border border-border shadow-2xl bg-surface-1">
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
                <div className="mt-8 p-6 rounded-xl bg-surface-1/40 border border-border">
                  <h4 className="text-text-secondary text-xs font-mono uppercase mb-3 tracking-widest">
                    Description
                  </h4>
                  <p className="text-text-secondary leading-relaxed whitespace-pre-line">
                    {listing.description}
                  </p>
                </div>
              )}
            </SectionWrapper>

            {inspection && (
              <SectionWrapper title="Inspection Report">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-accent/5 border border-accent/10 flex flex-col items-center">
                    <span className="text-accent text-2xl font-bold">
                      {inspection.exteriorVisualRating}/10
                    </span>
                    <span className="text-[10px] text-text-secondary uppercase mt-1">
                      Exterior
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-info/5 border border-info/10 flex flex-col items-center">
                    <span className="text-info text-2xl font-bold">
                      {inspection.chassisStructuralRating}/10
                    </span>
                    <span className="text-[10px] text-text-secondary uppercase mt-1">
                      Structural
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-success/5 border border-success/10 flex flex-col items-center">
                    <span className="text-success text-2xl font-bold">
                      {inspection.drivetrainPerformanceRating}/10
                    </span>
                    <span className="text-[10px] text-text-secondary uppercase mt-1">
                      Drivetrain
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10 flex flex-col items-center">
                    <span className="text-purple-500 text-2xl font-bold">
                      {inspection.cabinComfortTechRating}/10
                    </span>
                    <span className="text-[10px] text-text-secondary uppercase mt-1">
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

          {/* ── RIGHT SIDEBAR ── */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-10 space-y-6">
              {/* Price Card */}
              <div className="p-8 rounded-3xl bg-gradient-to-br from-surface-2 to-surface-1 border border-border shadow-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-accent">
                    <CircleDollarSign size={20} />
                    <span className="text-xs font-mono uppercase font-bold tracking-tighter">
                      Asking Price
                    </span>
                  </div>

                  {/* Edit ღილაკი — მხოლოდ owner-ს უჩანს */}
                  {isOwner && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setEditOpen(true)}
                        title="Edit listing"
                        className="flex items-center gap-1 px-2.5 py-1.5 border border-border text-text-secondary hover:border-accent hover:text-accent transition-all group"
                      >
                        <Edit3
                          size={10}
                          className="group-hover:rotate-12 transition-transform"
                        />
                        <span className="text-[8px] font-mono uppercase tracking-wider">
                          Edit
                        </span>
                      </button>
                      <button
                        onClick={() => setDeleteOpen(true)}
                        title="Delete listing"
                        className="flex items-center gap-1 px-2.5 py-1.5 border border-border text-text-primary hover:border-error/60 hover:text-error transition-all"
                      >
                        <Trash2 size={10} />
                        <span className="text-[8px] font-mono uppercase tracking-wider">
                          Del
                        </span>
                      </button>
                    </div>
                  )}
                </div>

                <h2 className="text-5xl font-black text-white mb-6">
                  {listing.price > 0
                    ? `${listing.price.toLocaleString()} ${listing.currency}`
                    : "Price on Call"}
                </h2>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-text-secondary text-sm">
                    <MapPin size={16} />{" "}
                    {listing.location || "Location not specified"}
                  </div>
                  <div className="flex items-center gap-3 text-text-secondary text-sm">
                    <ShieldCheck size={16} /> Verified Listing
                  </div>
                </div>

                <button className="w-full py-4 bg-accent hover:bg-primary-hover text-black font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-accent/20">
                  Contact Seller
                </button>
              </div>

              {/* Seller Card */}
              <UserAvatarItem
                user={listing.user}
                variant="card"
                isOnline={online}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── EDIT PANEL ── */}
      <EditListingPanel
        listing={listing}
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={(updated) => {
          // server response-ს merge ვუკეთებთ არსებულ listing-ში
          setListing((prev: any) => ({ ...prev, ...updated }));
          setEditOpen(false);
        }}
        updateFn={(id, data) => marketplaceService.updateListing(id, data)}
      />

      <DeleteConfirmModal
        isOpen={deleteOpen}
        title={listing.title}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
        loading={deleting}
      />
    </div>
  );
};

export default ListingDetailPage;
