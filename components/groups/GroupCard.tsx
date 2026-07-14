"use client";

import React from "react";
import Link from "next/link";
import { Users, Globe, Lock, ArrowUpRight, Loader2, Plus } from "lucide-react";
import { Group } from "@/types/groups.types";
import { GroupAvatarItem } from "../ui/GroupAvatarItem";
import { useGroupMembership } from "@/hooks/useGroupMembership";
import { GroupMembershipButton } from "./GroupMembershipButton";
import { Card } from "../ui/Card";

export const GroupCard = ({ group }: { group: Group }) => {
  const initialIsMemberStatus = group.members.length > 0;
  const { isMember, isLoading, toggleMembership } = useGroupMembership(
    group.id,
    initialIsMemberStatus,
  );

  const handleAction = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleMembership();
  };

  return (
    <Card className="group relative p-5 shadow-2xl transition-all duration-500 overflow-hidden">
      {/* Visual Accents */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent opacity-30" />
      <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-accent transition-all duration-500" />

      <Link href={`/groups/${group.slug}`} className="block space-y-5">
        {/* Header Area */}
        <div className="flex justify-between items-start">
          <div className="relative">
            <GroupAvatarItem group={group} size="sm" />
            <div className="absolute -bottom-1 -right-1 w-14 h-14 border border-border/50 -z-0" />
          </div>

          <div className="text-right space-y-1">
            <div className="flex items-center justify-end gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-text-secondary">
              {group.privacy === "PUBLIC" ? (
                <Globe size={10} className="text-success" />
              ) : (
                <Lock size={10} className="text-accent" />
              )}
              {group.privacy}
            </div>
            <div className="text-[8px] font-mono text-text-secondary uppercase tracking-widest">
              Sector_ID: {group.id.slice(-6)}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="space-y-2">
          <h3 className="text-text-primary font-mono text-sm uppercase tracking-widest group-hover:text-accent transition-colors flex items-center gap-2">
            {group.name}
            <ArrowUpRight
              size={12}
              className="opacity-0 group-hover:opacity-100 transition-all text-text-primary"
            />
          </h3>
        </div>

        {/* Technical Stats */}
        <div className="grid grid-cols-2 gap-4 py-3 border-y border-border/50">
          <div className="flex flex-col">
            <span className="text-[8px] font-mono text-text-muted uppercase">
              Active_Members
            </span>
            <span className="text-text-secondary font-mono text-xs">
              {group.membersCount ?? "—"}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] font-mono text-text-muted uppercase">
              Data_Entries
            </span>
            <span className="text-text-secondary font-mono text-xs">
              {group.postsCount ?? "—"}
            </span>
          </div>
        </div>
      </Link>

      {/* Action Area */}
      <div className="mt-5">
        <GroupMembershipButton
          groupId={group.id}
          initialIsMember={initialIsMemberStatus}
        />
      </div>

      {/* Aesthetic terminal bit */}
      <div className="absolute bottom-1 right-2 opacity-10 pointer-events-none">
        <span className="font-mono text-[6px] text-text-secondary uppercase">
          v1.0.4_comm
        </span>
      </div>
    </Card>
  );
};
