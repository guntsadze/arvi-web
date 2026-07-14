import { serverGet } from "@/lib/server-client";
import { User } from "@/types/user";

export const usersServerService = {
  getByUsername(username: string) {
    return serverGet(`/Users/by-username/${username}`);
  },

  /**
   * Always returns the authenticated caller's own profile — the backend
   * derives the user from the auth cookie server-side, not any URL param.
   * Pages that must only ever show the logged-in user's own data (the
   * account/profile settings screens) use this instead of getByUsername:
   * previously those pages read `getByUsername(usernameFromUrl)`, which let
   * anyone view another user's email/phone by visiting
   * /settings/{their-username}/account. The [username] segment in those
   * routes is now purely a routing convention, not a data source.
   */
  getMyProfile() {
    return serverGet<User>("/Users/profile");
  },
};
