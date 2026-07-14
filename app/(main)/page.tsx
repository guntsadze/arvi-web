import { redirect } from "next/navigation";

/**
 * / and /feed used to be two separate implementations (this file had dead,
 * commented-out hero-section code from an earlier iteration). feed/page.tsx
 * is the real, current feed implementation, so / just redirects there —
 * same pattern as app/(auth)/register/page.tsx redirecting to /login.
 */
export default function RootPage() {
  redirect("/feed");
}
