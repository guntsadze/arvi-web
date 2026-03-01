"use client";

import { useState } from "react";
import {
  Activity,
  Trophy,
  Zap,
  Car,
  Users,
  UserPlus,
  Terminal,
  ShieldAlert,
} from "lucide-react";
import { UserPosts } from "@/components/profile/UserPosts";
import { UserGarage } from "@/components/profile/UserGarage";
import { UserFollowers } from "@/components/profile/UserFollowers";
import { UserFollowing } from "@/components/profile/UserFollowing";

type TabType = "posts" | "garage" | "followers" | "following";

interface Props {
  user: any;
  userId: string;
}

export default function ProfileContentWrapper({ user, userId }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>("posts");

  return (
    <div className="min-h-screen bg-[#1c1917] relative selection:bg-orange-500/30">
      {/* GLOBAL BACKGROUND GRID */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      <div
        className="fixed inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #44403c 1px, transparent 1px), linear-gradient(to bottom, #44403c 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-10 py-10 ">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 ">
          {/* SIDEBAR - SYSTEM STATUS & BIO */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#201d1b] border border-stone-800 p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 opacity-20 text-stone-600 group-hover:text-orange-500 transition-colors">
                <Terminal size={40} strokeWidth={1} />
              </div>

              <h3 className="text-[10px] font-mono font-black text-orange-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-orange-500 animate-pulse" />
                Driver_Telemetry
              </h3>

              <div className="space-y-4 font-mono text-xs">
                <div className="flex justify-between border-b border-stone-800/50 pb-2">
                  <span className="text-stone-500 uppercase">Status</span>
                  <span className="text-green-500">ONLINE_IDLE</span>
                </div>
                <div className="flex justify-between border-b border-stone-800/50 pb-2">
                  <span className="text-stone-500 uppercase">Sector</span>
                  <span className="text-stone-300">Tbilisi, GE</span>
                </div>
                <div className="pt-2">
                  <span className="text-stone-500 uppercase block mb-2 text-[9px]">
                    Manifesto:
                  </span>
                  <p className="text-stone-400 leading-relaxed italic">
                    "{user.bio || "// NO_DATA_STREAM_FOUND"}"
                  </p>
                </div>
              </div>
            </div>

            {/* QUICK STATS */}
            <div className="grid grid-cols-1 gap-2">
              <QuickStat
                label="Total_XP"
                value="1,240"
                icon={<Trophy size={12} />}
              />
              <QuickStat
                label="Reputation"
                value="Level_4"
                icon={<ShieldAlert size={12} />}
              />
            </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="lg:col-span-8 space-y-6">
            {/* NAVIGATION TABS */}
            <div className="bg-[#201d1b] border border-stone-800 p-1 shadow-2xl relative">
              <div className="flex flex-wrap font-mono text-[10px] tracking-widest bg-black/20">
                <TabButton
                  icon={<Activity size={14} />}
                  label="Log_Feed"
                  isActive={activeTab === "posts"}
                  onClick={() => setActiveTab("posts")}
                />
                <TabButton
                  icon={<Car size={14} />}
                  label="Garage_Manifest"
                  isActive={activeTab === "garage"}
                  onClick={() => setActiveTab("garage")}
                />
                <TabButton
                  icon={<Users size={14} />}
                  label="Followers"
                  count={user.followersCount}
                  isActive={activeTab === "followers"}
                  onClick={() => setActiveTab("followers")}
                />
                <TabButton
                  icon={<UserPlus size={14} />}
                  label="Following"
                  count={user.followingCount}
                  isActive={activeTab === "following"}
                  onClick={() => setActiveTab("following")}
                />
              </div>
            </div>

            {/* CONTENT DISPLAY */}
            <div className="min-h-[500px]">
              {activeTab === "posts" && <UserPosts userId={userId} />}
              {activeTab === "garage" && <UserGarage userId={userId} />}
              {activeTab === "followers" && <UserFollowers userId={userId} />}
              {activeTab === "following" && <UserFollowing userId={userId} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// დამხმარე კომპონენტები
function QuickStat({ label, value, icon }: any) {
  return (
    <div className="bg-[#201d1b] border border-stone-800 px-4 py-2 flex justify-between items-center font-mono">
      <div className="flex items-center gap-2 text-stone-500 text-[9px] uppercase tracking-widest">
        {icon} {label}
      </div>
      <div className="text-stone-200 text-xs font-bold">{value}</div>
    </div>
  );
}

function TabButton({ icon, label, count, isActive, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 uppercase transition-all relative border-r last:border-r-0 border-stone-800/50 ${
        isActive
          ? "text-orange-500 bg-orange-500/5"
          : "text-stone-500 hover:bg-stone-800/30 hover:text-stone-300"
      }`}
    >
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
      )}
      <span className={isActive ? "text-orange-500" : "text-stone-600"}>
        {icon}
      </span>
      <span className="hidden sm:inline">{label}</span>
      {count !== undefined && (
        <span className="text-[9px] opacity-50">[{count}]</span>
      )}
    </button>
  );
}
