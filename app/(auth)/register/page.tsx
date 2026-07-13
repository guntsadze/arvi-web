import { redirect } from "next/navigation";

/**
 * There's no separate registration anymore — Google and Phone+OTP both serve
 * first-time and returning users identically via /login. This route only
 * exists to catch stale links.
 */
export default function RegisterPage() {
  redirect("/login");
}
