"use client";

import { useId } from "react";

export type DriveWheels = "FWD" | "RWD" | "AWD" | "FOURWD" | null;

export type BlueprintZone = "hood" | "wheels" | "shell" | "gauge";

export interface CarBlueprintProps {
  /** One of the 12 backend `BodyType` enum values, or undefined ("არ ვიცი"). */
  bodyType?: string;
  /** True once the wizard has been reached (step 1) — lights the main shell outline. */
  shellLit: boolean;
  /** True once the drivetrain step is reached — pops the hood open to reveal the engine bay. */
  hoodOpen: boolean;
  /** Which wheel(s) light up, derived from the chosen drive type. */
  driveWheels: DriveWheels;
  /** True once mileage has a value — lights the small odometer accent. */
  mileageLit: boolean;
  /** CSS color value tinting every "lit" stroke/glow (character-tag color). */
  glowColor?: string;
  /**
   * When provided, the active silhouette's hood/wheels/shell/gauge regions
   * become real click targets (invisible hit-areas layered over the
   * existing visuals) — used by GarageInductionWizard once a car exists to
   * open the modification/maintenance zone panel. Omit entirely for
   * read-only contexts (e.g. mid-creation, before a carId exists).
   */
  onZoneClick?: (zone: BlueprintZone) => void;
}

/**
 * The 9 hand-authored silhouettes the 12 `BodyType` enum values render as —
 * grouped per the onboarding brief so every enum value still renders
 * something (SUV+CROSSOVER share a raised/hatch-like silhouette,
 * VAN+MINIVAN share a boxy one, SPORTS_CAR+SUPERCAR share a low wedge).
 */
type SilhouetteKey =
  | "sedan"
  | "coupe"
  | "convertible"
  | "hatchback"
  | "wagon"
  | "suvCrossover"
  | "pickup"
  | "vanMinivan"
  | "sportsSuper";

interface WheelSpec {
  frontCx: number;
  rearCx: number;
  cy: number;
  r: number;
}

interface HoodSpec {
  x: number;
  y: number;
  w: number;
  h: number;
  /** Pivot point (at the cowl / windshield-base edge) the hood rotates open around. */
  hingeX: number;
  hingeY: number;
}

interface GaugeSpec {
  x: number;
  y: number;
}

interface Profile {
  /** Closed single-stroke path, side-profile silhouette, shared 0 0 440 200 viewBox. */
  outline: string;
  wheel: WheelSpec;
  hood: HoodSpec;
  gauge: GaugeSpec;
}

