export type Follower = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar: { url: string } | null;
  bio: string | null;
  isFollowing: boolean;
  followersCount: number;
};
