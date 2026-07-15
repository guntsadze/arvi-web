"use client";

import { useEffect, useMemo, useState } from "react";
import { useWatch } from "react-hook-form";
import {
  AlertTriangle,
  Camera,
  Car,
  ChevronLeft,
  ChevronRight,
  Cog,
  Fingerprint,
  Trophy,
  X,
} from "lucide-react";

import { useCarForm } from "@/hooks/useCarForm";
import { apiClient } from "@/lib/api";
import {
  MODIFICATIONS_TYPES,
  MAINTENANCE_TYPES,
} from "@/constants/carOptions";
import { StepIndicator } from "@/components/cars/onboarding/StepIndicator";
import {
  CarBlueprint,
  DriveWheels,
  BlueprintZone,
} from "@/components/cars/onboarding/CarBlueprint";
import {
  ZoneRecordsPanel,
  ZoneSection,
} from "@/components/cars/onboarding/ZoneRecordsPanel";
import { HeritageStep } from "@/components/cars/onboarding/steps/HeritageStep";
import { DrivetrainStep } from "@/components/cars/onboarding/steps/DrivetrainStep";
import { SpecsStep } from "@/components/cars/onboarding/steps/SpecsStep";
import { ShowOffStep } from "@/components/cars/onboarding/steps/ShowOffStep";

export interface GarageInductionWizardProps {
  /** "onboarding" = the true first-car ritual (full page, skip link, no close button). "modal" = a proper overlay usable anywhere (create OR edit), with a real close button. */
  variant: "onboarding" | "modal";
  initialData?: any;
  garageId?: string;
  onClose: () => void;
  onSuccess: () => void;
}

// Character tag -> the glow color CarBlueprint tints every "lit" stroke
// Raw rgb values, deliberately not var(--color-*) chains: CarBlueprint feeds
// this straight into SVG stroke/fill presentation attributes, and CSS
// custom-property strings rendered invisibly there in production (the app's
// other proven pattern is stroke="currentColor" plus a Tailwind text-* class,
// which isn't an option for a color chosen dynamically at runtime). Values
// are the resolved colors of app/globals.css's --primary/--color-error/
// --color-warning/--color-gold tokens — update both places if those change.
const CHARACTER_GLOW: Record<string, string> = {
  DAILY_DRIVER: "rgb(22, 168, 0)", // --primary: 112 100% 33%
  TRACK_BEAST: "rgb(248, 113, 113)", // --color-error: #f87171
  GARAGE_QUEEN: "rgb(212, 168, 67)", // --color-gold: rgb(var(--gold-rgb))
  PROJECT_CAR: "rgb(245, 158, 11)", // --color-warning: #f59e0b
};
const DEFAULT_GLOW = "rgb(22, 168, 0)"; // STOCK / unset — same as --primary

function toDriveWheels(value: string | undefined): DriveWheels {
  return value === "FWD" || value === "RWD" || value === "AWD" || value === "FOURWD"
    ? value
    : null;
}

// Which blueprint zone owns which modification/maintenance categories.
// Hood covers both — clicking it should surface engine mods AND
// engine-related service history in one place, per the brief.
const ZONE_SECTIONS: Record<BlueprintZone, { label: string; sections: ZoneSection[] }> = {
  hood: {
    label: "ძრავი და კაპოტი",
    sections: [
      {
        kind: "modification",
        label: "მოდიფიკაციები",
        typeOptions: MODIFICATIONS_TYPES.filter((t) => t.value === "ENGINE"),
      },
      {
        kind: "maintenance",
        label: "სერვისი",
        typeOptions: MAINTENANCE_TYPES.filter((t) =>
          ["ENGINE_SERVICE", "OIL_CHANGE", "TRANSMISSION_SERVICE"].includes(t.value),
        ),
      },
    ],
  },
  wheels: {
    label: "საბურავები და სავალი ნაწილი",
    sections: [
      {
        kind: "modification",
        label: "მოდიფიკაციები",
        typeOptions: MODIFICATIONS_TYPES.filter((t) =>
          ["SUSPENSION", "WHEELS", "BRAKES", "TIRES"].includes(t.value),
        ),
      },
    ],
  },
  shell: {
    label: "ექსტერიერი",
    sections: [
      {
        kind: "modification",
        label: "მოდიფიკაციები",
        typeOptions: MODIFICATIONS_TYPES.filter((t) =>
          ["EXTERIOR", "COSMETIC"].includes(t.value),
        ),
      },
    ],
  },
  gauge: {
    label: "სერვისის ისტორია",
    sections: [
      {
        kind: "maintenance",
        label: "ჩანაწერები",
        typeOptions: MAINTENANCE_TYPES,
      },
    ],
  },
};

