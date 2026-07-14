import { redirect } from "next/navigation";
import { serverGet } from "@/lib/server-client";

interface MeResponse {
  user: {
    username: string | null;
  };
}

/**
 * /profile with no username — resolves the authenticated session
 * server-side and forwards to /profile/{username}. Exists so links,
 * bookmarks, and "view my profile" actions never need to already know
 * the current user's username client-side. /profile itself is in
 * PUBLIC_ROUTES (proxy.ts won't gate it at the edge), so the
 * unauthenticated case is handled here instead.
 */
export default async function MyProfileRedirectPage() {
  let username: string | null;

  try {
    const { user } = await serverGet<MeResponse>("/auth/me");
    username = user.username;
  } catch {
    redirect("/login?redirect=/profile");
  }

  redirect(username ? `/profile/${username}` : "/feed");
}
