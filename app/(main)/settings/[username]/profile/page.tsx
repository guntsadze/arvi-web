import { notFound } from "next/navigation";
import { usersServerService } from "@/services/user.server.service";
import ProfileSettingsPage from "../SettingsPage";

// The [username] segment is kept only as a routing convention — the data
// always comes from usersServerService.getMyProfile(), which the backend
// resolves from the authenticated session, never from this URL param. See
// usersServerService.getMyProfile for why (privacy fix: this page used to
// load whichever username was in the URL).
export default async function Page() {
  const user = await usersServerService.getMyProfile();

  if (!user) notFound();

  return <ProfileSettingsPage user={user} />;
}