// All 9 silhouettes share one viewBox/baseline (rocker line ~y=142, wheels
// centered ~y=150) so they can be stacked and cross-faded in place. Each is a
// deliberately technical/wireframe outline (thin stroke, no photorealism) —
// proportions (roof height, hood length, greenhouse span, overhang) are what
// differentiate the 9 body shapes from one another.
const PROFILES: Record<SilhouetteKey, Profile> = {
  sedan: {
    outline:
      "M40,142 C50,110 80,98 115,95 C125,65 145,50 165,48 L250,48 C275,50 290,65 298,88 C310,98 330,102 355,108 C375,113 392,122 400,142 Z",
    wheel: { frontCx: 110, rearCx: 330, cy: 150, r: 26 },
    hood: { x: 40, y: 66, w: 78, h: 32, hingeX: 118, hingeY: 82 },
    gauge: { x: 150, y: 88 },
  },
  coupe: {
    outline:
      "M44,142 C55,112 85,100 120,97 C135,68 158,56 178,54 L228,53 C252,56 265,72 270,92 C285,108 320,118 396,142 Z",
    wheel: { frontCx: 118, rearCx: 322, cy: 150, r: 26 },
    hood: { x: 44, y: 70, w: 78, h: 30, hingeX: 122, hingeY: 85 },
    gauge: { x: 150, y: 90 },
  },
  convertible: {
    outline:
      "M44,142 C55,114 88,103 122,100 C138,85 155,78 172,76 L198,75 C210,74 218,80 222,86 C232,88 244,92 255,98 C275,110 320,120 396,142 Z",
    wheel: { frontCx: 118, rearCx: 322, cy: 150, r: 26 },
    hood: { x: 44, y: 76, w: 80, h: 28, hingeX: 124, hingeY: 90 },
    gauge: { x: 155, y: 93 },
  },
  hatchback: {
    outline:
      "M42,142 C52,110 82,98 116,95 C126,64 148,50 168,48 L228,49 C248,52 260,66 264,86 C270,108 285,128 300,138 C320,141 340,142 360,142 Z",
    wheel: { frontCx: 112, rearCx: 300, cy: 150, r: 26 },
    hood: { x: 42, y: 65, w: 76, h: 33, hingeX: 118, hingeY: 82 },
    gauge: { x: 148, y: 88 },
  },
  wagon: {
    outline:
      "M40,142 C50,110 80,98 114,95 C124,64 146,50 166,48 L280,48 C300,49 312,58 316,75 C319,95 319,118 319,138 C330,141 365,142 400,142 Z",
    wheel: { frontCx: 110, rearCx: 340, cy: 150, r: 26 },
    hood: { x: 40, y: 65, w: 76, h: 33, hingeX: 116, hingeY: 82 },
    gauge: { x: 146, y: 88 },
  },
  suvCrossover: {
    outline:
      "M38,142 C48,105 76,90 112,86 C124,55 148,40 170,38 L275,38 C300,40 315,52 320,72 C325,95 325,118 322,136 C335,140 365,141 402,142 Z",
    wheel: { frontCx: 112, rearCx: 330, cy: 154, r: 29 },
    hood: { x: 38, y: 52, w: 76, h: 37, hingeX: 114, hingeY: 70 },
    gauge: { x: 145, y: 75 },
  },
  pickup: {
    outline:
      "M42,142 C52,112 80,98 112,95 C122,66 142,52 162,50 L205,50 C222,52 232,66 236,85 L236,108 C236,116 244,120 258,120 L380,120 C392,120 400,126 404,142 Z",
    wheel: { frontCx: 112, rearCx: 340, cy: 150, r: 27 },
    hood: { x: 42, y: 63, w: 74, h: 35, hingeX: 116, hingeY: 80 },
    gauge: { x: 146, y: 85 },
  },
  vanMinivan: {
    outline:
      "M40,142 C46,100 60,70 90,55 C110,42 140,36 170,35 L310,35 C340,36 360,48 368,70 C374,95 376,118 376,138 C385,140 393,141 400,142 Z",
    wheel: { frontCx: 105, rearCx: 345, cy: 150, r: 27 },
    hood: { x: 40, y: 48, w: 52, h: 40, hingeX: 92, hingeY: 68 },
    gauge: { x: 112, y: 75 },
  },
  sportsSuper: {
    outline:
      "M34,138 C60,124 100,114 140,106 C165,86 190,68 215,60 C235,54 250,54 262,58 C280,64 295,76 305,91 C330,108 365,118 400,134 L406,138 Z",
    wheel: { frontCx: 95, rearCx: 350, cy: 146, r: 28 },
    hood: { x: 34, y: 96, w: 108, h: 22, hingeX: 142, hingeY: 107 },
    gauge: { x: 170, y: 100 },
  },
};

const SILHOUETTE_ORDER = Object.keys(PROFILES) as SilhouetteKey[];

const DEFAULT_SILHOUETTE: SilhouetteKey = "sedan";

// Backend BodyType enum -> which of the 9 hand-authored silhouettes renders.
const BODY_TYPE_TO_SILHOUETTE: Record<string, SilhouetteKey> = {
  SEDAN: "sedan",
  COUPE: "coupe",
  CONVERTIBLE: "convertible",
  HATCHBACK: "hatchback",
  WAGON: "wagon",
  SUV: "suvCrossover",
  CROSSOVER: "suvCrossover",
  PICKUP: "pickup",
  VAN: "vanMinivan",
  MINIVAN: "vanMinivan",
  SPORTS_CAR: "sportsSuper",
  SUPERCAR: "sportsSuper",
};

function resolveSilhouette(bodyType?: string): SilhouetteKey {
  if (bodyType && bodyType in BODY_TYPE_TO_SILHOUETTE) {
    return BODY_TYPE_TO_SILHOUETTE[bodyType];
  }
  return DEFAULT_SILHOUETTE;
}

/**
 * Presentation-only technical-blueprint rendering of the car being built —
 * zero form logic in here, it just paints whatever `CarBlueprintProps`
 * describe. Nine inline SVG side-profile silhouettes are stacked in one
 * shared viewBox and cross-faded via opacity/scale/blur (pure CSS
 * transitions, no animation library) based on the chosen body type; "lit"
 * zones (shell / hood / wheels / mileage gauge) fade between a dim neutral
 * stroke and a glowing `glowColor` stroke as the wizard progresses.
 */
// rgba fallbacks, not CSS custom properties — this component previously fed
// hsl(var(--primary))-style strings straight into SVG stroke/fill attributes,
// which rendered invisibly in production despite working in isolated tests
// (the grid pattern and dim wheel circles, which use the app's other proven
// pattern — stroke="currentColor" plus a Tailwind text-* class — rendered
// fine the whole time). Rather than chase the exact cause, every color here
// now goes through that same proven mechanism: a `color` set once via inline
// style, read everywhere via `currentColor`.
const DIM_COLOR = "rgba(210, 214, 220, 0.35)";

