import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Adds the surface-1-hover transition — for cards that act as links/buttons. */
  hoverable?: boolean;
}

/**
 * Shared structural shell (surface-1 background, border, rounded-lg) —
 * every *Card.tsx in the app (CarCard, PostCard, GroupCard, etc.) hand-rolls
 * this exact combination today; this is the one place it should live.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ hoverable = false, className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border border-border bg-surface-1",
        hoverable && "transition-colors hover:bg-surface-1-hover",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);

Card.displayName = "Card";
