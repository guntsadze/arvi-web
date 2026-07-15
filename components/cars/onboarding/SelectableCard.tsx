import { ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectableCardProps {
  selected: boolean;
  onClick: () => void;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  disabled?: boolean;
  size?: "md" | "sm";
  className?: string;
}

/**
 * Premium, game-menu-style selectable tile shared by every "pick one of
 * these" moment in the onboarding wizard (brand, transmission, fuel type,
 * drive type, character tag). Selected state gets a primary-color glow +
 * scale-up so choosing something feels satisfying, per the onboarding brief.
 */
export function SelectableCard({
  selected,
  onClick,
  title,
  subtitle,
  icon,
  disabled,
  size = "md",
  className,
}: SelectableCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={cn(
        "group relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 bg-surface-1 text-center transition-all duration-200 ease-out",
        size === "md" ? "px-4 py-5" : "px-3 py-3",
        !disabled && "hover:-translate-y-0.5 hover:border-primary/50",
        selected
          ? "border-primary scale-[1.03] bg-primary/5 shadow-[0_0_24px_-6px_hsl(var(--primary)/0.65)]"
          : "border-border",
        disabled && "cursor-not-allowed opacity-40 hover:translate-y-0",
        className,
      )}
    >
      {selected && (
        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
          <Check size={12} strokeWidth={3} />
        </span>
      )}
      {icon && (
        <span
          className={cn(
            "transition-colors",
            selected
              ? "text-primary"
              : "text-text-secondary group-hover:text-text-primary",
          )}
        >
          {icon}
        </span>
      )}
      <span
        className={cn(
          "font-semibold",
          size === "md" ? "text-sm" : "text-xs",
          selected ? "text-text-primary" : "text-text-secondary",
        )}
      >
        {title}
      </span>
      {subtitle && (
        <span className="text-[11px] leading-tight text-text-muted">
          {subtitle}
        </span>
      )}
    </button>
  );
}
