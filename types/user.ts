export type User = {
  id: string;
  username: string | null;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string | null;
  coverPhoto?: string | null;
  role: "USER" | "ADMIN";
  isVerified: boolean;
  followersCount: number;
  postsCount: number;
  location?: string | null;
  isFollowing?: boolean;
};
