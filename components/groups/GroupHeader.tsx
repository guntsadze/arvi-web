"use client";

import { ShieldCheck, Settings, Check, LogOut } from "lucide-react";
import { GroupAvatarItem } from "../ui/GroupAvatarItem";
import { GroupCoverItem } from "../ui/GroupCoverItem";
import { useGroupMembership } from "@/hooks/useGroupMembership";
import { Group } from "@/types/groups.types";
import { GroupMembershipButton } from "./GroupMembershipButton";

export const GroupHeader = ({
  group,
  isOwner,
}: {
  group: Group;
  isOwner: boolean;
}) => {
  return (
    <div className="relative border-b border-border bg-surface-1/50 backdrop-blur-md overflow-hidden">
      <GroupCoverItem group={group} isOwner={isOwner} />
      <div className="max-w-6xl mx-auto px-4 relative">
        <div className="flex flex-col md:flex-row items-end gap-6 -mt-16 pb-8">
          <GroupAvatarItem group={group} size="lg" isOwner={isOwner} />

          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold font-mono uppercase tracking-tighter text-text-primary">
                {group.name}
              </h1>
              <ShieldCheck size={20} className="text-accent opacity-50" />
            </div>
            <p className="font-mono text-[10px] text-text-secondary uppercase tracking-widest">
              Uptime: {new Date(group.createdAt).toLocaleDateString()} // Nodes:{" "}
              {group._count.members}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pb-2">
            {!isOwner && (
              <GroupMembershipButton
                groupId={group.id}
                initialIsMember={group.isMember}
              />
            )}

            <button className="bg-surface-1 border border-border p-2 hover:border-border transition-all">
              <Settings size={18} className="text-text-secondary" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
