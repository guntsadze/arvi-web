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
          ? "bg-green-900/10 border-green-900/30 text-green-500 hover:bg-red-900/20 hover:border-red-900/50 hover:text-red-500"
          : "bg-amber-700/10 border-amber-900/30 text-amber-600 hover:bg-amber-700/20"
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
