"use client";

import { useState } from "react";
import { Activity, Trophy, Zap } from "lucide-react";
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
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Sidebar - აქ გადმოვიდა StatCard-ები */}
      <div className="lg:col-span-4 space-y-6">
        <div className="grid grid-cols-3 gap-2">
          <StatCard
            label="Posts"
            value={user.postsCount || 0}
            icon={<Activity size={14} />}
            isActive={activeTab === "posts"}
            onClick={() => setActiveTab("posts")}
          />
          <StatCard
            label="Followers"
            value={user.followersCount || 0}
            icon={<Trophy size={14} />}
            isActive={activeTab === "followers"}
            onClick={() => setActiveTab("followers")}
          />
          <StatCard
            label="Following"
            value={user.followingCount || 0}
            icon={<Zap size={14} />}
            isActive={activeTab === "following"}
            onClick={() => setActiveTab("following")}
          />
        </div>

        <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-xl">
          <h3 className="text-xs font-bold text-orange-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <div className="w-1 h-4 bg-orange-500" /> Driver's Statement
          </h3>
          <p className="text-neutral-300 leading-relaxed font-light">
            {user.bio || "No telemetry data recorded for this driver."}
          </p>
        </div>

        {/* ... (სხვა სტატიკური ინფორმაცია: Status, Joined და ა.შ.) */}
      </div>

      {/* Content Area */}
      <div className="lg:col-span-8 space-y-6">
        {/* ჰორიზონტალური ტაბები - სადაც მხოლოდ გარაჟი და სხვა საჭირო ტაბები დარჩება */}
        <div className="flex gap-8 border-b border-neutral-800 mb-6 font-mono text-[10px] tracking-widest">
          <button
            onClick={() => setActiveTab("garage")}
            className={`pb-4 uppercase transition-colors ${
              activeTab === "garage"
                ? "border-b-2 border-orange-500 text-white font-bold"
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            Garage
          </button>
          {/* სურვილისამებრ შეგიძლია აქაც დატოვო Followers/Following */}
        </div>

        {/* კონტენტის ჩვენება სთეითის მიხედვით */}
        <div className="transition-all duration-300">
          {activeTab === "posts" && <UserPosts userId={userId} />}
          {activeTab === "garage" && <UserGarage userId={userId} />}
          {activeTab === "followers" && <UserFollowers userId={userId} />}
          {activeTab === "following" && <UserFollowing userId={userId} />}
        </div>
      </div>
    </div>
  );
}

// შიდა StatCard კომპონენტი კლიკებთან სამუშაოდ
function StatCard({ label, value, icon, onClick, isActive }: any) {
  return (
    <button
      onClick={onClick}
      className={`bg-neutral-900 border p-4 rounded-xl transition-all group text-left w-full ${
        isActive
          ? "border-orange-500 bg-orange-500/5"
          : "border-neutral-800 hover:border-neutral-700"
      }`}
    >
      <div
        className={`flex items-center gap-2 mb-1 transition-colors ${
          isActive
            ? "text-orange-500"
            : "text-neutral-500 group-hover:text-orange-500"
        }`}
      >
        {icon}
        <span className="text-[10px] uppercase font-black tracking-tighter">
          {label}
        </span>
      </div>
      <div
        className={`text-2xl font-black italic tracking-tighter font-mono ${
          isActive ? "text-white" : "text-neutral-200"
        }`}
      >
        {value.toLocaleString()}
      </div>
    </button>
  );
}
