import { serverGet } from "@/lib/server-client";

export const usersServerService = {
  getByUsername(username: string) {
    return serverGet(`/Users/by-username/${username}`);
  },
};
