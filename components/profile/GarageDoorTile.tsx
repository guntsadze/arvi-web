"use client";

import { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  type Variants,
  type Transition,
} from "framer-motion";
import {
  DoorOpen,
  Rows3,
  PanelLeftClose,
  Plus,
  ArrowDownToLine,
  Pencil,
  Car as CarIcon,
} from "lucide-react";
import type {
  GarageSummary,
  GarageDoorType,
  GarageMaterial,
} from "@/types/user";
import type { Car } from "@/types/car.types";

export interface GarageDoorTileProps {
  garage: GarageSummary;
  /** Supplied by the parent, not fetched here — no per-garage car endpoint exists yet. */
  cars: Car[];
  isOwner: boolean;
  /** Called when the owner clicks "add a new car" inside an empty, open garage. */
  onAddCar?: () => void;
  /** Called when the owner clicks "park a vehicle" inside an open garage — available regardless of whether it's empty, since a non-empty garage can still receive more cars. */
  onParkVehicle?: () => void;
  /** Called with the car when the owner clicks the edit overlay on a revealed car thumbnail. */
  onEditCar?: (car: Car) => void;
}

const DOOR_SPRING: Transition = { type: "spring", stiffness: 80, damping: 14 };
// Framer Motion only supports 2-keyframe arrays with spring/inertia
// transitions ("Only two keyframes currently supported with spring and
// inertia animations") — RollerShutter's open animation is a genuine
// 3-point keyframe array (0% -> -70% -> -100%, with a scaleY pinch near the
// end to fake coiling into a drum), so it needs a tween instead of spring.
// BarnDoors/SlidingDoor animate to a single target value, not an array, so
// DOOR_SPRING is fine for those.
const ROLLER_TWEEN: Transition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.55,
};

const DOOR_TYPE_LABEL: Record<GarageDoorType, string> = {
  ROLLER_SHUTTER: "რულონური კარი",
  BARN_DOORS: "ორნაწილიანი კარი",
  SLIDING_DOOR: "სრიალა კარი",
};

const DOOR_TYPE_ICON: Record<GarageDoorType, typeof DoorOpen> = {
  ROLLER_SHUTTER: Rows3,
  BARN_DOORS: DoorOpen,
  SLIDING_DOOR: PanelLeftClose,
};

/**
 * Material -> literal (non-CSS-var) gradient stops for the closed door face.
 * Deliberately plain hex composed via template literal, never `hsl(var(--x))`
 * strings — an earlier component in this redesign (CarBlueprint.tsx) fed
 * `var()`-composed color strings into raw style/attribute values and it
 * rendered invisibly in production despite looking fine in isolated tests.
 * CUSTOM reads `garage.color` (a literal hex from the backend) directly for
 * the same reason, falling back to the steel look when null.
 */
const MATERIAL_GRADIENT: Record<Exclude<GarageMaterial, "CUSTOM">, string> = {
  INDUSTRIAL_STEEL: "linear-gradient(135deg, #9ca3af 0%, #52525b 55%, #27272a 100%)",
  DARK_WOOD: "linear-gradient(135deg, #8a5a34 0%, #5c3a1e 55%, #2b1810 100%)",
  RAW_CONCRETE: "linear-gradient(135deg, #b6b0a8 0%, #8a8479 55%, #625d54 100%)",
};

const SHEEN_OVERLAY =
  "linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(0,0,0,0.35) 100%)";

function getDoorBackgroundImage(
  material: GarageMaterial,
  color: string | null,
): string {
  if (material === "CUSTOM" && color) {
    return `${SHEEN_OVERLAY}, linear-gradient(135deg, ${color} 0%, ${color} 100%)`;
  }
  const base =
    material === "CUSTOM"
      ? MATERIAL_GRADIENT.INDUSTRIAL_STEEL
      : MATERIAL_GRADIENT[material];
  return `${SHEEN_OVERLAY}, ${base}`;
}

/**
 * Roof/pillar "structure" gradients — deliberately darker/flatter than the
 * door face gradients above so the frame reads as structural, not as a
 * second door. Same "literal values, no var() composition" rule applies.
 */
const STRUCTURE_GRADIENT: Record<Exclude<GarageMaterial, "CUSTOM">, string> = {
  INDUSTRIAL_STEEL: "linear-gradient(180deg, #3f3f46 0%, #18181b 100%)",
  DARK_WOOD: "linear-gradient(180deg, #4a2f1a 0%, #1f130a 100%)",
  RAW_CONCRETE: "linear-gradient(180deg, #6b675f 0%, #37342e 100%)",
};

