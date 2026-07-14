import type { ReactNode } from "react";
import Link from "next/link";
import { Settings as SettingsIcon, UserRound } from "lucide-react";
import { usersServerService } from "@/services/user.server.service";
import { ProfileCompletenessWidget } from "@/components/profile/ProfileCompletenessWidget";
import { getSettingsHref } from "@/lib/utils";

/**
 * Fetches the authenticated caller's own profile (not the [username] URL
 * segment — see usersServerService.getMyProfile) purely to build the nav
 * links below off the real username. Next.js's fetch request memoization
 * dedupes this against the identical call each settings page.tsx already
 * makes for its own content, so this doesn't add an extra round trip.
 */
export default async function SettingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await usersServerService.getMyProfile();

  const navItems = [
    {
      href: getSettingsHref(user.username, "profile"),
      label: "პროფილის ინფორმაცია",
      icon: UserRound,
    },
    {
      href: getSettingsHref(user.username, "account"),
      label: "ანგარიშის დეტალები",
      icon: SettingsIcon,
    },
  ];

  return (
    <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 px-4 py-8 lg:grid-cols-[1fr_260px] lg:items-start">
      <div className="min-w-0">{children}</div>

      <aside className="space-y-4 lg:sticky lg:top-6">
        <nav className="glass-card divide-y divide-border overflow-hidden">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 px-4 py-3 text-sm text-text-secondary transition-colors hover:bg-surface-1-hover hover:text-text-primary"
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </nav>

        <ProfileCompletenessWidget variant="compact" />
      </aside>
    </div>
  );
}