export function CarBlueprint({
  bodyType,
  shellLit,
  hoodOpen,
  driveWheels,
  mileageLit,
  glowColor = "rgba(34, 197, 94, 1)",
  onZoneClick,
}: CarBlueprintProps) {
  const uid = useId();
  const active = resolveSilhouette(bodyType);
  const isGeneric = !bodyType;

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-border bg-black/30">
      <svg
        viewBox="0 0 440 200"
        className="h-56 w-full sm:h-64"
        role="img"
        aria-label="მანქანის ტექნიკური სქემა"
      >
        <defs>
          <pattern
            id={`blueprint-grid-${uid}`}
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M20 0H0V20"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-border"
            />
          </pattern>
        </defs>

        {/* ambient blueprint-paper grid, always present regardless of state */}
        <rect
          x="0"
          y="0"
          width="440"
          height="200"
          fill={`url(#blueprint-grid-${uid})`}
          opacity={0.35}
        />
        <line
          x1="20"
          y1="176"
          x2="420"
          y2="176"
          stroke="currentColor"
          strokeDasharray="2 4"
          strokeWidth="1"
          className="text-border"
        />
        {Array.from({ length: 15 }).map((_, i) => (
          <line
            key={i}
            x1={30 + i * 27}
            y1="172"
            x2={30 + i * 27}
            y2="180"
            stroke="currentColor"
            strokeWidth="1"
            className="text-border"
          />
        ))}

        {SILHOUETTE_ORDER.map((key) => (
          <SilhouetteGroup
            key={key}
            profile={PROFILES[key]}
            isActive={key === active}
            dim={isGeneric}
            shellLit={shellLit}
            hoodOpen={hoodOpen}
            driveWheels={driveWheels}
            mileageLit={mileageLit}
            glowColor={glowColor}
            onZoneClick={onZoneClick}
          />
        ))}
      </svg>
    </div>
  );
}

interface SilhouetteGroupProps {
  profile: Profile;
  isActive: boolean;
  dim: boolean;
  shellLit: boolean;
  hoodOpen: boolean;
  driveWheels: DriveWheels;
  mileageLit: boolean;
  glowColor: string;
  onZoneClick?: (zone: BlueprintZone) => void;
}