const STRUCTURE_DARKEN_OVERLAY =
  "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55))";

function getStructureBackgroundImage(
  material: GarageMaterial,
  color: string | null,
): string {
  if (material === "CUSTOM" && color) {
    return `${STRUCTURE_DARKEN_OVERLAY}, linear-gradient(180deg, ${color} 0%, ${color} 100%)`;
  }
  const base =
    material === "CUSTOM"
      ? STRUCTURE_GRADIENT.INDUSTRIAL_STEEL
      : STRUCTURE_GRADIENT[material];
  return base;
}

const VENT_STRIPES =
  "repeating-linear-gradient(90deg, rgba(0,0,0,0.35) 0px, rgba(0,0,0,0.35) 1px, transparent 1px, transparent 6px)";

const LIGHT_COUNT = 4;

const lightsContainerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const lightVariants: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.25 } },
};

const carsContainerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const carItemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 220, damping: 22 },
  },
};

/**
 * One garage in the future "Garages Alley" grid. Purely presentational —
 * controls its own open/closed state locally, triggered by clicking the
 * tile. `cars` is supplied by the parent (no per-garage car endpoint exists
 * yet); this component never fetches.
 */
export function GarageDoorTile({
  garage,
  cars,
  isOwner,
  onAddCar,
  onParkVehicle,
  onEditCar,
}: GarageDoorTileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [lightsOn, setLightsOn] = useState(false);
  const [carsVisible, setCarsVisible] = useState(false);
  const carsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const DoorTypeIcon = DOOR_TYPE_ICON[garage.doorType];
  const doorBackgroundImage = getDoorBackgroundImage(
    garage.material,
    garage.color,
  );
  const structureBackgroundImage = getStructureBackgroundImage(
    garage.material,
    garage.color,
  );

  const handleDoorOpenComplete = () => {
    setLightsOn(true);
    // Cars start rising in a touch before the light stagger fully settles,
    // so the two phases overlap instead of reading as two dead-air steps.
    carsTimeoutRef.current = setTimeout(() => setCarsVisible(true), 180);
  };

  const handleToggle = () => {
    if (isOpen) {
      if (carsTimeoutRef.current) clearTimeout(carsTimeoutRef.current);
      setIsOpen(false);
      setLightsOn(false);
      setCarsVisible(false);
    } else {
      setIsOpen(true);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleToggle();
        }
      }}
      className="relative w-full aspect-[4/3] cursor-pointer select-none rounded-xl border border-border bg-surface-1 p-2 perspective-[1200px]"
      aria-pressed={isOpen}
      aria-label={`${garage.name} — ${isOpen ? "დახურვა" : "გახსნა"}`}
    >
      <div className="relative h-full w-full">
        {/* ── ROOF / GANTRY — flat industrial header, structurally hides the
             rolled-up shutter behind it (its bottom edge is exactly where
             the door-chamber's overflow-hidden boundary starts). ── */}
        <div
          className="absolute inset-x-0 top-0 z-40 h-6 overflow-hidden rounded-t-lg md:h-7"
          style={{ backgroundImage: structureBackgroundImage }}
        >
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: VENT_STRIPES }} />
          {/* light-strip motif */}
          <div
            className="absolute top-1/2 left-1/2 h-[2px] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgba(190,210,255,0.65)]"
            style={{ boxShadow: "0 0 6px 1px rgba(190,210,255,0.5)" }}
          />
        </div>

        {/* ── LEFT / RIGHT PILLARS — z-40, above the door layer, so barn
             doors visually swing behind them and the sliding door tucks
             under the left one mid-travel. ── */}
        <div
          className="absolute top-6 bottom-0 left-0 z-40 w-2.5 md:top-7 md:w-3"
          style={{ backgroundImage: structureBackgroundImage }}
        />
        <div
          className="absolute top-6 right-0 bottom-0 z-40 w-2.5 md:top-7 md:w-3"
          style={{ backgroundImage: structureBackgroundImage }}
        />

        {/* ── DOOR CHAMBER — the overflow-hidden boundary that makes the
             door genuinely disappear (roof/pillars are decoration; this is
             the actual containment). Inset by the pillar width and sits
             below the roof, matching their footprint exactly. ── */}
        <div className="absolute top-6 right-2.5 bottom-0 left-2.5 z-10 overflow-hidden rounded-b-lg md:top-7 md:right-3 md:left-3">
          {/* ── INTERIOR (static, sits behind the door) ── */}
          <div className="absolute inset-0 overflow-hidden border border-black/40 bg-gradient-to-b from-[#141416] to-black">
            {/* light fixtures */}
            <motion.div
              className="pointer-events-none absolute top-3 left-0 right-0 z-10 flex justify-evenly px-6"
              variants={lightsContainerVariants}
              initial="hidden"
              animate={lightsOn ? "visible" : "hidden"}
            >
              {Array.from({ length: LIGHT_COUNT }).map((_, i) => (
                <motion.div
                  key={i}
                  variants={lightVariants}
                  className="h-2.5 w-2.5 rounded-full bg-[rgba(255,244,214,0.95)]"
                  style={{
                    boxShadow:
                      "0 0 8px 3px rgba(255,244,214,0.55), 0 0 20px 7px rgba(255,244,214,0.22)",
                  }}
                />
              ))}
            </motion.div>

            {/* car reveal / empty state */}
            <AnimatePresence>
              {carsVisible && (
                <motion.div
                  key="interior-content"
                  className="absolute inset-0 z-10 flex flex-col justify-end gap-1.5 p-2.5"
                  variants={carsContainerVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                >
                  {cars.length > 0 ? (
                    <div className="flex w-full flex-wrap gap-1.5">
                      {cars.slice(0, 6).map((car) => (
                        <GarageCarThumb
                          key={car.id}
                          car={car}
                          isOwner={isOwner}
                          onEdit={onEditCar}
                        />
                      ))}
                    </div>
                  ) : (
                    <motion.p
                      variants={carItemVariants}
                      className="text-[9px] uppercase tracking-widest text-text-secondary/60 italic"
                    >
                      გარაჟი ცარიელია
                    </motion.p>
                  )}

                  {isOwner && (
                    <motion.div
                      variants={carItemVariants}
                      className="flex w-full flex-wrap gap-1.5"
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddCar?.();
                        }}
                        className="flex items-center gap-1.5 rounded border border-dashed border-border px-2.5 py-1.5 text-[9px] uppercase tracking-widest text-text-secondary transition-colors hover:border-accent/60 hover:text-accent"
                      >
                        <Plus size={11} />
                        ახალი მანქანა
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onParkVehicle?.();
                        }}
                        className="flex items-center gap-1.5 rounded border border-dashed border-border px-2.5 py-1.5 text-[9px] uppercase tracking-widest text-text-secondary transition-colors hover:border-accent/60 hover:text-accent"
                      >
                        <ArrowDownToLine size={11} />
                        შემოყვანა
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── DOOR LAYER (3D, sits on top of the interior) ──
               pointer-events-none: this wrapper is `inset-0` and z-20 for
               the whole lifetime of the tile, but once open its children
               (the actual door panels) have transformed away visually —
               the wrapper's own hit-test box does NOT move with them, so
               without this it silently becomes the click target for the
               revealed action buttons underneath (which have no ancestor
               relationship to it), swallowing the click and bubbling it
               straight to the outer tile's handleToggle before the
               button's own onClick/stopPropagation ever runs. Nothing in
               this subtree needs its own pointer events — the outer tile
               already handles toggle-to-open via normal bubbling through
               the empty space. */}
          <div
            className="pointer-events-none absolute inset-0 z-20"
            style={{ transformStyle: "preserve-3d" }}
          >
            {garage.doorType === "BARN_DOORS" && (
              <BarnDoors
                isOpen={isOpen}
                backgroundImage={doorBackgroundImage}
                onOpenComplete={handleDoorOpenComplete}
              />
            )}
            {garage.doorType === "ROLLER_SHUTTER" && (
              <RollerShutter
                isOpen={isOpen}
                backgroundImage={doorBackgroundImage}
                onOpenComplete={handleDoorOpenComplete}
              />
            )}
            {garage.doorType === "SLIDING_DOOR" && (
              <SlidingDoor
                isOpen={isOpen}
                backgroundImage={doorBackgroundImage}
                onOpenComplete={handleDoorOpenComplete}
              />
            )}
          </div>
        </div>

        {/* ── CLOSED-STATE LABEL (independent overlay, spans the whole
             structure, fades with isOpen) ── */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-50 flex flex-col items-center justify-center gap-1.5 px-4 text-center"
          animate={{ opacity: isOpen ? 0 : 1 }}
          transition={{ duration: 0.25 }}
        >
          <div className="flex items-center gap-1.5 text-white/85">
            <DoorTypeIcon size={13} />
            <span className="font-mono text-[9px] uppercase tracking-[0.2em]">
              {DOOR_TYPE_LABEL[garage.doorType]}
            </span>
          </div>
          <h3 className="text-sm font-black uppercase tracking-tight text-white drop-shadow md:text-base">
            {garage.name}
          </h3>
          <span className="font-mono text-[10px] text-white/70">
            {garage.carCount} მანქანა
          </span>
        </motion.div>

        {/* ── STATE INDICATOR — purely decorative, never needs its own
             interaction, and sits at z-50 right where the action buttons
             can wrap when open, so pointer-events-none defensively. ── */}
        <div
          className={`pointer-events-none absolute bottom-1.5 right-1.5 z-50 h-1.5 w-1.5 rounded-full transition-colors ${
            isOpen ? "bg-success shadow-[0_0_6px_rgba(34,197,94,0.7)]" : "bg-text-muted"
          }`}
        />
      </div>
    </div>
  );
}

