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
  online: boolean;
}

export default function ProfileContentWrapper({ user, userId, online }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>("posts");

  return (
    <div className="min-h-screen bg-background relative selection:bg-accent/30">
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
          {/* მარცხენა პანელი - სისტემური სტატუსი და ბიო */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-surface-1 border border-border p-6 relative overflow-hidden group">
              {/* დეკორატიული ელემენტი */}
              <div className="absolute top-0 right-0 p-2 opacity-10 text-text-secondary group-hover:text-accent transition-colors">
                <Terminal size={40} strokeWidth={1} />
              </div>

              {/* სათაური / ინდიკატორი */}
              <h3 className="text-[10px] font-mono font-black text-accent uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-accent animate-pulse" />
                პროფილის დეტალები
              </h3>

              <div className="space-y-6 font-mono text-[11px]">
                {/* სექცია: ძირითადი მონაცემები */}
                <div className="space-y-3">
                  <DataLine
                    label="ფსევდონიმი"
                    value={user.username}
                    icon={<Users size={12} />}
                  />
                  <DataLine
                    label="ლოკაცია"
                    value={user.location}
                    icon={<Activity size={12} />}
                  />
                  <DataLine
                    label="ვებ-გვერდი"
                    value={user.website}
                    isLink
                    icon={<Zap size={12} />}
                  />
                </div>

                {/* სექცია: ქსელური სტატისტიკა */}
                <div className="space-y-3">
                  <p className="text-[9px] text-text-secondary uppercase tracking-widest border-b border-border/50 pb-1">
                    აქტივობა
                  </p>
                  <DataLine
                    label="პოსტები"
                    value={user.postsCount}
                    color="text-accent"
                  />
                  <DataLine label="გამომწერები" value={user.followersCount} />
                  <DataLine label="გამოწერილი" value={user.followingCount} />
                </div>

                {/* სექცია: სისტემური სტატუსი */}
                <div className="space-y-3">
                  <p className="text-[9px] text-text-secondary uppercase tracking-widest border-b border-border/50 pb-1">
                    რეესტრი
                  </p>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-text-secondary uppercase">
                      ავტორიზაცია
                    </span>
                    <span
                      className={
                        user.isVerified ? "text-info" : "text-text-secondary"
                      }
                    >
                      {user.isVerified ? "ვერიფიცირებული" : "სტანდარტული"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-text-secondary uppercase">
                      რეგისტრაცია
                    </span>
                    <span className="text-text-secondary">
                      {new Date(user.createdAt).toLocaleDateString("ka-GE")}
                    </span>
                  </div>
                </div>

                {/* ბიოგრაფია */}
                <div className="pt-4 mt-2 border-t border-accent/10">
                  <span className="text-accent/50 uppercase block mb-2 text-[9px] tracking-[0.2em]">
                    ბიო:
                  </span>
                  <div className="bg-black/20 p-3 border-l-2 border-accent/30">
                    <p className="text-text-secondary leading-relaxed italic text-xs">
                      {user.bio ? `"${user.bio}"` : "// ინფორმაცია არ მოიძებნა"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="lg:col-span-8 space-y-6">
            {/* NAVIGATION TABS */}
            <div className="bg-surface-1 border border-border p-1 shadow-2xl relative">
              <div className="flex flex-wrap font-mono text-[10px] tracking-widest bg-black/20">
                <TabButton
                  icon={<Activity size={14} />}
                  label="სიახლეები"
                  isActive={activeTab === "posts"}
                  onClick={() => setActiveTab("posts")}
                />
                <TabButton
                  icon={<Car size={14} />}
                  label="გარაჟი"
                  isActive={activeTab === "garage"}
                  onClick={() => setActiveTab("garage")}
                />
                <TabButton
                  icon={<Users size={14} />}
                  label="გამომწერები"
                  count={user.followersCount}
                  isActive={activeTab === "followers"}
                  onClick={() => setActiveTab("followers")}
                />
                <TabButton
                  icon={<UserPlus size={14} />}
                  label="გამოწერილი"
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
    <div className="bg-surface-1 border border-border px-4 py-2 flex justify-between items-center font-mono">
      <div className="flex items-center gap-2 text-text-secondary text-[9px] uppercase tracking-widest">
        {icon} {label}
      </div>
      <div className="text-text-primary text-xs font-bold">{value}</div>
    </div>
  );
}

function TabButton({ icon, label, count, isActive, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 uppercase transition-all relative border-r last:border-r-0 border-border/50 ${
        isActive
          ? "text-accent bg-accent/5"
          : "text-text-secondary hover:bg-surface-1-hover/30 hover:text-text-secondary"
      }`}
    >
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
      )}
      <span className={isActive ? "text-accent" : "text-text-secondary"}>
        {icon}
      </span>
      <span className="hidden sm:inline">{label}</span>
      {count !== undefined && (
        <span className="text-[9px] opacity-50">[{count}]</span>
      )}
    </button>
  );
}

{
  /* დამხმარე კომპონენტი ლოგიკური ხაზებისთვის */
}
function DataLine({
  label,
  value,
  icon,
  isLink,
  color = "text-text-secondary",
}: any) {
  return (
    <div className="flex justify-between items-center py-0.5 group/line">
      <div className="flex items-center gap-2 text-text-secondary">
        <span className="opacity-50">{icon}</span>
        <span className="uppercase">{label}</span>
      </div>
      <span
        className={`${color} font-bold ${isLink ? "hover:text-accent cursor-pointer underline decoration-accent/30 transition-colors" : ""}`}
      >
        {value || "// ცარიელი"}
      </span>
    </div>
  );
}
