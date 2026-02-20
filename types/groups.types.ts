export enum GroupPrivacy {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
  SECRET = "SECRET",
}

export enum GroupMemberRole {
  OWNER = "OWNER",
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
  MEMBER = "MEMBER",
}

export interface Group {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  description?: string;
  avatar?: string;
  coverPhoto?: string;
  privacy: GroupPrivacy;
  rules?: string;
  membersCount: number;
  postsCount: number;
  createdAt: Date;
  updatedAt: Date;
  isMember?: boolean;
  // Relations
  isJoined?: boolean; // UI-სთვის დამხმარე ველი
  myRole?: GroupMemberRole;
}

export interface Marketplace {}

export interface GroupPost {
  id: string;
  groupId: string;
  userId: string;
  content: string;
  images: string[];
  likesCount: number;
  commentsCount: number;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    name: string;
    image: string;
  };
}

export interface CreateGroupInput {
  name: string;
  slug: string;
  description?: string;
  privacy: GroupPrivacy;
}

export interface MarketplaceInput {}