interface DoorPanelProps {
  isOpen: boolean;
  backgroundImage: string;
  onOpenComplete: () => void;
}

function BarnDoors({ isOpen, backgroundImage, onOpenComplete }: DoorPanelProps) {
  return (
    <>
      <motion.div
        className="absolute top-0 left-0 h-full w-1/2 rounded-l-lg border-r border-black/40"
        style={{ transformOrigin: "left center", backgroundImage }}
        initial={false}
        animate={{ rotateY: isOpen ? -112 : 0 }}
        transition={DOOR_SPRING}
        onAnimationComplete={() => {
          if (isOpen) onOpenComplete();
        }}
      />
      <motion.div
        className="absolute top-0 right-0 h-full w-1/2 rounded-r-lg border-l border-black/40"
        style={{ transformOrigin: "right center", backgroundImage }}
        initial={false}
        animate={{ rotateY: isOpen ? 112 : 0 }}
        transition={DOOR_SPRING}
      />
    </>
  );
}

function RollerShutter({ isOpen, backgroundImage, onOpenComplete }: DoorPanelProps) {
  return (
    <motion.div
      className="absolute inset-0 overflow-hidden rounded-lg"
      style={{ transformOrigin: "top center" }}
      initial={false}
      animate={
        isOpen
          ? { y: ["0%", "-70%", "-100%"], scaleY: [1, 1, 0.85] }
          : { y: "0%", scaleY: 1 }
      }
      transition={ROLLER_TWEEN}
      onAnimationComplete={() => {
        if (isOpen) onOpenComplete();
      }}
    >
      <div className="absolute inset-0" style={{ backgroundImage }} />
      {/* horizontal slat texture */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, rgba(0,0,0,0.35) 0px, rgba(0,0,0,0.35) 2px, transparent 2px, transparent 10px)",
        }}
      />
    </motion.div>
  );
}