// Which onboarding step owns which backend DTO field, for mapping a 400's
// validation messages back onto a step. class-validator's default message
// format is "<fieldName> must be ...", so matching is done against the
// lowercased first word of each message.
const STEP_FIELD_GROUPS: Array<{ step: number; fields: string[] }> = [
  { step: 0, fields: ["year", "bodytype", "make", "model"] },
  { step: 1, fields: ["fueltype", "transmission", "drivetype", "horsepower", "torque", "engine"] },
  { step: 2, fields: ["mileage", "charactertag", "paintcode", "vin", "licenseplate"] },
  { step: 3, fields: ["photos", "description", "ispublic"] },
];

interface ClassifiedIssue {
  step: number;
  field: string;
  message: string;
}

function classifyValidationMessage(message: string): ClassifiedIssue | null {
  if (message.includes("წელი")) {
    return { step: 0, field: "year", message };
  }
  if (message.includes("სანომრე ნიშანი") || message.includes("ფორმატში")) {
    return { step: 2, field: "licensePlate", message };
  }

  const firstWord = message.match(/^([A-Za-z]+)/)?.[1]?.toLowerCase();
  if (!firstWord) return null;

  const group = STEP_FIELD_GROUPS.find((g) => g.fields.includes(firstWord));
  return group ? { step: group.step, field: firstWord, message } : null;
}

interface FormattedApiError {
  data?: { message?: unknown };
  config?: { url?: string; method?: string };
}

// apiClient.onResponseError is registered (on mount, below) after
// lib/api.ts's own constructor interceptor, and axios runs response
// interceptors in *registration* order — so by the time this observer sees
// a rejection, it's already the reformatted `{ message, data, status,
// config }` shape lib/api.ts produces, never a raw AxiosError. Scoped to
// this wizard's own POST or PUT to /cars (create AND edit both go through
// this component now), not "any failed request while this happens to be
// mounted."
function isCarsWriteRequest(config: FormattedApiError["config"]): boolean {
  const method = config?.method?.toLowerCase();
  return (method === "post" || method === "put") && Boolean(config?.url?.includes("/cars"));
}

function extractValidationMessages(error: unknown): string[] | null {
  if (typeof error !== "object" || error === null) return null;
  const { data, config } = error as FormattedApiError;
  if (!isCarsWriteRequest(config)) return null;
  return Array.isArray(data?.message) ? (data.message as string[]) : null;
}

const STEPS = [
  {
    title: "მემკვიდრეობა",
    subtitle: "ვისთან გვაქვს საქმე? აირჩიე მარკა, მოდელი და წელი.",
    icon: Car,
    shortLabel: "მემკვიდრეობა",
  },
  {
    title: "გული და გადაცემები",
    subtitle: "რა სუნთქავს კაპოტის ქვეშ?",
    icon: Cog,
    shortLabel: "გული",
  },
  {
    title: "სპეციფიკა და სული",
    subtitle: "გარბენი და ხასიათი — რითი გამოირჩევა შენი მანქანა.",
    icon: Fingerprint,
    shortLabel: "სული",
  },
  {
    title: "აჩვენე თავი",
    subtitle: "ერთი კარგი კადრი სჯობს ათას სიტყვას.",
    icon: Camera,
    shortLabel: "ჩვენება",
  },
] as const;

const LAST_STEP = STEPS.length - 1;

/**
 * The single create/edit surface for cars — a 4-step wizard built to feel
 * like a premium automotive-app ritual rather than a plain form, with a
 * live CarBlueprint centerpiece. Used both for the true first-car
 * onboarding ritual (variant="onboarding", wrapped by
 * app/(onboarding)/onboarding/garage/page.tsx) and as a general create/edit
 * modal from anywhere else in the app (variant="modal", e.g.
 * UserProfileContent.tsx's "add a car" / "edit car" flows) — this replaces
 * CarForm.tsx entirely, which is why fields CarForm used to own (VIN,
 * license plate, description, public/private) now live in SpecsStep /
 * ShowOffStep rather than a separate section-based form.
 *
 * Once editing an existing car (a real carId exists via initialData.id),
 * the CarBlueprint's hood/wheels/shell/gauge zones become clickable,
 * opening ZoneRecordsPanel to add/delete modifications and maintenance
 * records scoped to that zone — pushed straight to the backend via
 * modifications.service.ts/maintenance.service.ts, independent of this
 * form's own save cycle. Not available during creation: there's no carId
 * to attach records to until the car actually exists.
 */
