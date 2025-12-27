import { useState } from "react";
import { socialService } from "@/services/social/social.service";
import { User } from "@/types/user";

type UpdateUsers = React.Dispatch<React.SetStateAction<User[]>>;

export function useToggleFollow(users: User[], setUsers: UpdateUsers) {
  const [isLoading, setIsLoading] = useState(false);

  const toggleFollow = async (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user || isLoading) return;

    const wasFollowing = user.isFollowing || false;
    const prevCount = user.followersCount;

    // Optimistic update
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              isFollowing: !wasFollowing,
              followersCount: wasFollowing ? prevCount - 1 : prevCount + 1,
            }
          : u
      )
    );

    setIsLoading(true);

    try {
      await socialService.toggleFollow(userId);
    } catch (error) {
      console.error("Follow toggle failed:", error);
      // Rollback
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? {
                ...u,
                isFollowing: wasFollowing,
                followersCount: prevCount,
              }
            : u
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { toggleFollow, isLoading };
}
