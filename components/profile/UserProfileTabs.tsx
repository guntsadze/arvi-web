"use client";

import { useState } from "react";
import { UserPosts } from "./UserPosts";
import { UserGarage } from "./UserGarage";

type Props = {
  userId: string;
};

type Tab = "posts" | "garage" | "achievements";

export default function UserProfileTabs({ userId }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("posts");

  return (
    <>
      {/* Tabs */}
      <div className="flex gap-8 border-b border-neutral-800 mb-6 font-mono text-[10px] tracking-widest">
        <button
          onClick={() => setActiveTab("posts")}
          className={`pb-4 uppercase ${
            activeTab === "posts"
              ? "border-b-2 border-orange-500 text-white font-bold"
              : "text-neutral-500"
          }`}
        >
          Telemetry Feed
        </button>

        <button
          onClick={() => setActiveTab("garage")}
          className={`pb-4 uppercase ${
            activeTab === "garage"
              ? "border-b-2 border-orange-500 text-white font-bold"
              : "text-neutral-500"
          }`}
        >
          Garage
        </button>

        <button
          onClick={() => setActiveTab("achievements")}
          className={`pb-4 uppercase ${
            activeTab === "achievements"
              ? "border-b-2 border-orange-500 text-white font-bold"
              : "text-neutral-500"
          }`}
        >
          Achievements
        </button>
      </div>

      {/* Content */}
      {activeTab === "posts" && (
        <div className="p-2">
          <UserPosts userId={userId} />
        </div>
      )}

      {activeTab === "garage" && (
        <div className="p-2">
          <UserGarage userId={userId} />
        </div>
      )}

      {activeTab === "achievements" && (
        <div className="p-2 text-neutral-500 font-mono text-xs">
          Coming soon...
        </div>
      )}
    </>
  );
}