export function GarageInductionWizard({
  variant,
  initialData,
  garageId,
  onClose,
  onSuccess,
}: GarageInductionWizardProps) {
  const isEditing = Boolean(initialData?.id);
  const [step, setStep] = useState(0);
  const [validationIssues, setValidationIssues] = useState<ClassifiedIssue[]>([]);
  const [activeZone, setActiveZone] = useState<BlueprintZone | null>(null);
  // isLastStep alone only tells us "the submit button currently exists in
  // the DOM" — it says nothing about whether a submit event was actually
  // caused by clicking it. Any stray/implicit submit trigger that reaches
  // the form while step 3 happens to be mounted would otherwise sail
  // through. This flag is the actual intent signal: it's set true in
  // exactly one place (the submit button's onClick, below) and consumed
  // (reset to false) the instant the form's onSubmit handler runs, so it
  // can never accidentally stay "on" across a later, unrelated submit
  // attempt.
  const [userClickedSubmit, setUserClickedSubmit] = useState(false);

  const {
    register,
    control,
    setValue,
    formState: { errors, isSubmitting },
    onSubmit,
  } = useCarForm({
    initialData,
    garageId,
    onClose,
    onSuccess,
  });

  // Fresh-creation default: leave drive type genuinely unselected (rather
  // than DEFAULT_FORM_VALUES' "RWD") so the "არ ვიცი" skip tile reads as
  // the true starting point — driveType is optional backend-side. Editing
  // an existing car keeps whatever it already has.
  useEffect(() => {
    if (!isEditing) setValue("driveType", "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useCarForm's onSubmit catches submission errors internally (toast +
  // return) and never rethrows, so there's nothing to catch from out here —
  // this observes the raw rejection directly off the axios client instead,
  // scoped to this component's mount lifetime. It never suppresses the
  // error (always re-rejects), so useCarForm's own generic toast still
  // fires exactly as before; this just adds the step-jump + inline
  // messages on top.
  useEffect(() => {
    const unsubscribe = apiClient.onResponseError((error) => {
      const messages = extractValidationMessages(error);
      if (!messages) return;

      const classified = messages
        .map(classifyValidationMessage)
        .filter((issue): issue is ClassifiedIssue => issue !== null);
      if (classified.length === 0) return;

      setValidationIssues(classified);
      setStep(Math.min(...classified.map((issue) => issue.step)));
    });
    return unsubscribe;
  }, []);

  const make = useWatch({ control, name: "make" });
  const model = useWatch({ control, name: "model" });
  const year = useWatch({ control, name: "year" });
  const bodyType = useWatch({ control, name: "bodyType" });
  const driveType = useWatch({ control, name: "driveType" });
  const mileage = useWatch({ control, name: "mileage" });
  const characterTag = useWatch({ control, name: "characterTag" });

  const canLeaveHeritage = Boolean(make) && Boolean(model) && Boolean(year);
  const canGoNext = step === 0 ? canLeaveHeritage : true;

  const goNext = () => {
    if (!canGoNext) return;
    setValidationIssues([]);
    setUserClickedSubmit(false);
    setStep((s) => Math.min(s + 1, LAST_STEP));
  };
  const goBack = () => {
    setValidationIssues([]);
    setUserClickedSubmit(false);
    setStep((s) => Math.max(s - 1, 0));
  };
  const jumpToStep = (index: number) => {
    setValidationIssues([]);
    setUserClickedSubmit(false);
    setStep(index);
  };

  const current = STEPS[step];
  const StepIcon = current.icon;
  const isLastStep = step === LAST_STEP;
  const currentStepIssues = validationIssues.filter((issue) => issue.step === step);

  const handleZoneClick = (zone: BlueprintZone) => setActiveZone(zone);

  const blueprintState = useMemo(
    () => ({
      bodyType: bodyType || undefined,
      shellLit: step >= 0,
      hoodOpen: step >= 1,
      driveWheels: toDriveWheels(driveType),
      mileageLit: step >= 2 && Boolean(mileage),
      glowColor: (characterTag && CHARACTER_GLOW[characterTag]) || DEFAULT_GLOW,
      // Only once a real car exists — nothing to attach a modification or
      // service record to before that.
      onZoneClick: isEditing ? handleZoneClick : undefined,
    }),
    [bodyType, step, driveType, mileage, characterTag, isEditing],
  );

  const activeZoneConfig = activeZone ? ZONE_SECTIONS[activeZone] : null;

  const content = (
    <div className={variant === "onboarding" ? "w-full max-w-2xl py-12" : "w-full max-w-2xl"}>
      {variant === "onboarding" ? (
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
          >
            გამოტოვება / მოგვიანებით დამატება →
          </button>
        </div>
      ) : null}

      <div className="glass-card p-8 shadow-2xl shadow-black/30">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <StepIcon size={22} />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-text-primary">
                {current.title}
              </h1>
              <p className="mt-1 text-sm text-text-secondary">{current.subtitle}</p>
            </div>
          </div>

          {variant === "modal" && (
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 text-text-secondary transition-colors hover:text-text-primary"
              aria-label="დახურვა"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <div className="mb-8">
          <CarBlueprint {...blueprintState} />
        </div>

        <div className="mb-8">
          <StepIndicator
            currentStep={step}
            totalSteps={STEPS.length}
            labels={STEPS.map((s) => s.shortLabel)}
            onStepClick={isEditing ? jumpToStep : undefined}
          />
        </div>

        <form
          onSubmit={(e) => {
            // Two independent gates, not one: isLastStep alone only means
            // "the submit button happens to exist in the DOM right now" —
            // it says nothing about whether THIS submit event was actually
            // caused by clicking it. userClickedSubmit is the real intent
            // signal, set only by that button's own onClick. Requiring
            // both means a stray/implicit submit trigger (Enter in a text
            // field, a future button added without type="button", browser
            // quirks) is a no-op even if it happens to land while step 3
            // is mounted, instead of sending partial data and closing the
            // modal.
            if (!isLastStep || !userClickedSubmit) {
              e.preventDefault();
              setUserClickedSubmit(false);
              return;
            }
            setUserClickedSubmit(false);
            onSubmit(e);
          }}
          className="space-y-8"
        >
          {currentStepIssues.length > 0 && (
            <div className="flex items-start gap-3 rounded-lg border-2 border-error/40 bg-error/5 px-4 py-3">
              <AlertTriangle size={18} className="mt-0.5 shrink-0 text-error" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-error">
                  სერვერმა ეს ველები არ მიიღო — გაასწორე და სცადე თავიდან:
                </p>
                <ul className="space-y-0.5 text-xs text-text-secondary">
                  {currentStepIssues.map((issue, i) => (
                    <li key={i}>{issue.message}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {step === 0 && (
            <HeritageStep
              control={control}
              register={register}
              setValue={setValue}
              errors={errors}
            />
          )}
          {step === 1 && (
            <DrivetrainStep control={control} register={register} setValue={setValue} />
          )}
          {step === 2 && (
            <SpecsStep control={control} register={register} setValue={setValue} />
          )}
          {step === 3 && (
            <ShowOffStep control={control} register={register} setValue={setValue} />
          )}

          <div className="flex gap-4 border-t border-border pt-8">
            {step > 0 && (
              <button
                type="button"
                onClick={goBack}
                className="flex items-center gap-2 border-2 border-border bg-background px-6 py-4 font-bold tracking-wider text-text-secondary uppercase transition-colors hover:border-primary/40 hover:text-text-primary"
              >
                <ChevronLeft size={18} />
                უკან
              </button>
            )}

            {!isLastStep ? (
              <button
                type="button"
                onClick={goNext}
                disabled={!canGoNext}
                className="flex flex-1 items-center justify-center gap-3 bg-primary py-4 font-black tracking-[0.2em] text-primary-foreground uppercase shadow-[0_0_20px_-4px_hsl(var(--primary)/0.5)] transition-all hover:bg-primary-hover hover:shadow-[0_0_30px_-4px_hsl(var(--primary)/0.7)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
              >
                შემდეგი
                <ChevronRight size={18} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                onClick={() => setUserClickedSubmit(true)}
                className="flex flex-1 items-center justify-center gap-3 bg-primary py-4 font-black tracking-[0.2em] text-primary-foreground uppercase shadow-[0_0_20px_-4px_hsl(var(--primary)/0.5)] transition-all hover:bg-primary-hover hover:shadow-[0_0_30px_-4px_hsl(var(--primary)/0.7)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trophy size={20} />
                {isSubmitting
                  ? "შემოგორავს..."
                  : isEditing
                    ? "შენახვა"
                    : "შემოაგორე გარაჟში"}
              </button>
            )}
          </div>
        </form>
      </div>

      {isEditing && activeZone && activeZoneConfig && (
        <ZoneRecordsPanel
          isOpen
          onClose={() => setActiveZone(null)}
          carId={initialData.id}
          zoneLabel={activeZoneConfig.label}
          sections={activeZoneConfig.sections}
        />
      )}
    </div>
  );

  if (variant === "onboarding") return content;

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-background/95 backdrop-blur-sm">
      <div className="flex min-h-screen items-start justify-center px-4 py-10">
        {content}
      </div>
    </div>
  );
}
