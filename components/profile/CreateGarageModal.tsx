"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, DoorOpen, Rows3, PanelLeftClose } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SelectableCard } from "@/components/cars/onboarding/SelectableCard";
import { garageService } from "@/services/garage.service";
import { getErrorMessage } from "@/lib/error-handler";
import type { GarageDoorType, GarageMaterial, GarageSummary } from "@/types/user";

interface CreateGarageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (garage: GarageSummary) => void;
}

const DOOR_OPTIONS: { value: GarageDoorType; label: string; icon: typeof DoorOpen }[] = [
  { value: "ROLLER_SHUTTER", label: "რულონური კარი", icon: Rows3 },
  { value: "BARN_DOORS", label: "ორნაწილიანი კარი", icon: DoorOpen },
  { value: "SLIDING_DOOR", label: "სრიალა კარი", icon: PanelLeftClose },
];

const MATERIAL_OPTIONS: { value: GarageMaterial; label: string }[] = [
  { value: "INDUSTRIAL_STEEL", label: "ლითონი" },
  { value: "DARK_WOOD", label: "მუქი ხე" },
  { value: "RAW_CONCRETE", label: "ბეტონი" },
  { value: "CUSTOM", label: "საკუთარი ფერი" },
];

/**
 * Single-step garage creation — name + door type + material, reusing the
 * same SelectableCard tiles the car-onboarding wizard already established.
 * Deliberately not the full multi-step, live-preview-synced customizer
 * described in the Virtual Garage Hub RFC (that's its own future build);
 * this is the minimum needed to make "+ ახალი გარაჟი" actually functional.
 */
export function CreateGarageModal({
  isOpen,
  onClose,
  onCreated,
}: CreateGarageModalProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [name, setName] = useState("");
  const [doorType, setDoorType] = useState<GarageDoorType>("ROLLER_SHUTTER");
  const [material, setMaterial] = useState<GarageMaterial>("INDUSTRIAL_STEEL");
  const [color, setColor] = useState("#1a1a1a");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!mounted) return null;

  const reset = () => {
    setName("");
    setDoorType("ROLLER_SHUTTER");
    setMaterial("INDUSTRIAL_STEEL");
    setColor("#1a1a1a");
    setError(null);
  };

  const handleClose = () => {
    if (submitting) return;
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const garage = await garageService.create({
        name: name.trim() || undefined,
        doorType,
        material,
        color: material === "CUSTOM" ? color : undefined,
      });
      onCreated(garage);
      reset();
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[210] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-background/90 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="glass-card relative w-full max-w-md p-6"
          >
            <button
              onClick={handleClose}
              disabled={submitting}
              className="absolute right-4 top-4 text-text-muted transition-colors hover:text-text-primary disabled:opacity-40"
              aria-label="დახურვა"
            >
              <X size={16} />
            </button>

            <h2 className="mb-5 text-lg font-black uppercase tracking-tight text-text-primary">
              ახალი გარაჟი
            </h2>

            <div className="space-y-5">
              <Input
                label="სახელი"
                placeholder="მთავარი გარაჟი"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={40}
              />

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-text-secondary">
                  კარის ტიპი
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {DOOR_OPTIONS.map((opt) => (
                    <SelectableCard
                      key={opt.value}
                      size="sm"
                      title={opt.label}
                      icon={<opt.icon size={16} />}
                      selected={doorType === opt.value}
                      onClick={() => setDoorType(opt.value)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-text-secondary">
                  მასალა
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {MATERIAL_OPTIONS.map((opt) => (
                    <SelectableCard
                      key={opt.value}
                      size="sm"
                      title={opt.label}
                      selected={material === opt.value}
                      onClick={() => setMaterial(opt.value)}
                    />
                  ))}
                </div>
                {material === "CUSTOM" && (
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="mt-3 h-10 w-full cursor-pointer rounded-md border border-border bg-surface-1"
                  />
                )}
              </div>

              {error && <p className="text-xs text-error">{error}</p>}

              <Button
                onClick={handleSubmit}
                isLoading={submitting}
                className="w-full"
              >
                გარაჟის შექმნა
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