function SilhouetteGroup({
  profile,
  isActive,
  dim,
  shellLit,
  hoodOpen,
  driveWheels,
  mileageLit,
  glowColor,
  onZoneClick,
}: SilhouetteGroupProps) {
  const { outline, wheel, hood, gauge } = profile;
  const frontLit = driveWheels === "FWD" || driveWheels === "AWD" || driveWheels === "FOURWD";
  const rearLit = driveWheels === "RWD" || driveWheels === "AWD" || driveWheels === "FOURWD";
  const dimColor = DIM_COLOR;
  const shellStroke = shellLit ? glowColor : dimColor;

  const cylinderCount = 4;
  const cylinderW = hood.w / (cylinderCount + 1);

  return (
    <g
      className="pointer-events-none"
      style={{
        opacity: isActive ? (dim ? 0.4 : 1) : 0,
        transform: isActive ? "scale(1)" : "scale(0.96)",
        filter: isActive ? undefined : "blur(2px)",
        transformBox: "fill-box",
        transformOrigin: "center",
        transition: "opacity 500ms ease-out, transform 500ms ease-out, filter 500ms ease-out",
      }}
    >
      {/* engine bay — sits under the hood flap, only reads once it's open */}
      <g style={{ opacity: hoodOpen ? 1 : 0, transition: "opacity 400ms ease-out 150ms" }}>
        {Array.from({ length: cylinderCount }).map((_, i) => (
          <rect
            key={i}
            x={hood.x + 4 + i * cylinderW}
            y={hood.y + hood.h - 22}
            width={Math.max(cylinderW - 4, 2)}
            height={14}
            rx={1.5}
            fill="none"
            stroke={glowColor}
            strokeWidth={1.2}
            style={{ filter: `drop-shadow(0 0 3px ${glowColor})` }}
          />
        ))}
        <rect
          x={hood.x + hood.w - cylinderW - 6}
          y={hood.y + hood.h - 10}
          width={cylinderW + 10}
          height={9}
          rx={1.5}
          fill="none"
          stroke={glowColor}
          strokeWidth={1.2}
          style={{ filter: `drop-shadow(0 0 3px ${glowColor})` }}
        />
      </g>

      {/* main body outline */}
      <path
        d={outline}
        fill={glowColor}
        fillOpacity={shellLit ? 0.05 : 0}
        stroke={shellStroke}
        strokeWidth={1.75}
        strokeLinejoin="round"
        style={{
          filter: shellLit
            ? `drop-shadow(0 0 3px ${glowColor}) drop-shadow(0 0 10px ${glowColor})`
            : undefined,
          transition: "stroke 500ms ease-out, filter 500ms ease-out",
        }}
      />

      {/* hinged hood flap — pivots open at the cowl edge */}
      <path
        d={`M${hood.x},${hood.y} L${hood.x + hood.w},${hood.y} L${hood.x + hood.w},${hood.y + hood.h} L${hood.x},${hood.y + hood.h} Z`}
        fill="rgba(0,0,0,0.3)"
        stroke={shellStroke}
        strokeWidth={1.25}
        strokeDasharray="3 2"
        style={{
          transformOrigin: `${hood.hingeX}px ${hood.hingeY}px`,
          transform: hoodOpen ? "rotate(-22deg) translateY(-6px)" : "rotate(0deg) translateY(0)",
          transition: "transform 500ms cubic-bezier(0.22,1,0.36,1)",
        }}
      />

      {/* front + rear wheels */}
      {[
        { cx: wheel.frontCx, lit: frontLit },
        { cx: wheel.rearCx, lit: rearLit },
      ].map(({ cx, lit }, i) => (
        <g key={i}>
          {/* faint duplicate outline hints "two wheels on this axle" without a full 3D pass */}
          <circle
            cx={cx + 5}
            cy={wheel.cy}
            r={wheel.r - 3}
            fill="none"
            stroke="currentColor"
            strokeWidth={0.75}
            strokeDasharray="2 3"
            className="text-border"
            opacity={0.5}
          />
          <circle
            cx={cx}
            cy={wheel.cy}
            r={wheel.r}
            fill="none"
            stroke={lit ? glowColor : dimColor}
            strokeWidth={lit ? 2 : 1.5}
            style={{
              filter: lit ? `drop-shadow(0 0 5px ${glowColor})` : undefined,
              transition: "stroke 400ms ease-out, filter 400ms ease-out",
            }}
          />
          <circle
            cx={cx}
            cy={wheel.cy}
            r={wheel.r * 0.42}
            fill="none"
            stroke={lit ? glowColor : dimColor}
            strokeWidth={1}
            opacity={0.8}
          />
        </g>
      ))}

      {/* odometer / mileage accent, roughly where the dashboard sits */}
      <g
        style={{
          opacity: mileageLit ? 1 : 0.35,
          filter: mileageLit ? `drop-shadow(0 0 4px ${glowColor})` : undefined,
          transition: "opacity 400ms ease-out, filter 400ms ease-out",
        }}
      >
        <circle
          cx={gauge.x}
          cy={gauge.y}
          r={7}
          fill="none"
          stroke={mileageLit ? glowColor : dimColor}
          strokeWidth={1.25}
        />
        <line
          x1={gauge.x}
          y1={gauge.y}
          x2={gauge.x + 4}
          y2={gauge.y - 4}
          stroke={mileageLit ? glowColor : dimColor}
          strokeWidth={1.25}
          strokeLinecap="round"
        />
      </g>

      {/* ── INTERACTIVE HIT ZONES ──
           Only for the active silhouette, and only when a handler is
           supplied. The parent <g> is pointer-events-none (it's an
           always-mounted, mostly-invisible stack of 9 silhouettes), so
           each hit target explicitly opts back in via pointerEvents:"auto".
           Rendered in shell -> hood -> wheels -> gauge order so the more
           specific (smaller) zones paint on top and win the hit-test over
           the general body outline beneath them. fill="transparent" (not
           "none") is deliberate — an SVG shape with fill:none has no
           clickable interior, only its stroke does. */}
      {isActive && onZoneClick && (
        <>
          <path
            d={outline}
            fill="transparent"
            stroke="none"
            style={{ pointerEvents: "auto", cursor: "pointer" }}
            onClick={(e) => {
              e.stopPropagation();
              onZoneClick("shell");
            }}
          />
          <rect
            x={hood.x}
            y={hood.y}
            width={hood.w}
            height={hood.h}
            fill="transparent"
            style={{ pointerEvents: "auto", cursor: "pointer" }}
            onClick={(e) => {
              e.stopPropagation();
              onZoneClick("hood");
            }}
          />
          {[wheel.frontCx, wheel.rearCx].map((cx) => (
            <circle
              key={cx}
              cx={cx}
              cy={wheel.cy}
              r={wheel.r}
              fill="transparent"
              style={{ pointerEvents: "auto", cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation();
                onZoneClick("wheels");
              }}
            />
          ))}
          <circle
            cx={gauge.x}
            cy={gauge.y}
            r={12}
            fill="transparent"
            style={{ pointerEvents: "auto", cursor: "pointer" }}
            onClick={(e) => {
              e.stopPropagation();
              onZoneClick("gauge");
            }}
          />
        </>
      )}
    </g>
  );
}