function SlidingDoor({ isOpen, backgroundImage, onOpenComplete }: DoorPanelProps) {
  return (
    <motion.div
      className="absolute inset-0 rounded-lg"
      style={{ transformOrigin: "left center", backgroundImage }}
      initial={false}
      animate={{ x: isOpen ? "-100%" : "0%", rotateY: isOpen ? 7 : 0 }}
      transition={DOOR_SPRING}
      onAnimationComplete={() => {
        if (isOpen) onOpenComplete();
      }}
    />
  );
}

/**
 * Lightweight teaser thumbnail — deliberately not ProfileCarCard.tsx (that's
 * a full-detail card with edit/sell actions, too heavy for this reveal
 * slot). The plain `Car` type (types/car.types.ts) has no photo field, so
 * every thumbnail shows a placeholder icon rather than a real cover image.
 * The edit overlay (owner-only) reveals on hover, matching the same
 * hover-to-reveal pattern ShowOffStep's photo-remove button already uses.
 */
function GarageCarThumb({
  car,
  isOwner,
  onEdit,
}: {
  car: Car;
  isOwner: boolean;
  onEdit?: (car: Car) => void;
}) {
  const title = car.nickname || `${car.make} ${car.model}`;
  return (
    <motion.div
      variants={carItemVariants}
      className="group relative flex min-w-0 items-center gap-1.5 rounded border border-border/60 bg-black/30 px-1.5 py-1"
    >
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border border-border/50 bg-surface-2">
        <CarIcon size={12} className="text-text-secondary" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-[9px] font-bold text-text-primary">{title}</p>
        <p className="font-mono text-[8px] text-text-secondary">{car.year}</p>
      </div>

      {isOwner && onEdit && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(car);
          }}
          className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-border bg-surface-2 text-text-secondary opacity-0 shadow-md transition-opacity duration-200 hover:border-primary/60 hover:text-primary group-hover:opacity-100"
          aria-label="რედაქტირება"
        >
          <Pencil size={10} />
        </button>
      )}
    </motion.div>
  );
}
