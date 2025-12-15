"use client";

import Image from "next/image";
import { useState } from "react";
import { Edit3, MapPin, Globe, Car, ShieldCheck } from "lucide-react";

type Props = {
  user: any;
};

export default function UserProfile({ user }: Props) {
  const [editMode, setEditMode] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Cover */}
      <div className="relative h-56 bg-gradient-to-r from-red-700 to-black">
        {user.coverPhoto && (
          <Image
            src={user.coverPhoto}
            alt="cover"
            fill
            className="object-cover"
          />
        )}
      </div>

      {/* Profile Card */}
      <div className="max-w-6xl mx-auto px-6 -mt-20">
        <div className="bg-zinc-900 rounded-xl shadow-xl p-6 flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <div className="relative w-32 h-32">
            <Image
              src={user.avatar || "/default-avatar.png"}
              alt={user.firstName}
              fill
              className="rounded-full object-cover border-4 border-zinc-900"
            />
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-zinc-400">@{user.username}</p>
              </div>

              <button
                onClick={() => setEditMode(!editMode)}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm"
              >
                <Edit3 size={16} />
                რედაქტირება
              </button>
            </div>

            {/* Meta */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-zinc-300">
              {user.location && (
                <div className="flex items-center gap-2">
                  <MapPin size={16} /> {user.location}
                </div>
              )}

              {user.website && (
                <div className="flex items-center gap-2">
                  <Globe size={16} /> {user.website}
                </div>
              )}

              <div className="flex items-center gap-2">
                <Car size={16} /> პოსტები: {user.postsCount}
              </div>

              <div className="flex items-center gap-2">
                <ShieldCheck size={16} />
                {user.isVerified ? "ვერიფიცირებული" : "არავერიფიცირებული"}
              </div>
            </div>

            {/* Bio */}
            <div className="mt-4 text-zinc-200">
              {editMode ? (
                <textarea
                  defaultValue={user.bio || ""}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3"
                  rows={3}
                />
              ) : (
                <p>{user.bio || "ბიოგრაფია არ არის დამატებული"}</p>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <Stat title="Followers" value={user.followersCount} />
          <Stat title="Following" value={user.followingCount} />
          <Stat title="Posts" value={user.postsCount} />
          <Stat title="Premium" value={user.isPremium ? "Yes" : "No"} />
        </div>

        {/* Placeholder for Cars / Posts */}
        <div className="mt-10 bg-zinc-900 rounded-xl p-6 text-center text-zinc-400">
          🚗 აქ დაემატება მომხმარებლის მანქანები / პოსტები
        </div>
      </div>
    </div>
  );
}

function Stat({ title, value }: { title: string; value: any }) {
  return (
    <div className="bg-zinc-900 rounded-xl p-4 text-center">
      <div className="text-xl font-bold">{value}</div>
      <div className="text-zinc-400 text-sm">{title}</div>
    </div>
  );
}
