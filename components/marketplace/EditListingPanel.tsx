"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Save,
  FileText,
  Phone,
  ShieldCheck,
  Loader2,
  Check,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";

import { RuggedSelect } from "../ui/RuggedSelect";
import { RuggedInput } from "../ui/RuggedInput";
import { RuggedTextArea } from "../ui/RuggedTextArea";

interface EditListingPanelProps {
  listing: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: any) => void;
  updateFn: (id: string, data: any) => Promise<any>;
}

type TabId = "info" | "contact" | "inspection";

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "info", label: "Listing_Info", icon: FileText },
  { id: "contact", label: "Contact", icon: Phone },
  { id: "inspection", label: "Inspection", icon: ShieldCheck },
];

export const EditListingPanel = ({
  listing,
  isOpen,
  onClose,
  onSave,
  updateFn,
}: EditListingPanelProps) => {
  const [activeTab, setActiveTab] = useState<TabId>("info");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    values: listing
      ? {
          ...listing,
          price: listing.price,
          inspection: listing.vehicleInspections?.[0] ?? {},
        }
      : {},
  });

  // მნიშვნელობების სათვალთვალოდ რეალურ დროში (ვიზუალური ეფექტებისთვის)
  const watchedValues = watch();

  // useEffect(() => {
  //   if (listing && isOpen) {
  //     reset({
  //       ...listing,
  //       // თუ ინსპექცია არსებობს, ამოვიღოთ პირველივე ელემენტი
  //       inspection: listing.vehicleInspections?.[0] ?? {},
  //     });
  //   }
  // }, [listing, isOpen, reset]);

  const onSubmit = async (data: any) => {
    console.log("🚀 ~ onSubmit ~ data:", data);
    setSaving(true);
    try {
      const payload = {
        ...data,
        price: Number(data.price),
      };
      const updated = await updateFn(listing.id, payload);
      onSave(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setSaving(false);
    }
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed right-0 top-0 h-full z-[80] w-full max-w-lg bg-[#181512] border-l border-stone-800 flex flex-col shadow-2xl"
          >
            {/* HEADER */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-800 bg-black/20 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-amber-500 animate-pulse" />
                <span className="text-[11px] font-mono font-black uppercase tracking-[0.2em] text-amber-500">
                  Edit_Listing
                </span>
                <ChevronRight size={12} className="text-stone-700" />
                <span className="text-[11px] font-mono text-stone-500 uppercase truncate max-w-[150px]">
                  {listing?.title}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-stone-600 hover:text-stone-300 hover:bg-stone-800 transition-all"
              >
                <X size={16} />
              </button>
            </div>

            {/* TABS */}
            <div className="flex border-b border-stone-800 shrink-0">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3 text-[9px] font-mono uppercase tracking-widest transition-all",
                    activeTab === tab.id
                      ? "text-amber-500 border-b-2 border-amber-500 bg-amber-500/5"
                      : "text-stone-600 hover:text-stone-400 border-b-2 border-transparent",
                  )}
                >
                  <tab.icon size={12} /> {tab.label}
                </button>
              ))}
            </div>

            {/* CONTENT */}
            <form
              id="edit-form"
              onSubmit={handleSubmit(onSubmit)}
              className="flex-1 overflow-y-auto p-5"
            >
              <AnimatePresence mode="wait">
                {activeTab === "info" && (
                  <motion.div
                    key="info"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="space-y-5"
                  >
                    <SectionLabel>Basic Information</SectionLabel>
                    <RuggedInput
                      label="Title"
                      name="title"
                      register={register}
                    />
                    <RuggedTextArea
                      label="Description"
                      name="description"
                      register={register}
                      rows={5}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <RuggedInput
                        label="Price"
                        name="price"
                        type="number"
                        register={register}
                      />
                      <RuggedSelect
                        label="Currency"
                        name="currency"
                        options={["GEL", "USD", "EUR"]}
                        register={register}
                      />
                    </div>
                    <RuggedInput
                      label="Location"
                      name="location"
                      register={register}
                    />
                  </motion.div>
                )}

                {activeTab === "contact" && (
                  <motion.div
                    key="contact"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="space-y-5"
                  >
                    <SectionLabel>Contact Information</SectionLabel>
                    <RuggedInput
                      label="Phone"
                      name="phone"
                      type="tel"
                      register={register}
                    />
                    <RuggedInput
                      label="Email"
                      name="email"
                      type="email"
                      register={register}
                    />
                    <Toggle
                      label="Allow Direct Messages"
                      name="allowMessages"
                      register={register}
                      checked={watchedValues.allowMessages}
                    />
                  </motion.div>
                )}

                {activeTab === "inspection" && (
                  <motion.div
                    key="inspection"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="space-y-6"
                  >
                    <div>
                      <SectionLabel>Ratings</SectionLabel>
                      <div className="space-y-4 mt-3">
                        {[
                          ["Exterior Visual", "exteriorVisualRating"],
                          ["Cabin / Comfort / Tech", "cabinComfortTechRating"],
                          ["Chassis / Structural", "chassisStructuralRating"],
                          [
                            "Drivetrain / Performance",
                            "drivetrainPerformanceRating",
                          ],
                          ["Lights / Exhaust", "lightsExhaustRating"],
                        ].map(([label, fieldName]) => (
                          <RatingSlider
                            key={fieldName}
                            label={label}
                            name={`inspection.${fieldName}`}
                            register={register}
                            value={watchedValues.inspection?.[fieldName]}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <SectionLabel>Exterior & Chassis</SectionLabel>
                      <div className="space-y-3 mt-3">
                        <RuggedSelect
                          label="Body Condition"
                          name="inspection.bodyCondition"
                          options={["ORIGINAL", "REPAINTED", "DAMAGED"]}
                          register={register}
                        />
                        <RuggedSelect
                          label="Glass Condition"
                          name="inspection.glassCondition"
                          options={["ORIGINAL", "REPLACED", "CRACKED"]}
                          register={register}
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <RuggedInput
                            label="Tire Tread (mm)"
                            name="inspection.tireTreadDepth"
                            type="number"
                            register={register}
                          />
                          <RuggedInput
                            label="Tire Age (Year)"
                            name="inspection.tireAge"
                            type="number"
                            register={register}
                          />
                        </div>
                        <Toggle
                          label="Has Rust"
                          name="inspection.hasRust"
                          register={register}
                          checked={watchedValues.inspection?.hasRust}
                        />
                        <Toggle
                          label="Panel Symmetry"
                          name="inspection.panelSymmetry"
                          register={register}
                          checked={watchedValues.inspection?.panelSymmetry}
                        />
                      </div>
                    </div>

                    <div>
                      <SectionLabel>Mechanical</SectionLabel>
                      <div className="space-y-3 mt-3">
                        <RuggedSelect
                          label="Engine Oil"
                          name="inspection.engineOilStatus"
                          options={["CLEAN", "DARK", "LOW", "LEAKING"]}
                          register={register}
                        />
                        <RuggedSelect
                          label="Transmission"
                          name="inspection.transmissionShift"
                          options={["SMOOTH", "ROUGH", "SLIPPING"]}
                          register={register}
                        />
                        <Toggle
                          label="Oil Leaking"
                          name="inspection.oilLeaking"
                          register={register}
                          checked={watchedValues.inspection?.oilLeaking}
                        />
                        <RuggedTextArea
                          label="Inspector Notes"
                          name="inspection.inspectorNotes"
                          register={register}
                          rows={3}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>

            {/* FOOTER */}
            <div className="px-5 py-4 border-t border-stone-800 bg-black/20 shrink-0">
              <button
                type="submit"
                form="edit-form"
                disabled={saving}
                className={cn(
                  "w-full flex items-center justify-center gap-2 py-3 font-mono font-black text-[11px] uppercase tracking-[0.15em] transition-all",
                  saved
                    ? "bg-emerald-500 text-black"
                    : "bg-amber-500 hover:bg-amber-400 text-black active:scale-[0.98]",
                  saving && "opacity-70 cursor-not-allowed",
                )}
              >
                {saving ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : saved ? (
                  <Check size={14} />
                ) : (
                  <Save size={14} />
                )}
                {saving ? "Saving..." : saved ? "Saved!" : "Save_Changes"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
};

// ────────────────────────────────────────────────────────────────
// HELPERS
// ────────────────────────────────────────────────────────────────

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-2">
    <div className="h-px flex-1 bg-stone-800" />
    <span className="text-[8px] font-mono uppercase tracking-[0.25em] text-stone-600 px-2">
      {children}
    </span>
    <div className="h-px flex-1 bg-stone-800" />
  </div>
);

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <label className="block text-[9px] font-mono uppercase tracking-[0.2em] text-stone-500">
      {label}
    </label>
    {children}
  </div>
);

const RatingSlider = ({
  label,
  name,
  register,
  value,
}: {
  label: string;
  name: string;
  register: any;
  value: any;
}) => (
  <Field label={label}>
    <div className="flex items-center gap-3">
      <input
        type="range"
        min={0}
        max={10}
        step={1}
        {...register(name, { valueAsNumber: true })}
        className="flex-1 accent-amber-500 h-1 cursor-pointer"
      />
      <span className="w-8 text-right text-amber-500 font-mono text-sm font-bold">
        {value ?? 0}
      </span>
    </div>
  </Field>
);

const Toggle = ({
  label,
  name,
  register,
  checked,
}: {
  label: string;
  name: string;
  register: any;
  checked: boolean;
}) => (
  <label className="flex items-center justify-between w-full p-3 bg-black/20 border border-stone-800 hover:border-stone-700 transition-colors cursor-pointer group">
    {/* დამალული ინპუტი, რომელიც მართავს ფორმის მნიშვნელობას */}
    <input type="checkbox" {...register(name)} className="hidden" />
    <span className="text-[11px] font-mono text-stone-400 uppercase tracking-wider">
      {label}
    </span>
    <div
      className={cn(
        "relative w-8 h-4 transition-colors",
        checked ? "bg-amber-500" : "bg-stone-700",
      )}
    >
      <div
        className={cn(
          "absolute top-0.5 w-3 h-3 bg-white transition-all",
          checked ? "left-[18px]" : "left-0.5",
        )}
      />
    </div>
  </label>
);
