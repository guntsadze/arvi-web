"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, X } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import {
  selectCurrentUser,
  selectIsAuthenticated,
} from "@/store/slices/userSlice";
import { usersService } from "@/services/user/user.service";
import type { ProfileCompleteness } from "@/types/user";
import { cn } from "@/lib/utils";

// Two separate mechanisms, deliberately not one: reaching 100% is a
// permanent fact about the profile and belongs in localStorage; clicking
// "X" is just "not now," not "never" — gamification only works if the
// nudge comes back. sessionStorage clears itself on tab close/refresh,
// which is exactly the "current session only" behavior wanted here.
const COMPLETED_KEY_PREFIX = "arvi:profile-completeness-completed:";
const SESSION_DISMISS_KEY_PREFIX = "arvi:profile-completeness-session-dismissed:";

interface ProfileCompletenessWidgetProps {
  /** "default" is the full-width feed placement; "compact" is sized for the settings sidebar. */
  variant?: "default" | "compact";
  className?: string;
}

/**
 * Self-fetching, like EmptyGarageCard: reads auth state from redux and
 * fetches its own data rather than taking it as a prop, so it can be
 * dropped into any authenticated page (feed, settings sidebar) without
 * plumbing. Only GET /Users/profile (usersService.getMyProfile) returns
 * `completeness` — /auth/me (what redux's currentUser is hydrated from)
 * does not, so this can't be read off the store directly.
 *
 * Clicking "X" only hides the widget for the current session
 * (sessionStorage) — it's meant to keep nudging an incomplete profile, so a
 * manual dismiss must not be permanent or the gamification stops working.
 * The only permanent hide is actually reaching 100% (localStorage), which
 * also means the widget never lingers showing a "you're done" state — it
 * just stops appearing, on this load and every one after.
 */
export function ProfileCompletenessWidget({
  variant = "default",
  className,
}: ProfileCompletenessWidgetProps) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const currentUser = useAppSelector(selectCurrentUser);
  const userId = currentUser?.id;

  const [completeness, setCompleteness] = useState<ProfileCompleteness | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !userId) {
      setLoading(false);
      return;
    }

    const completedKey = `${COMPLETED_KEY_PREFIX}${userId}`;
    const sessionDismissKey = `${SESSION_DISMISS_KEY_PREFIX}${userId}`;

    if (typeof window !== "undefined") {
      // Permanent hide (100% reached previously) wins outright — no need
      // to even fetch.
      if (window.localStorage.getItem(completedKey) === "true") {
        setDismissed(true);
        setLoading(false);
        return;
      }

      // Session-only hide: cleared automatically on refresh/new tab, so
      // this only suppresses the banner for the tab it was dismissed in.
      if (window.sessionStorage.getItem(sessionDismissKey) === "true") {
        setDismissed(true);
        setLoading(false);
        return;
      }
    }

    let cancelled = false;
    setLoading(true);

    usersService
      .getMyProfile()
      .then((profile) => {
        if (cancelled) return;
        const nextCompleteness = profile.completeness ?? null;
        setCompleteness(nextCompleteness);
        if (
          nextCompleteness &&
          nextCompleteness.percentage >= 100 &&
          typeof window !== "undefined"
        ) {
          window.localStorage.setItem(completedKey, "true");
        }
      })
      .catch(() => {
        if (!cancelled) setCompleteness(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, userId]);

  const dismiss = () => {
    setDismissed(true);
    if (userId && typeof window !== "undefined") {
      // Session-only — deliberately not localStorage. Permanent hiding is
      // reserved for actually reaching 100% (see the effect above).
      window.sessionStorage.setItem(
        `${SESSION_DISMISS_KEY_PREFIX}${userId}`,
        "true",
      );
    }
  };

  if (
    !isAuthenticated ||
    loading ||
    dismissed ||
    !completeness ||
    completeness.percentage >= 100
  ) {
    return null;
  }

  const isCompact = variant === "compact";
  const clampedPercentage = Math.min(100, Math.max(0, completeness.percentage));
  const visibleMissing = isCompact
    ? completeness.missing.slice(0, 3)
    : completeness.missing;
  const hiddenCount = completeness.missing.length - visibleMissing.length;

  return (
    <div
      className={cn(
        "glass-card relative overflow-hidden",
        isCompact ? "p-4" : "p-5 mb-8",
        className,
      )}
    >
      <button
        type="button"
        onClick={dismiss}
        aria-label="დახურვა"
        className="absolute right-3 top-3 text-text-muted transition-colors hover:text-text-primary"
      >
        <X size={14} />
      </button>

      <div className="flex items-center gap-2 pr-6">
        <Sparkles
          size={isCompact ? 14 : 16}
          className="shrink-0 text-primary"
        />
        <p
          className={cn(
            "font-semibold text-text-primary",
            isCompact ? "text-xs" : "text-sm",
          )}
        >
          პროფილი შევსებულია {clampedPercentage}%-ით
        </p>
      </div>

      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface-2">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary/60 via-primary to-primary/90 shadow-[0_0_10px_-1px_rgba(20,168,0,0.6)] transition-[width] duration-500 ease-out"
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>

      <ul className={cn("mt-3 space-y-1.5", isCompact && "text-[11px]")}>
        {visibleMissing.map((item) => (
          <li key={item.actionHref + item.label}>
            <Link
              href={item.actionHref}
              className="group flex items-center justify-between gap-3 text-xs text-text-secondary transition-colors hover:text-primary"
            >
              <span className="truncate">• {item.label}</span>
              <span className="shrink-0 font-mono text-[10px] text-primary opacity-80 group-hover:opacity-100">
                +{item.points}%
              </span>
            </Link>
          </li>
        ))}
        {isCompact && hiddenCount > 0 && (
          <li className="text-[10px] text-text-muted">+{hiddenCount} სხვა</li>
        )}
      </ul>
    </div>
  );
}
