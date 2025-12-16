"use client";

import Image from "next/image";
import Link from "next/link";
import { UserPlus, ShieldCheck, MapPin, Hash, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { socialService } from "@/services/social/social.service";

// 1. ტიპების განსაზღვრა
type User = {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  coverPhoto: string | null;
  role: "USER" | "ADMIN";
  isVerified: boolean;
  followersCount: number;
  postsCount: number;
  location: string | null;
};

export default function Page() {
  // თავიდანვე ვუთითებთ რომ ეს არის User-ების მასივი
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    apiClient
      .get("/users")
      .then((response) => {
        // --- ცვლილება აქ არის ---
        // ლოგის მიხედვით სტრუქტურაა: response.data.data
        const usersArray = response.data?.data || [];
        setUsers(usersArray);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
      });
  }, []);

  console.log("Current Users State:", users);

  const handleFollow = async (userId: string) => {
    try {
      const res = await socialService.toggleFollow(userId);
      const { following } = res.data; // backend უნდა აბრუნებდეს { following: true/false }

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? {
                ...u,
                isFollowing: following,
                followersCount: following
                  ? u.followersCount + 1
                  : u.followersCount - 1,
              }
            : u
        )
      );
    } catch (e) {
      console.error("Follow error", e);
    }
  };

  return (
    <div className="min-h-screen bg-[#1c1917] bg-[radial-gradient(#292524_1px,transparent_1px)] [background-size:20px_20px] py-12 px-4">
      {/* სათაური */}
      <div className="max-w-7xl mx-auto mb-10 border-b-4 border-double border-stone-700 pb-4">
        <h1 className="text-3xl md:text-5xl font-black text-[#dcd8c8] uppercase tracking-tighter flex items-center gap-4">
          <Hash className="text-amber-600" size={40} />
          Personnel Database
        </h1>
        <p className="text-stone-500 font-mono text-xs mt-2 uppercase tracking-[0.3em]">
          Secure Archive • Authorized Access Only
        </p>
      </div>

      {/* ბარათების გრიდი */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* აქ დავამატე შემოწმება (Array.isArray), რათა დარწმუნებულები ვიყოთ რომ map იმუშავებს */}
        {Array.isArray(users) && users.length > 0 ? (
          users.map((user) => (
            <div key={user.id} className="relative group">
              {/* უკანა ჩრდილი/ფონი */}
              <div className="absolute inset-0 bg-stone-900 translate-x-2 translate-y-2 rounded-sm" />

              {/* ბარათის შიგთავსი */}
              <div className="relative bg-[#dcd8c8] border border-stone-500 rounded-sm overflow-hidden flex flex-col h-full transition-transform hover:-translate-y-1 duration-200">
                {/* --- ზედა ნაწილი: Cover & Avatar --- */}
                <div className="relative h-24 bg-stone-800 border-b-2 border-stone-600">
                  {user.coverPhoto ? (
                    <Image
                      src={user.coverPhoto}
                      alt="cover"
                      fill
                      className="object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]" />
                  )}

                  <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/60 border border-stone-500 backdrop-blur-sm">
                    <span className="text-[9px] text-amber-500 font-mono tracking-widest">
                      #{user.id.slice(-4).toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="px-5 pt-0 flex-1 flex flex-col">
                  <div className="relative -mt-10 mb-3 w-fit">
                    <div className="w-20 h-20 rounded-full border-4 border-[#dcd8c8] bg-stone-700 relative overflow-hidden shadow-lg">
                      <Image
                        src={user.avatar || "/default-avatar.png"}
                        alt={user.username}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {user.isVerified && (
                      <div className="absolute -bottom-1 -right-1 bg-blue-700 text-white p-1 rounded-full border-2 border-[#dcd8c8]">
                        <ShieldCheck size={12} />
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-xl font-black text-stone-900 uppercase leading-none truncate pr-2">
                        {user.firstName} {user.lastName}
                      </h3>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 border rounded-sm font-bold uppercase tracking-wider ${
                          user.role === "ADMIN"
                            ? "bg-red-900/20 text-red-900 border-red-800"
                            : "bg-stone-400/20 text-stone-600 border-stone-400"
                        }`}
                      >
                        {user.role}
                      </span>
                    </div>
                    <p className="text-stone-600 font-mono text-xs mb-3">
                      @{user.username}
                    </p>

                    <div className="flex items-center gap-4 py-2 border-t border-b border-stone-300 border-dashed">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-stone-800">
                          {user.followersCount}
                        </span>
                        <span className="text-[9px] text-stone-500 uppercase tracking-wide">
                          Followers
                        </span>
                      </div>
                      <div className="w-[1px] h-6 bg-stone-300" />
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-stone-800">
                          {user.postsCount}
                        </span>
                        <span className="text-[9px] text-stone-500 uppercase tracking-wide">
                          Posts
                        </span>
                      </div>
                      {user.location && (
                        <>
                          <div className="w-[1px] h-6 bg-stone-300" />
                          <div className="flex flex-col truncate">
                            <span className="text-xs font-black text-stone-800 truncate flex items-center gap-1">
                              <MapPin size={10} /> {user.location}
                            </span>
                            <span className="text-[9px] text-stone-500 uppercase tracking-wide">
                              Loc
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="mt-auto pb-5 flex gap-2">
                    <button
                      onClick={() => handleFollow(user.id)}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 font-black uppercase tracking-widest text-[10px] transition-all
    ${
      user.isFollowing
        ? "bg-amber-600 text-black shadow-[3px_3px_0px_0px_#000]"
        : "bg-stone-800 text-[#EBE9E1] shadow-[3px_3px_0px_0px_#b45309]"
    }
  `}
                    >
                      <UserPlus size={14} />
                      {user.isFollowing ? "Unfollow" : "Follow"}
                    </button>

                    <Link
                      href={`/profile/${user.username}`}
                      className="flex items-center justify-center px-3 py-2 border-2 border-stone-800 text-stone-800 font-bold hover:bg-stone-200 transition-colors"
                      title="View Dossier"
                    >
                      <Shield size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          // თუ იუზერები ჯერ არ ჩატვირთულა ან ცარიელია
          <div className="col-span-full text-center text-stone-500 font-mono py-20">
            INITIALIZING DATABASE... OR NO RECORDS FOUND.
          </div>
        )}
      </div>
    </div>
  );
}
