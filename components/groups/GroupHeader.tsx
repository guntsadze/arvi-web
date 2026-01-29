"use client";

import { useState, useEffect } from "react";
import { groupsService } from "@/services/groups.service";
import { Group } from "@/types/groups.types";
import { ShieldCheck, Settings, Check, LogOut } from "lucide-react"; // LogOut დავამატე
import { GroupAvatarItem } from "../ui/GroupAvatarItem";
import { GroupCoverItem } from "../ui/GroupCoverItem";

export const GroupHeader = ({
  group,
  isOwner,
}: {
  group: Group;
  isOwner: boolean;
}) => {
  const [joined, setJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setJoined(!!group.isMember);
  }, [group.id, group.isMember]);

  // გაწევრიანება
  const handleJoinToGroup = async () => {
    setIsLoading(true);
    try {
      const response = await groupsService.joinGroup(group.id);
      if (response.joined) {
        setJoined(true);
      }
    } catch (error) {
      console.error("შეცდომა გაწევრიანებისას:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ჯგუფიდან გამოსვლა
  const handleLeaveGroup = async () => {
    if (!window.confirm("ნამდვილად გსურთ ჯგუფის დატოვება?")) return;

    setIsLoading(true);
    try {
      const response = await groupsService.leaveGroup(group.id);
      if (response.left) {
        setJoined(false);
      }
    } catch (error) {
      console.error("შეცდომა ჯგუფიდან გამოსვლისას:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative border-b border-stone-800 bg-[#201d1b]/50 backdrop-blur-md overflow-hidden">
      <GroupCoverItem group={group} isOwner={isOwner} />
      <div className="max-w-6xl mx-auto px-4 relative">
        <div className="flex flex-col md:flex-row items-end gap-6 -mt-16 pb-8">
          <GroupAvatarItem group={group} size="lg" isOwner={isOwner} />

          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold font-mono uppercase tracking-tighter text-stone-100">
                {group.name}
              </h1>
              <ShieldCheck size={20} className="text-amber-800 opacity-50" />
            </div>
            <p className="font-mono text-[10px] text-stone-500 uppercase tracking-widest">
              Uptime: {new Date(group.createdAt).toLocaleDateString()} // Nodes:{" "}
              {/* დინამიური რაოდენობა ფრონტზე ვიზუალისთვის */}
              {joined
                ? group._count.members
                : group._count.members - (group.isMember ? 0 : 0)}
              {/* შენიშვნა: ზუსტი რაოდენობისთვის უმჯობესია ბექენდმა დააბრუნოს განახლებული count */}
              {group._count.members}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pb-2">
            {!isOwner && (
              <button
                onClick={joined ? handleLeaveGroup : handleJoinToGroup}
                disabled={isLoading}
                className={`px-6 py-2 font-mono text-[10px] uppercase tracking-widest transition-all border flex items-center gap-2 group/btn ${
                  joined
                    ? "bg-green-900/10 border-green-900/30 text-green-500 hover:bg-red-900/20 hover:border-red-900/50 hover:text-red-500"
                    : "bg-amber-700/10 border-amber-900/30 text-amber-600 hover:bg-amber-700/20"
                }`}
              >
                {isLoading ? (
                  "PROCESSING..."
                ) : joined ? (
                  <>
                    <Check size={12} className="group-hover/btn:hidden" />
                    <LogOut
                      size={12}
                      className="hidden group-hover/btn:block"
                    />
                    <span className="group-hover/btn:hidden">
                      Member_Active
                    </span>
                    <span className="hidden group-hover/btn:block">
                      Leave_Sector
                    </span>
                  </>
                ) : (
                  "Join_Sequence"
                )}
              </button>
            )}

            <button className="bg-stone-900 border border-stone-800 p-2 hover:border-stone-700 transition-all">
              <Settings size={18} className="text-stone-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
