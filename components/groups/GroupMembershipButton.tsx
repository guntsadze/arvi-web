"use client";

import { Check, LogOut } from "lucide-react";
import { useGroupMembership } from "@/hooks/useGroupMembership";
interface GroupMembershipButtonProps {
  groupId: string;
  initialIsMember?: boolean;
}

export const GroupMembershipButton = ({
  groupId,
  initialIsMember,
}: GroupMembershipButtonProps) => {
  const { isMember, isLoading, toggleMembership } = useGroupMembership(
    groupId,
    initialIsMember,
  );

  return (
    <button
      onClick={toggleMembership}
      disabled={isLoading}
      className={`px-6 py-2 font-mono text-[10px] uppercase tracking-widest transition-all border flex items-center gap-2 group/btn ${
        isMember
          ? "bg-success/10/10 border-success/30 text-success hover:bg-error/10/20 hover:border-error/50 hover:text-error"
          : "bg-accent/10 border-accent/30 text-accent hover:bg-primary-hover/20"
      } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`} // isLoading სტილი
    >
      {isLoading ? (
        "PROCESSING..."
      ) : isMember ? (
        <>
          <Check size={12} className="group-hover/btn:hidden" />
          <LogOut size={12} className="hidden group-hover/btn:block" />
          <span className="group-hover/btn:hidden">Member_Active</span>
          <span className="hidden group-hover/btn:block">Leave_Sector</span>
        </>
      ) : (
        "Join_Sequence"
      )}
    </button>
  );
};
