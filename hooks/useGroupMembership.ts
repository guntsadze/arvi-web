"use client";

import { useState, useCallback } from "react";
import { groupsService } from "@/services/groups.service";

type MembershipAction = "join" | "leave";

interface UseGroupMembershipReturn {
  isMember: boolean;
  isLoading: boolean;
  error: string | null;
  performMembershipAction: (action: MembershipAction) => Promise<boolean>;
  toggleMembership: () => Promise<boolean>;
}

export function useGroupMembership(
  groupId: string,
  initialIsMember: boolean = false,
): UseGroupMembershipReturn {
  const [isMember, setIsMember] = useState<boolean>(initialIsMember);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const performMembershipAction = useCallback(
    async (action: MembershipAction): Promise<boolean> => {
      if (isLoading) return false;

      setIsLoading(true);
      setError(null);

      try {
        let success = false;

        if (action === "join") {
          const response = await groupsService.joinGroup(groupId);
          success = !!response?.joined;
          if (success) setIsMember(true);
        } else if (action === "leave") {
          const confirmed = window.confirm("ნამდვილად გსურთ ჯგუფის დატოვება?");
          if (!confirmed) return false;

          const response = await groupsService.leaveGroup(groupId);
          success = !!response?.left;
          if (success) setIsMember(false);
        }

        return success;
      } catch (err) {
        console.error(`Error during ${action}:`, err);
        setError(
          action === "join"
            ? "ჯგუფში გაწევრიანება ვერ მოხერხდა"
            : "ჯგუფიდან გამოსვლა ვერ მოხერხდა",
        );
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [groupId, isLoading],
  );

  const toggleMembership = useCallback(async () => {
    return isMember
      ? performMembershipAction("leave")
      : performMembershipAction("join");
  }, [isMember, performMembershipAction]);

  return {
    isMember,
    isLoading,
    error,
    performMembershipAction,
    toggleMembership,
  };
}
