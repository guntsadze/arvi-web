import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Every /profile/${username}-style link in the app assumed username was
 * always present — it wasn't, for phone signups predating the backend
 * fallback-username fix (and, defensively, in case a stale/partial user
 * object is ever rendered mid-load). Falls back to the /profile redirect
 * route, which resolves the current session server-side, rather than
 * producing a literal "/profile/null" URL.
 */
export function getProfileHref(username: string | null | undefined): string {
  return username ? `/profile/${username}` : "/profile";
}

export function getSettingsHref(
  username: string | null | undefined,
  tab: "profile" | "account",
): string {
  return username ? `/settings/${username}/${tab}` : "/profile";
}

export function buildCommentTree(flatComments: any[]) {
  const map = new Map();
  const roots: any[] = [];

  // 1. შევქმნათ Map სწრაფი წვდომისთვის
  flatComments.forEach((comment) => {
    map.set(comment.id, { ...comment, replies: [] });
  });

  // 2. დავაკავშიროთ შვილები მშობლებთან
  flatComments.forEach((comment) => {
    if (comment.parentId && map.has(comment.parentId)) {
      map.get(comment.parentId).replies.push(map.get(comment.id));
    } else if (!comment.parentId) {
      roots.push(map.get(comment.id));
    }
  });

  return roots;
}
