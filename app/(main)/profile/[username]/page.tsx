import { usersService } from "@/services/user/user.service";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Link as LinkIcon,
  Calendar,
  Mail,
  ShieldCheck,
  Settings,
  MessageSquare,
  UserPlus,
  Clock,
  Hash,
} from "lucide-react";
import { format } from "date-fns";
import { ka } from "date-fns/locale";

type Props = {
  params: Promise<{
    username: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { username } = await params;
  const user = await usersService.getByUsername(username);

  console.log("Fetched User:", user);

  if (!user) {
    notFound();
  }

  // თარიღის ფორმატირება
  const joinDate = user.createdAt
    ? format(new Date(user.createdAt), "d MMMM, yyyy", { locale: ka })
    : "უცნობია";

  const lastUpdate = user.updatedAt
    ? format(new Date(user.updatedAt), "dd/MM/yyyy", { locale: ka })
    : "N/A";

  return (
    <div className="min-h-screen bg-[#1c1917] bg-[radial-gradient(#292524_1px,transparent_1px)] [background-size:20px_20px] pb-20 pt-10 px-4">
      {/* Main Container - The "Dossier" Folder */}
      <div className="mx-auto relative group">
        {/* Backing Shadow Layer */}
        <div
          className="absolute inset-0 bg-black/80 transform translate-x-2 translate-y-2 lg:translate-x-4 lg:translate-y-4 rounded-sm"
          style={{ filter: "url(#rugged-tear-profile)" }}
        />

        {/* Content Layer */}
        <div
          className="relative bg-[#dcd8c8] min-h-[600px] overflow-hidden rounded-sm"
          style={{ filter: "url(#rugged-tear-profile)" }}
        >
          {/* --- TOP SECTION: Cover & Header --- */}
          <div className="relative">
            {/* Cover Photo Area (Industrial Mesh Pattern if null) */}
            <div className="h-48 w-full bg-[#292524] relative border-b-4 border-stone-800">
              {user.coverPhoto ? (
                <Image
                  src={user.coverPhoto}
                  alt="Cover"
                  fill
                  className="object-cover opacity-80"
                />
              ) : (
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]" />
              )}

              {/* Decorative Overlay */}
              <div className="absolute top-4 right-4 bg-stone-900/80 px-3 py-1 border border-stone-600">
                <span className="text-[10px] font-mono text-amber-500 tracking-widest uppercase">
                  SECURE FILE: #{user.id.slice(-6).toUpperCase()}
                </span>
              </div>
            </div>

            {/* Avatar & Main Info Row */}
            <div className="px-6 md:px-10 pb-6 relative flex flex-col md:flex-row items-end md:items-center gap-6 -mt-16">
              {/* Avatar Container */}
              <div className="relative group/avatar">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-[6px] border-[#dcd8c8] bg-stone-800 shadow-xl overflow-hidden relative z-10">
                  <Image
                    src={user.avatar || "/default-avatar.png"}
                    alt={user.username}
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Status Indicator */}
                <div
                  className={`absolute bottom-2 right-2 z-20 w-6 h-6 rounded-full border-4 border-[#dcd8c8] ${
                    user.showOnlineStatus ? "bg-green-500" : "bg-stone-500"
                  }`}
                />

                {/* Verification Badge */}
                {user.isVerified && (
                  <div
                    className="absolute -top-2 -right-2 z-20 bg-blue-600 text-white p-1.5 rounded-full border-2 border-[#dcd8c8] shadow-md"
                    title="Verified Driver"
                  >
                    <ShieldCheck size={20} />
                  </div>
                )}
              </div>

              {/* Name & Role */}
              <div className="flex-1 pt-16 md:pt-0 mb-4 md:mb-0">
                <h1 className="text-3xl md:text-4xl font-black text-stone-900 uppercase tracking-tight flex items-center gap-3">
                  {user.firstName} {user.lastName}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-stone-600 font-mono text-lg tracking-wide">
                    @{user.username}
                  </p>

                  {/* Role Tag */}
                  <span
                    className={`
                        text-[10px] font-bold px-2 py-0.5 border rounded-sm uppercase tracking-wider
                        ${
                          user.role === "ADMIN"
                            ? "bg-red-900/10 text-red-800 border-red-800"
                            : "bg-stone-400/20 text-stone-600 border-stone-500"
                        }
                     `}
                  >
                    {user.role}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-4 md:mb-0 w-full md:w-auto">
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-stone-800 text-[#EBE9E1] font-black uppercase tracking-widest text-xs shadow-[4px_4px_0px_0px_#b45309] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#b45309] active:shadow-none transition-all">
                  <UserPlus size={16} /> Follow
                </button>
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 border-2 border-stone-800 text-stone-800 font-black uppercase tracking-widest text-xs hover:bg-stone-800 hover:text-[#EBE9E1] transition-colors">
                  <MessageSquare size={16} /> Msg
                </button>
              </div>
            </div>
          </div>

          {/* --- MIDDLE SECTION: Grid Layout --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-6 md:px-10 py-8 border-t-2 border-stone-400 border-dashed">
            {/* LEFT COLUMN: Personal Specs */}
            <div className="lg:col-span-1 space-y-6">
              {/* Bio / Manifesto */}
              <div className="bg-[#f2f0e9] p-4 border border-stone-300 shadow-sm relative rotate-1">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-4 bg-[#d4c5a3] opacity-60" />{" "}
                {/* Tape */}
                <h3 className="text-xs font-black text-stone-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Hash size={12} /> Driver's Manifesto
                </h3>
                <p className="font-serif text-stone-800 text-sm leading-relaxed italic">
                  {user.bio ||
                    "No personal records found in the archive. This driver prefers to stay anonymous."}
                </p>
              </div>

              {/* Technical Data List */}
              <div className="space-y-3 font-mono text-xs text-stone-700">
                {user.location && (
                  <div className="flex items-center gap-3">
                    <MapPin size={14} className="text-amber-600" />
                    <span className="uppercase">{user.location}</span>
                  </div>
                )}
                {user.website && (
                  <div className="flex items-center gap-3">
                    <LinkIcon size={14} className="text-amber-600" />
                    <a
                      href={user.website}
                      target="_blank"
                      className="hover:underline text-blue-800 truncate"
                    >
                      {user.website}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Mail size={14} className="text-amber-600" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar size={14} className="text-amber-600" />
                  <span>Joined: {joinDate}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={14} className="text-stone-400" />
                  <span className="text-stone-500">
                    Last Update: {lastUpdate}
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Dashboard & Stats */}
            <div className="lg:col-span-2">
              {/* Dashboard Gauges (Stats) */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <StatBox label="Posts" value={user.postsCount} />
                <StatBox label="Followers" value={user.followersCount} />
                <StatBox label="Following" value={user.followingCount} />
              </div>

              {/* Empty State / Content Area Placeholder */}
              <div className="border-4 border-double border-stone-300 min-h-[200px] flex flex-col items-center justify-center p-8 text-center bg-[#e6e4dc]">
                <Settings className="w-10 h-10 text-stone-400 mb-2 animate-spin-slow" />
                <h3 className="text-stone-600 font-bold uppercase tracking-widest text-sm">
                  Activity Log
                </h3>
                <p className="text-stone-500 font-mono text-xs mt-1">
                  Recent check-ins and maintenance records will appear here.
                </p>
              </div>
            </div>
          </div>

          {/* Footer of the Dossier */}
          <div className="bg-[#292524] p-2 flex justify-between items-center px-6">
            <span className="text-[10px] text-stone-500 font-mono uppercase">
              ID: {user.id}
            </span>
            <span className="text-[10px] text-stone-500 font-mono uppercase">
              Provider: {user.provider}
            </span>
          </div>
        </div>
      </div>

      {/* SVG Filters (Specific for Profile) */}
      <svg className="fixed w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <filter
            id="rugged-tear-profile"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04"
              numOctaves="4"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="4"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
}

// Helper Component for Stats
function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-stone-800 p-4 border-2 border-stone-600 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center group hover:border-amber-600 transition-colors">
      <span className="text-3xl font-black text-[#EBE9E1] font-mono group-hover:text-amber-500 transition-colors">
        {value}
      </span>
      <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400 mt-1">
        {label}
      </span>
    </div>
  );
}
