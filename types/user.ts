export interface ProfileCompletenessMissingItem {
  label: string;
  points: number;
  actionHref: string;
}

/**
 * Only present on the GET /Users/profile response (usersService.getMyProfile
 * / usersServerService.getMyProfile) — every other user-fetching endpoint
 * (getByUsername, findAll, ...) omits it, since it's derived server-side
 * from the authenticated caller only.
 */
export interface ProfileCompleteness {
  percentage: number;
  missing: ProfileCompletenessMissingItem[];
}

export type GarageDoorType = "ROLLER_SHUTTER" | "BARN_DOORS" | "SLIDING_DOOR";
export type GarageMaterial =
  | "INDUSTRIAL_STEEL"
  | "DARK_WOOD"
  | "RAW_CONCRETE"
  | "CUSTOM";

/** Garage shell only — no nested cars. Matches UserResponseDto's flattened
 * `_count.cars` -> `carCount`, present on getByUsername/getProfile. */
export interface GarageSummary {
  id: string;
  name: string;
  doorType: GarageDoorType;
  material: GarageMaterial;
  color: string | null;
  carCount: number;
}

export type User = {
  id: string;
  username: string | null;
  email: string;
  phone?: string | null;
  firstName: string;
  lastName: string;
  bio?: string | null;
  headline?: string | null;
  website?: string | null;
  avatar?: string | null;
  cover?: string | null;
  role: "USER" | "ADMIN";
  isVerified: boolean;
  emailVerified?: boolean;
  followersCount: number;
  followingCount?: number;
  postsCount: number;
  location?: string | null;
  isFollowing?: boolean;
  completeness?: ProfileCompleteness;
  garages?: GarageSummary[];
};
