"use client";

import { useState } from "react";
import { UserPosts } from "./UserPosts";
import { UserGarage } from "./UserGarage";
import { UserFollowers } from "./UserFollowers";

type Props = {
  userId: string;
};

type Tab = "posts" | "garage" | "followers";

export default function UserProfileTabs({ userId }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("posts");

  return (
    <>
      {/* Tabs */}
      <div className="flex gap-8 border-b border-border mb-6 font-mono text-[10px] tracking-widest">
        <button
          onClick={() => setActiveTab("garage")}
          className={`pb-4 uppercase transition-colors ${
            activeTab === "garage"
              ? "border-b-2 border-accent text-white font-bold"
              : "text-text-muted hover:text-text-secondary"
          }`}
        >
          Garage
        </button>

        <button
          onClick={() => setActiveTab("followers")}
          className={`pb-4 uppercase transition-colors ${
            activeTab === "followers"
              ? "border-b-2 border-accent text-white font-bold"
              : "text-text-muted hover:text-text-secondary"
          }`}
        >
          Followers
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

      {activeTab === "followers" && (
        <div className="p-2">
          <UserFollowers userId={userId} />
        </div>
      )}
    </>
  );
}
