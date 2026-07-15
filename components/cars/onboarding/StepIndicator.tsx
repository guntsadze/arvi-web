import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
  /** When provided, segments become clickable — used for editing an existing car, where walking forward sequentially through already-filled steps is pure friction. Omitted during first-time creation, which keeps the linear, ritual pacing. */
  onStepClick?: (index: number) => void;
}

/**
 * Segmented progress bar for the 4-step onboarding wizard — always visible
 * so the user knows exactly where they are and how much is left, per the
 * "fast, low-friction progress" requirement in the onboarding brief.
 */
export function StepIndicator({
  currentStep,
  totalSteps,
  labels,
  onStepClick,
}: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isDone = index < currentStep;
        const isActive = index === currentStep;
        const Segment = onStepClick ? "button" : "div";

        return (
          <Segment
            key={index}
            type={onStepClick ? "button" : undefined}
            onClick={onStepClick ? () => onStepClick(index) : undefined}
            className={cn(
              "flex flex-1 flex-col gap-1.5",
              onStepClick && "cursor-pointer text-left",
            )}
          >
            <div
              className={cn(
                "h-1.5 w-full rounded-full transition-all duration-500",
                isDone && "bg-primary",
                isActive &&
                  "bg-primary shadow-[0_0_12px_-1px_hsl(var(--primary)/0.7)]",
                !isDone && !isActive && "bg-border",
              )}
            />
            <span
              className={cn(
                "truncate text-[10px] font-medium tracking-wider uppercase",
                isActive || isDone ? "text-primary" : "text-text-muted",
              )}
            >
              {labels[index]}
            </span>
          </Segment>
        );
      })}
    </div>
  );
}
